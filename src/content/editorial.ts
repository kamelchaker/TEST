import type { ImageKey } from "./types";

export interface EditorialSection {
  title: string;
  body: string;
}

export interface EditorialPage {
  slug: "our-approach" | "families" | "about";
  kicker: string;
  heading: string;
  lede: string;
  imageKey: ImageKey;
  sections: EditorialSection[];
  faqIds: string[];
  seo: { title: string; description: string };
}

export const editorialPages: EditorialPage[] = [
  {
    slug: "our-approach",
    kicker: "Our approach",
    heading: "Academics and Islamic learning, taught together",
    lede:
      "One integrated day and a curriculum that deepens each year rather than starting over, so children build on what they already know.",
    imageKey: "ourApproachTeacher",
    sections: [
      {
        title: "One classroom, one day",
        body: "Qur'an, Arabic, Islamic Studies and akhlaq are not a separate track. They sit in the same day as literacy, math, science and the arts, taught by the teachers who know your child.",
      },
      {
        title: "Depth over repetition",
        body: "Each of the twelve learning domains is revisited every year with greater depth. A child who starts at two arrives at Kindergarten with four years of continuous building behind them.",
      },
      {
        title: "Character as practice",
        body: "Kindness, honesty, respect and responsibility are practiced in daily routines — greetings, sharing, du‘a, resolving a disagreement — rather than taught once and set aside.",
      },
    ],
    faqIds: [],
    seo: {
      title: "Our Approach",
      description:
        "One integrated day where academics and Islamic learning are taught together, and a curriculum that deepens each year rather than starting over.",
    },
  },
  {
    slug: "families",
    kicker: "Families",
    heading: "Everyday life at Midad",
    lede: "Meals, rest, arrival and dismissal, supplies and how teachers keep in touch with you.",
    imageKey: "familiesHero",
    sections: [
      {
        title: "A predictable day",
        body: "Children settle when the day is predictable. Each program follows a consistent rhythm of arrival, learning blocks, outdoor time, meals and rest.",
      },
      {
        title: "Staying in touch",
        body: "Teachers share how the week went and what is coming next, and are available for conversations beyond drop-off and pick-up.",
      },
    ],
    faqIds: ["fam-pack", "fam-teachers", "fam-arrival"],
    seo: {
      title: "Families",
      description:
        "Everyday life at Midad Academy: meals, rest, arrival and dismissal, supplies and how teachers keep in touch with families.",
    },
  },
  {
    slug: "about",
    kicker: "About",
    heading: "Midad Academy",
    lede:
      "An Early Childhood and Elementary school where strong academics and Islamic education are integrated throughout the day.",
    imageKey: "aboutHero",
    sections: [
      {
        title: "Who we are",
        body: "Midad Academy is an Early Childhood and Elementary school. Children currently enroll from age two through Kindergarten, with Extended Learning at either end of the day. Kindergarten is a full academic program, not an extension of Pre-Kindergarten.",
      },
      {
        title: "Where we are going",
        body: "The school is built to grow with its children. Elementary grades follow Kindergarten as the school expands; details are shared with families as each year opens.",
      },
      {
        title: "Partnership with families",
        body: "What happens at school works best when families know what their child is working on. We share where each child is heading and what they are building toward, so home and classroom pull the same direction.",
      },
    ],
    faqIds: [],
    seo: {
      title: "About",
      description:
        "Midad Academy is an Early Childhood and Elementary school where strong academics and Islamic education are integrated throughout the day.",
    },
  },
];
