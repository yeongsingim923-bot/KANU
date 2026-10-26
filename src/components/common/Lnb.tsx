import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/components/common/Lnb.css";

// 서브비주얼 아래 회색 탭 메뉴
type LnbItem = {
    title: string;   // 탭 글자
    to: string;      // 이동할 주소 (#으로 시작하면 같은 페이지 안에서 스크롤)
};

type LnbProps = {
    items: LnbItem[];
    active?: string;   // 처음에 선택될 탭 (없으면 지금 주소로 자동)
};

function Lnb({ items, active }: LnbProps) {
    const location = useLocation();

    // # 탭을 눌렀을 때 선택된 탭 기억하기
    const [clicked, setClicked] = useState<string | null>(null);
    const current = clicked ?? active ?? location.pathname + location.search;

    // # 탭 클릭: 해당 위치로 부드럽게 스크롤 + 빨간 밑줄 이동
    const scrollTo = (e: React.MouseEvent, to: string) => {
        e.preventDefault();   // 원래 a 태그의 '툭' 이동 막기
        document.querySelector(to)?.scrollIntoView({ behavior: "smooth" });
        setClicked(to);
    };

    return (
        <nav className="lnb">
            <ul className="lnb-list">
                {items.map((item) => {
                    const className = current === item.to ? "lnb-link is-active" : "lnb-link";

                    return (
                        <li key={item.to}>
                            {item.to.startsWith("#") ? (
                                <a href={item.to} className={className} onClick={(e) => scrollTo(e, item.to)}>
                                    {item.title}
                                </a>
                            ) : (
                                <Link to={item.to} className={className}>{item.title}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Lnb;