import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HorizontalLockup, StackedLockup } from "@/components/brand/MidadLockup";
import { MidadMark, markMaster, midadMarkPaths } from "@/components/brand/MidadMark";

describe("MidadMark", () => {
  it("selects the master by rendered size", () => {
    expect(markMaster(18)).toBe("solid");
    expect(markMaster(24)).toBe("small");
    expect(markMaster(32)).toBe("small");
    expect(markMaster(33)).toBe("standard");
  });

  it("fills the keyhole with the surface colour", () => {
    const { container } = render(<MidadMark size={40} surface="#faf7f1" />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
    expect(paths[0]).toHaveAttribute("d", midadMarkPaths.drop);
    expect(paths[0]).toHaveAttribute("fill", "#15294a");
    expect(paths[1]).toHaveAttribute("d", midadMarkPaths.cutoutStandard);
    expect(paths[1]).toHaveAttribute("fill", "#faf7f1");
  });

  it("ships the solid drop below 24px and the widened cutout at 32px", () => {
    const solid = render(<MidadMark size={20} surface="#fff" />).container.querySelectorAll("path");
    expect(solid).toHaveLength(1);
    const small = render(<MidadMark size={32} surface="#fff" />).container.querySelectorAll("path");
    expect(small[1]).toHaveAttribute("d", midadMarkPaths.cutoutSmall);
  });
});

describe("lockups", () => {
  it("renders the horizontal lockup with wordmark, rule and descriptor", () => {
    render(<HorizontalLockup markSize={40} surface="#fff" endorsement />);
    expect(screen.getByText("Midad Academy")).toBeInTheDocument();
    expect(screen.getByText("Early Childhood & Elementary · Nurturing hearts")).toBeInTheDocument();
    expect(screen.getByText("Member of Al-Baseerah Network")).toBeInTheDocument();
  });

  it("marks the Arabic name with lang and direction in the stacked lockup", () => {
    render(<StackedLockup markSize={64} surface="#faf7f1" descriptor="short" label="Midad Academy" arabicName />);
    const arabic = screen.getByText("مداد");
    expect(arabic).toHaveAttribute("lang", "ar");
    expect(arabic).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("img", { name: "Midad Academy" })).toBeInTheDocument();
    expect(screen.getByText("Early Childhood & Elementary")).toBeInTheDocument();
  });
});

describe("footer lockup", () => {
  it("omits the Arabic name unless asked for", () => {
    render(<StackedLockup markSize={64} surface="#faf7f1" descriptor="short" label="Midad Academy" />);
    expect(screen.queryByText("مداد")).not.toBeInTheDocument();
  });
});
