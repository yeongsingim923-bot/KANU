import { useState } from "react";
import { Link } from "react-router-dom";
import { menus } from "../../data/menu";
import "../../css/components/layout/Header.css";

function Header() {

    const [isMegaOpen, setIsMegaOpen] = useState(false);

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
                        <Link to="/login" className="header-util-link">로그인</Link>
                        <Link to="/join" className="header-util-link">회원가입</Link>

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