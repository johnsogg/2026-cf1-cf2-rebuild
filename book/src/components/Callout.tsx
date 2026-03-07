import './callout.css'

type CalloutProps = { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }

export const Callout = ({ type = 'info', children }: CalloutProps) => (
  <div className={`callout callout-${type}`}>{children}</div>
)
