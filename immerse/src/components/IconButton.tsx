import s from "./IconButton.module.css"

type IconButtonProps = {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
}

export const IconButton = ({
  onClick,
  "aria-label": ariaLabel,
  children,
  active,
  disabled,
}: IconButtonProps) => (
  <button
    className={`${s.iconButton}${active ? ` ${s.active}` : ""}`}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </button>
)
