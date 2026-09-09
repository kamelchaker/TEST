import type { IconName } from "@/content/types";
import { IconCircle } from "./Icon";

interface HighlightGridProps {
  items: { label: string; icon: IconName }[];
}

/** Five-across (desktop) row of icon highlights, two-across on phones. */
export function HighlightGrid({ items }: HighlightGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 xs:gap-5 sm:grid-cols-3 lg:grid-cols-5 list-none m-0 p-0">
      {items.map((item) => (
        <li key={item.label} className="highlight">
          <IconCircle name={item.icon} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
