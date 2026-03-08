import s from "./IconButton.module.css"

type IconButtonProps = {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  title?: string
}

export const IconButton = ({
  onClick,
  "aria-label": ariaLabel,
  children,
  active,
  disabled,
  title,
}: IconButtonProps) => (
  <button
    className={`${s.iconButton}${active ? ` ${s.active}` : ""}`}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
)
