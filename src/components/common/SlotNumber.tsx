import { useEffect, useRef, useState } from "react";
import "../../css/components/common/SlotNumber.css";

// 파칭코처럼 숫자가 타타닥 돌다가 멈추는 숫자
type SlotNumberProps = {
  value: number;
};

const ROUNDS = 3;                                    // 몇 바퀴 돌고 멈출지
const strip = Array.from({ length: (ROUNDS + 1) * 10 }, (_, i) => i % 10); // 0~9 를 4번 이어붙인 띠

function SlotNumber({ value }: SlotNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isRun, setIsRun] = useState(false);     // 돌기 시작
  const [isDone, setIsDone] = useState(false);   // 다 멈추고 "팟!"

  const digits = String(value).split("");        // 2011 → ["2","0","1","1"]
  const lastTime = 1.2 + (digits.length - 1) * 0.3;  // 마지막 자리가 멈추는 시간(초)

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setIsRun(true);
        timer = window.setTimeout(() => setIsDone(true), lastTime * 1000);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [lastTime]);

  return (
    <span ref={ref} className={isDone ? "slot is-done" : "slot"} aria-label={String(value)}>
      {digits.map((d, i) => (
        <span className="slot-digit" key={i} aria-hidden="true">
          <span
            className="slot-strip"
            style={{
              // 3바퀴 돈 다음 목표 숫자에서 멈추기
              transform: isRun ? `translateY(-${ROUNDS * 10 + Number(d)}em)` : "translateY(0)",
              // 앞자리부터 하나씩 멈추게 (뒤로 갈수록 0.3초씩 더 오래)
              transitionDuration: `${1.2 + i * 0.3}s`,
            }}
          >
            {strip.map((n, k) => (
              <span key={k}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default SlotNumber;