import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";   // [수정] useLocation 추가 (로그인 후 돌아올 주소)
import { menus } from "../../data/menu";
import "../../css/components/layout/Header.css";
import { useAuthStore } from "../../store/authStore";

function Header() {

    const [isMegaOpen, setIsMegaOpen] = useState(false);
    const fetchMe = useAuthStore((s) => s.fetchMe);
    const user = useAuthStore((s) => s.user);            // [수정] null = 로그인 안 함
    const handleLogout = useAuthStore((s) => s.logout);  // [수정] 로그아웃
    const location = useLocation();

    useEffect(() => { fetchMe(); }, [fetchMe]);     // 앱이 처음 열릴 때 한 번: 이미 로그인되어 있는지 확인 (Header는 항상 화면에 있으므로 여기서 실행)
    return (
        <>
            <header
                className={isMegaOpen ? "header is-open" : "header"}
                onMouseLeave={() => setIsMegaOpen(false)}
            >
                <div className="header-inner">

                    <h1 className="header-logo">
                        <Link to="/">
                            <img src="/images/logo.png" alt="KANU" />
                        </Link>
                    </h1>

                    <nav className="header-menu">
                        <ul className="header-menu-list">
                            {menus.map((menu) => (
                                <li className="header-menu-item" key={menu.title}>
                                    <Link
                                        to={menu.to}
                                        className="header-menu-link"
                                        data-text={menu.title}
                                        onMouseEnter={() => setIsMegaOpen(true)}
                                        onClick={() => setIsMegaOpen(false)}
                                    >
                                        {menu.title}
                                    </Link>

                                    <ul className="header-sub-list">
                                        {menu.subs.map((sub) => (
                                            <li key={sub.title}>
                                                <Link
                                                    to={sub.to}
                                                    className="header-sub-link"
                                                    onClick={() => setIsMegaOpen(false)}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header-util">
                        {/* [수정] 로그인 상태에 따라 "환영 + 로그아웃" / "로그인 + 회원가입" 전환 */}
                        {user ? (
                            <>
                                <span className="header-util-link">{user.username}님 환영합니다.</span>
                                <button type="button" className="header-util-link" onClick={handleLogout}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                {/* [오류 수정] location().pathname → location.pathname */}
                                <Link to="/login" state={{ from: location.pathname }} className="header-util-link">로그인</Link>
                                <Link to="/join" className="header-util-link">회원가입</Link>
                            </>
                        )}

                        <Link to="/cart" className="header-icon-btn">
                            <img src="/images/cart.png" alt="" className="header-icon header-icon-cart" />
                            <span className="blind">장바구니</span>
                        </Link>

                        <Link to="/search" className="header-icon-btn">
                            <img src="/images/search.png" alt="" className="header-icon" />
                            <span className="blind">검색</span>
                        </Link>
                    </div>

                </div>

                <div className="header-mega-bg"></div>
            </header>

            <div className={isMegaOpen ? "header-dim is-open" : "header-dim"}></div>
        </>
  );
}

export default Header;