import * as ts from "typescript"

const LOOP_LIMIT = 100_000

// Prepended to transpiled student code.
// Uses break instead of throw so DevTools doesn't pause on exceptions.
// The __killed flag propagates the stop signal up through nested loops.
const GUARD_PREAMBLE = `var __killed = false;
function __onLoop(msg) {
  __killed = true;
  console.error(msg);
  try { parent.postMessage({ type: "sketch-error", message: msg }, "*"); } catch (_) {}
}
`

type WorkerRequest = {
  code: string
}

type WorkerResponse = {
  js?: string
  error?: string
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { code } = e.data

  try {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.None,
        target: ts.ScriptTarget.ES2020,
        strict: false,
      },
      transformers: { before: [loopGuardTransformer] },
    })

    const js = result.outputText
      .replace(/^"use strict";\s*/m, "")
      .replace(/^Object\.defineProperty\(exports,\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);\s*/m, "")
    const response: WorkerResponse = { js: GUARD_PREAMBLE + js }
    self.postMessage(response)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const response: WorkerResponse = { error: message }
    self.postMessage(response)
  }
}

function loopGuardTransformer(ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
  const { factory } = ctx
  let id = 0

  const visit = (node: ts.Node): ts.Node => {
    if (
      ts.isWhileStatement(node) ||
      ts.isForStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isDoStatement(node)
    ) {
      const counter = `__lc${id++}`

      // let __lcN = 0;
      const counterDecl = factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [factory.createVariableDeclaration(counter, undefined, undefined, factory.createNumericLiteral(0))],
          ts.NodeFlags.Let,
        ),
      )

      // if (__killed) break;  — propagates kill signal from an inner loop
      const killedBreak = factory.createIfStatement(
        factory.createIdentifier("__killed"),
        factory.createBreakStatement(),
      )

      // if (++__lcN > LOOP_LIMIT) { __onLoop("..."); break; }
      const limitBreak = factory.createIfStatement(
        factory.createBinaryExpression(
          factory.createPrefixUnaryExpression(ts.SyntaxKind.PlusPlusToken, factory.createIdentifier(counter)),
          ts.SyntaxKind.GreaterThanToken,
          factory.createNumericLiteral(LOOP_LIMIT),
        ),
        factory.createBlock([
          factory.createExpressionStatement(
            factory.createCallExpression(factory.createIdentifier("__onLoop"), undefined, [
              factory.createStringLiteral(`Infinite loop: exceeded ${LOOP_LIMIT.toLocaleString()} iterations`),
            ]),
          ),
          factory.createBreakStatement(),
        ]),
      )

      const rawBody = (node as ts.IterationStatement).statement
      const visitedBody = ts.visitNode(rawBody, visit) as ts.Statement

      const newBody = ts.isBlock(visitedBody)
        ? factory.updateBlock(visitedBody, [killedBreak, limitBreak, ...visitedBody.statements])
        : factory.createBlock([killedBreak, limitBreak, visitedBody])

      let newLoop: ts.Statement
      if (ts.isWhileStatement(node)) {
        newLoop = factory.updateWhileStatement(node, node.expression, newBody)
      } else if (ts.isForStatement(node)) {
        newLoop = factory.updateForStatement(node, node.initializer, node.condition, node.incrementor, newBody)
      } else if (ts.isForInStatement(node)) {
        newLoop = factory.updateForInStatement(node, node.initializer, node.expression, newBody)
      } else if (ts.isForOfStatement(node)) {
        newLoop = factory.updateForOfStatement(node, node.awaitModifier, node.initializer, node.expression, newBody)
      } else {
        newLoop = factory.updateDoStatement(node, newBody, (node as ts.DoStatement).expression)
      }

      return factory.createBlock([counterDecl, newLoop])
    }

    return ts.visitEachChild(node, visit, ctx)
  }

  return (sf) => ts.visitNode(sf, visit) as ts.SourceFile
}
