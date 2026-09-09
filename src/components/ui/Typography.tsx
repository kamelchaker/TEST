import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

function make(defaultTag: ElementType, base: string) {
  function Text({ as, className, children, ...rest }: TextProps) {
    const Tag = (as ?? defaultTag) as ElementType;
    return (
      <Tag className={cx(base, className)} {...rest}>
        {children}
      </Tag>
    );
  }
  return Text;
}

export const Kicker = make("p", "kicker");
export const DisplayHeading = make("h1", "display-heading");
export const PageHeading = make("h1", "page-heading");
export const SectionHeading = make("h2", "section-heading");
export const SubHeading = make("h3", "sub-heading");
export const Lede = make("p", "lede");
export const BodyText = make("p", "body-text");
export const SmallText = make("p", "small-text");
export const MetaText = make("p", "meta-text");
