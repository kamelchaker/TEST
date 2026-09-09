import { iconPaths } from "@/content/icons";
import type { IconName } from "@/content/types";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Decorative line icon. Always accompanied by visible text, so hidden from AT. */
export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

export function IconCircle({ name, className }: { name: IconName; className?: string }) {
  return (
    <span className={["icircle", className].filter(Boolean).join(" ")}>
      <Icon name={name} />
    </span>
  );
}
