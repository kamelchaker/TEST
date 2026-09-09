import type { ImageKey, Photo } from "./types";

/**
 * Every photograph position in the design has a fixed key. Replace the file
 * behind a key and the same crop, ratio and layout render the new image.
 *
 * The scene images under /images/temporary are temporary visual assets that
 * preserve the approved design. They are not photographs of Al-Baseerah
 * Academy and are never described as such. The two logo files are the
 * school's own artwork.
 */
const T = "/images/temporary";

interface SourceImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const sources = {
  homeHero: { src: `${T}/homehero.webp`, width: 1400, height: 933, alt: "Young children and a teacher at a classroom table with books and learning materials" },
  cardEarlyLearners: { src: `${T}/cardearlylearners.webp`, width: 1400, height: 764, alt: "Toddlers playing with blocks on a classroom floor" },
  cardPreschool: { src: `${T}/cardpreschool.webp`, width: 900, height: 414, alt: "Preschool-age children at a learning center" },
  cardPreK: { src: `${T}/cardprek.webp`, width: 900, height: 398, alt: "Children working together on a table-top activity" },
  cardKindergarten: { src: `${T}/cardkindergarten.webp`, width: 900, height: 395, alt: "Kindergarten-age children reading at a classroom table" },
  earlyLearners: { src: `${T}/earlylearners.webp`, width: 900, height: 717, alt: "Young children exploring classroom learning materials with a teacher" },
  preschool: { src: `${T}/preschool.webp`, width: 900, height: 482, alt: "Preschool-age children in a small-group literacy activity" },
  preKindergarten: { src: `${T}/prekindergarten.webp`, width: 900, height: 361, alt: "Pre-kindergarten-age children working with a teacher in a small group" },
  kindergarten: { src: `${T}/kindergarten.webp`, width: 900, height: 370, alt: "Kindergarten-age children reading and writing at classroom tables" },
  quran: { src: `${T}/quran.webp`, width: 1000, height: 442, alt: "Children seated in a circle for a listening and recitation session" },
  arabic: { src: `${T}/arabic.webp`, width: 1000, height: 346, alt: "Children practising letters and words with a teacher" },
  stem: { src: `${T}/stem.webp`, width: 900, height: 242, alt: "Children building a structure in a hands-on STEM activity" },
  books: { src: `${T}/books.webp`, width: 1000, height: 417, alt: "A quiet classroom reading corner with children choosing books" },
  learningTogether: { src: `${T}/learningtogether.webp`, width: 900, height: 285, alt: "Children reading and writing together at a classroom table" },
  socialEmotional: { src: `${T}/socialemotional.webp`, width: 1000, height: 335, alt: "Toddler-age children at hands-on learning centers" },
  physical: { src: `${T}/physical.webp`, width: 1000, height: 327, alt: "Children playing outdoors" },
  creativeArts: { src: `${T}/creativearts.webp`, width: 900, height: 361, alt: "Children painting and making at an art table" },
  campus: { src: `${T}/campus.webp`, width: 900, height: 379, alt: "Exterior view of a school building and entrance" },
} satisfies Record<string, SourceImage>;

type SourceKey = keyof typeof sources;

/**
 * Design position → source image. The approved baseline renders every image
 * centred; a `position` (CSS object-position) may be added per key when a
 * real photograph needs a different crop focus.
 */
const positions: Record<ImageKey, { source: SourceKey; position?: string }> = {
  homeHero: { source: "homeHero" },
  earlyLearnersHero: { source: "earlyLearners" },
  earlyLearnersDay: { source: "socialEmotional" },
  preschoolHero: { source: "preschool" },
  preschoolDay: { source: "creativeArts" },
  preKHero: { source: "preKindergarten" },
  preKDay: { source: "learningTogether" },
  kindergartenHero: { source: "kindergarten" },
  kindergartenDay: { source: "socialEmotional" },
  extendedLearningHero: { source: "physical" },
  extendedLearningDay: { source: "creativeArts" },
  curriculumHero: { source: "learningTogether" },
  curriculumLiteracy: { source: "learningTogether" },
  curriculumStem: { source: "stem" },
  curriculumQuran: { source: "quran" },
  curriculumArabic: { source: "arabic" },
  curriculumMath: { source: "kindergarten" },
  curriculumScience: { source: "stem" },
  curriculumSocial: { source: "socialEmotional" },
  curriculumPhysical: { source: "physical" },
  curriculumArts: { source: "creativeArts" },
  curriculumIslamic: { source: "quran" },
  curriculumDua: { source: "books" },
  curriculumAkhlaq: { source: "socialEmotional" },
  earlyLearnersGallery0: { source: "quran" },
  earlyLearnersGallery1: { source: "creativeArts" },
  earlyLearnersGallery2: { source: "physical" },
  preschoolGallery0: { source: "arabic" },
  preschoolGallery1: { source: "stem" },
  preschoolGallery2: { source: "physical" },
  preKGallery0: { source: "quran" },
  preKGallery1: { source: "stem" },
  preKGallery2: { source: "socialEmotional" },
  kindergartenGallery0: { source: "quran" },
  kindergartenGallery1: { source: "stem" },
  kindergartenGallery2: { source: "learningTogether" },
  extendedLearningGallery0: { source: "books" },
  extendedLearningGallery1: { source: "stem" },
  earlyLearnersCard: { source: "cardEarlyLearners" },
  preschoolCard: { source: "cardPreschool" },
  preKCard: { source: "cardPreK" },
  kindergartenCard: { source: "cardKindergarten" },
  extendedLearningCard: { source: "physical" },
  ourApproachTeacher: { source: "stem" },
  familiesHero: { source: "physical" },
  aboutHero: { source: "campus" },
  admissionsHero: { source: "campus" },
  tourHero: { source: "campus" },
  contactCampus: { source: "campus" },
};

/** Returns the photo for a design position, or null when none is mapped. */
export function getPhoto(key: ImageKey | null | undefined): Photo | null {
  if (!key) return null;
  const entry = positions[key];
  if (!entry) return null;
  const source = sources[entry.source];
  return {
    src: source.src,
    width: source.width,
    height: source.height,
    alt: source.alt,
    position: entry.position,
    temporary: true,
  };
}

export const logos = {
  crest: { src: "/images/logocrest.png", width: 512, height: 512, alt: "Al-Baseerah Academy" },
  full: { src: "/images/logofull.png", width: 600, height: 691, alt: "Al-Baseerah Academy" },
} as const;
