import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// 선 아이콘을 펜으로 그리듯 나타나게 하는 SVG
// 선마다 실제 길이를 재서 CSS 변수(--len)로 넘겨줘요
type DrawIconProps = {
  children: ReactNode;
  className?: string;
};

function DrawIcon({ children, className }: DrawIconProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    svg.querySelectorAll<SVGGeometryElement>("path, circle").forEach((el) => {
      const len = el.getTotalLength();          // 선의 실제 길이
      el.style.setProperty("--len", String(len));
    });
  }, []);

  return (
    <svg ref={ref} className={className} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export default DrawIcon;
