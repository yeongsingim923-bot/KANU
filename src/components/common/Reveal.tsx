import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "../../css/components/common/Reveal.css";

// 스크롤해서 화면에 보이면 아래에서 스르륵 올라오는 상자
type RevealProps = {
  children: ReactNode;
  delay?: number;   // 몇 초 늦게 올라올지 (예: 0.15)
};

function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 화면에 20% 정도 들어오면 보여주기
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsShow(true);
          observer.disconnect();   // 한 번 올라오면 끝
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={isShow ? "reveal is-show" : "reveal"}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default Reveal;