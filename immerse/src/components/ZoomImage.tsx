import { useState, type ComponentProps } from "react"
import { Lightbox } from "./Lightbox"
import s from "./ZoomImage.module.css"

type ZoomImageProps = ComponentProps<"img"> & { src: string; alt: string }

/**
 * An `<img>` that opens full screen in a `Lightbox` when clicked/tapped —
 * for images with detail too small to read at their inline size. Takes the
 * same props as `<img>`; `width` etc. apply to the inline version only.
 * Globally available in book `.mdx` sections, no import needed.
 */
export const ZoomImage = ({ src, alt, ...imgProps }: ZoomImageProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className={s.trigger}
        onClick={() => setOpen(true)}
        title="Click to enlarge"
      >
        <img src={src} alt={alt} {...imgProps} />
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)} label={alt}>
        <img className={s.full} src={src} alt={alt} />
      </Lightbox>
    </>
  )
}
