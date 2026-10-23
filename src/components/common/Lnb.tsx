import { Link, useLocation } from "react-router-dom";
import "../../css/components/common/Lnb.css";

// 서브비주얼 아래 회색 탭 메뉴
type LnbItem = {
    title: string;   // 탭 글자
    to: string;      // 이동할 주소
};

type LnbProps = {
    items: LnbItem[];
};

function Lnb({ items }: LnbProps) {
    const location = useLocation();
    const current = location.pathname + location.search;

    return (
        <nav className="lnb">
            <ul className="lnb-list">
                {items.map((item) => (
                    <li key={item.to}>
                        <Link
                            to={item.to}
                            className={current === item.to ? "lnb-link is-active" : "lnb-link"}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Lnb;