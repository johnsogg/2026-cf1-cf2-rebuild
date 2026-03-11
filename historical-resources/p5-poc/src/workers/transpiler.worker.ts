import * as ts from "typescript"

const LOOP_LIMIT = 1_000_000

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

    const response: WorkerResponse = { js: result.outputText }
    self.postMessage(response)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const response: WorkerResponse = { error: message }
    self.postMessage(response)
  }
}

// Injects a per-loop iteration counter into every loop body.
// When the counter exceeds LOOP_LIMIT, throws — terminating the loop.
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

      // if (++__lcN > LOOP_LIMIT) throw new Error(...)
      const guard = factory.createIfStatement(
        factory.createBinaryExpression(
          factory.createPrefixUnaryExpression(ts.SyntaxKind.PlusPlusToken, factory.createIdentifier(counter)),
          ts.SyntaxKind.GreaterThanToken,
          factory.createNumericLiteral(LOOP_LIMIT),
        ),
        factory.createThrowStatement(
          factory.createNewExpression(factory.createIdentifier("Error"), undefined, [
            factory.createStringLiteral(`Infinite loop: exceeded ${LOOP_LIMIT.toLocaleString()} iterations`),
          ]),
        ),
      )

      const rawBody = (node as ts.IterationStatement).statement
      const visitedBody = ts.visitNode(rawBody, visit) as ts.Statement

      const newBody = ts.isBlock(visitedBody)
        ? factory.updateBlock(visitedBody, [guard, ...visitedBody.statements])
        : factory.createBlock([guard, visitedBody])

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

      // Wrap in a block so the counter decl is scoped to this loop
      return factory.createBlock([counterDecl, newLoop])
    }

    return ts.visitEachChild(node, visit, ctx)
  }

  return (sf) => ts.visitNode(sf, visit) as ts.SourceFile
}
