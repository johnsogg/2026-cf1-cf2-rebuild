import s from './Callout.module.css'

type CalloutProps = { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }

export const Callout = ({ type = 'info', children }: CalloutProps) => {
  const variantClass = { info: s.calloutInfo, warning: s.calloutWarning, tip: s.calloutTip }[type]
  return <div className={`${s.callout} ${variantClass}`}>{children}</div>
}
