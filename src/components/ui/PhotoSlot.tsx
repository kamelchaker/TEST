import Image from "next/image";
import { getPhoto } from "@/content/photography";
import type { ImageKey } from "@/content/types";
import { cx } from "@/lib/cx";

type Ratio = "4/3" | "3/2" | "16/10" | "none";
type Tone = "default" | "warm" | "deep" | "dark";

interface PhotoSlotProps {
  imageKey: ImageKey | null | undefined;
  ratio?: Ratio;
  tone?: Tone;
  /** Square corners, used when the slot sits flush inside a card. */
  square?: boolean;
  /** Load eagerly for above-the-fold hero imagery. */
  priority?: boolean;
  /** Responsive `sizes` hint for the image. */
  sizes?: string;
  /** Overrides the photo's alt text; pass "" when a visible caption describes it. */
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ratioClass: Record<Ratio, string> = {
  "4/3": "ratio-43",
  "3/2": "ratio-32",
  "16/10": "ratio-1610",
  none: "",
};

const toneClass: Record<Tone, string> = {
  default: "",
  warm: "slot-warm",
  deep: "slot-deep",
  dark: "slot-dark",
};

/**
 * A fixed photograph position. Renders the mapped image at the designed crop,
 * or the designed tonal field when no image is mapped to the key.
 */
export function PhotoSlot({
  imageKey,
  ratio = "4/3",
  tone = "default",
  square,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  alt,
  className,
  style,
}: PhotoSlotProps) {
  const photo = getPhoto(imageKey);
  return (
    <div
      className={cx("slot", ratioClass[ratio], toneClass[tone], photo && "slot-photo", square && "slot-square", className)}
      style={style}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={alt ?? photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover", objectPosition: photo.position ?? "center" }}
        />
      ) : null}
    </div>
  );
}
