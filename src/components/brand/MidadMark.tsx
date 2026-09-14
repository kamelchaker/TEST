/**
 * The Midad Academy mark: an ink drop with the parent crest's nib slit and
 * vent cut out of it as one continuous keyhole. Geometry is taken verbatim
 * from the Midad logo handoff. One shape, one knockout, no strokes.
 *
 * The knockout must always equal the surface behind the mark, so the mark is
 * shipped as inline SVG and the surface colour is passed in.
 */

export const MIDAD_NAVY = "#15294a";

/** Standard master, 33px and above. */
const DROP = "M50 6 C50 6 80 38 80 62 A30 30 0 0 1 20 62 C20 38 50 6 50 6 Z";
const CUTOUT_STANDARD = "M50 15 C51.5 30 55 40 57.4 46.5 A8 8 0 1 1 42.6 46.5 C45 40 48.5 30 50 15 Z";
/** Small master, 32px and below: the cutout is widened about 8%. */
const CUTOUT_SMALL = "M50 14 C51.6 29 55.2 39 57.9 45.5 A8.6 8.6 0 1 1 42.1 45.5 C44.8 39 48.4 29 50 14 Z";
/** Reversed app tile: the drop reverses out of a solid navy square. */
const TILE_DROP = "M50 12 C50 12 76 40 76 61 A26 26 0 0 1 24 61 C24 40 50 12 50 12 Z";
const TILE_CUTOUT = "M50 20 C51.4 32 54.4 40 56.7 44.5 A7 7 0 1 1 43.3 44.5 C45.6 40 48.6 32 50 20 Z";

export const midadMarkPaths = {
  drop: DROP,
  cutoutStandard: CUTOUT_STANDARD,
  cutoutSmall: CUTOUT_SMALL,
  tileDrop: TILE_DROP,
  tileCutout: TILE_CUTOUT,
};

/** Which master a given rendered size calls for. */
export function markMaster(size: number): "solid" | "small" | "standard" {
  if (size < 24) return "solid";
  if (size <= 32) return "small";
  return "standard";
}

interface MidadMarkProps {
  /** Rendered size in CSS pixels; selects the matching master. */
  size: number;
  /** Colour of the surface the mark sits on; fills the keyhole. */
  surface: string;
  /** Drop colour. Navy by default; white or ink for single-colour use. */
  ink?: string;
  /**
   * Draw slightly wider (viewBox 18–82 instead of 20–80) when paired with
   * the parent crest, so the drop and the circle sit at equal visual weight.
   */
  besideCrest?: boolean;
  /** Labelled when the mark stands alone; decorative beside the wordmark. */
  label?: string;
  className?: string;
}

export function MidadMark({ size, surface, ink = MIDAD_NAVY, besideCrest, label, className }: MidadMarkProps) {
  const master = markMaster(size);
  const cutout = master === "small" ? CUTOUT_SMALL : CUTOUT_STANDARD;
  const viewBox = besideCrest ? "18 0 64 100" : "20 0 60 100";
  const width = besideCrest ? size * 0.64 : size * 0.6;
  return (
    <svg
      width={width}
      height={size}
      viewBox={viewBox}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
      className={className}
    >
      <path d={DROP} fill={ink} />
      {master === "solid" ? null : <path d={cutout} fill={surface} />}
    </svg>
  );
}
