// The ten wicked-problem criteria as short labels in bubbles, colored by the
// part of the "you are here" map they belong to: 1 the starting condition,
// 2-6 the desired ending condition, 7-10 the approach for getting there.
export const CRITERIA = [
  { n: 1, text: "no definitive formulation", color: "var(--accent)" },
  { n: 2, text: "never done", color: "var(--warning)" },
  { n: 3, text: "non-binary", color: "var(--warning)" },
  { n: 4, text: "no definitive test", color: "var(--warning)" },
  { n: 5, text: "no trial & error", color: "var(--warning)" },
  { n: 6, text: "solution set undefined", color: "var(--warning)" },
  { n: 7, text: "one of a kind", color: "var(--success)" },
  { n: 8, text: "symptoms", color: "var(--success)" },
  { n: 9, text: "framing begets solution", color: "var(--success)" },
  { n: 10, text: "catch-22 consequences", color: "var(--success)" },
]

export const WickedCriteria = () => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 28,
      justifyContent: "center",
      alignContent: "center",
      flex: 1,
    }}
  >
    {CRITERIA.map(({ n, text, color }) => (
      <div
        key={n}
        style={{
          color,
          border: "4px solid currentColor",
          background: "color-mix(in srgb, currentColor 12%, transparent)",
          borderRadius: 999,
          padding: "20px 40px 20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 44,
        }}
      >
        <span style={{ fontWeight: 700, minWidth: 56, textAlign: "center" }}>
          {n}
        </span>
        <span style={{ color: "var(--text)" }}>{text}</span>
      </div>
    ))}
  </div>
)
