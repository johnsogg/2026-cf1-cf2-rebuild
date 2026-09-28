import { useEffect, useRef, type ReactNode } from "react"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./Lightbox.module.css"

type LightboxProps = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}

/**
 * Full-screen overlay for any content (an image, a sketch, a diagram).
 * Built on a native modal `<dialog>`, so it sits above everything, traps
 * focus, and closes on Escape for free. Also closes on the × button or a
 * click on the dimmed area outside the content. The caller owns `open`.
 */
export const Lightbox = ({ open, onClose, label, children }: LightboxProps) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={s.lightbox}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={s.closeButton}>
        <IconButton onClick={onClose} aria-label="Close">
          <SvgIcon name="close" />
        </IconButton>
      </div>
      {open && children}
    </dialog>
  )
}
