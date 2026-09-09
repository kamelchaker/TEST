import type { IconName } from "./types";

/** Single-path line icons drawn on a 24×24 grid. */
export const iconPaths: Record<IconName, string> = {
  book: "M12 7v14M3 18V5a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2 2 2 0 0 1 2-2h6a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4a1 1 0 0 1-1-1z",
  recitation: "M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4",
  chat: "M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  school: "M22 10L12 5 2 10l10 5 10-5zM6 12.5V17c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5",
  heart: "M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 12 6 5.5 5.5 0 0 0 2 8.5C2 13 12 21 12 21s3.4-2.7 7-7z",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z",
  person: "M12 7a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 7zM5 21a7 7 0 0 1 14 0",
  hands: "M8 13V5a2 2 0 1 1 4 0v6M12 11V4.5a2 2 0 1 1 4 0V12M16 12V7a2 2 0 1 1 4 0v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2",
  shield: "M12 22s8-3.5 8-9.5V5.5L12 2 4 5.5V12.5C4 18.5 12 22 12 22z",
  blocks: "M3 3h8v8H3zM13 13h8v8h-8zM13 7h8M7 13v8",
  grid: "M3 3h18v18H3zM8 9h8M8 13h4",
  motion: "M4 20l7-7M14 10l-3 3",
  idea: "M9 21h6M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
};
