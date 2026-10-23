import { useState } from "react"
import { Link } from "react-router-dom"
import "../css/Home.css"
import Reveal from "../components/common/Reveal"
import SlotNumber from "../components/common/SlotNumber"
import DrawIcon from "../components/common/DrawIcon"

const kanuStore = [
    {eng:"STICK" , name:"스틱커피" , desc:"아메리카노부터 라떼까지" , img: "/images/home/stick.png", to: "/store?cat=stick"  },
    {eng:"MACHINE" , name:"머신" , desc:"버튼 하나로 완성하는 한 잔" , img: "/images/home/machine.png", to: "/store?cat=machine" },
    {eng:"CAPSULE" , name:"캡슐커피" , desc:"전용 · 호환 캡슐 라인업" , img: "/images/home/capsule.png", to: "/store?cat=capsule"},
]

// ===== KANU IN NUMBERS 데이터 (누적 판매, 챔피언십 산지는 더미 숫자) =====
const kanuNumbers = [
    {label:"브랜드 탄생" , value:2011 , unit:"년" , cls:"brand-born"},
    {label:"제품 라인" , value:4 , unit:"가지" , cls:"product-line"},
    {label:"누적 판매" , value:120 , unit:"억 잔" , cls:"total-sales"},
    {label:"챔피언십 산지" , value:12 , unit:"개국" , cls:"champion-origin"},
]

// ===== BENEFITS 데이터 (아이콘은 선으로 그려지게 SVG 코드로 넣기) =====
const kanuBenefits = [
    {
        title:"신규 회원 쿠폰", desc:"가입하면 첫 구매 할인 쿠폰 증정",
        icon: (
            <>
                <path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/>
                <path d="M14.5 9.5l-5 5"/>
                <circle cx="9.5" cy="9.8" r=".9"/>
                <circle cx="14.5" cy="14.2" r=".9"/>
            </>
        ),
    },
    {
        title:"무료 배송", desc:"3만 원 이상 구매 시 무료 배송",
        icon: (
            <>
                <path d="M2.5 6.5h11v9h-11z"/>
                <path d="M13.5 9.5h4l3 3v3h-7z"/>
                <circle cx="6.5" cy="17.5" r="1.8"/>
                <circle cx="17" cy="17.5" r="1.8"/>
            </>
        ),
    },
    {
        title:"레시피 공유", desc:"나만의 카누 레시피를 나눠보세요",
        icon: (
            <>
                <path d="M5 9h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5z"/>
                <path d="M16 10.5h1.5a2 2 0 010 4H16"/>
                <path d="M8.5 3.5c-.8 1 .8 2-0 3M12 3.5c-.8 1 .8 2 0 3"/>
            </>
        ),
    },
    {
        title:"1:1 상담", desc:"머신 사용법부터 주문까지 빠르게 답변",
        icon: (
            <>
                <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/>
                <circle cx="8" cy="10.5" r=".6"/>
                <circle cx="12" cy="10.5" r=".6"/>
                <circle cx="16" cy="10.5" r=".6"/>
            </>
        ),
    },
]

// ===== LOUNGE 데이터 =====
const kanuNews = [
    {cat:"이벤트" , title:"2026 바리스타 챔피언십 한정판 출시 기념 이벤트" , date:"2026.10.14"},
    {cat:"공지사항" , title:"추석 연휴 배송 및 고객상담실 운영 안내" , date:"2026.10.01"},
    {cat:"공지사항" , title:"개인정보처리방침 개정 안내" , date:"2026.09.24"},
    {cat:"이벤트" , title:"가을 홈카페 레시피 공모전" , date:"2026.09.18"},
]

function Home() {

    const [tab, setTab] = useState("전체")
    const newsList = tab === "전체" ? kanuNews : kanuNews.filter((item) => item.cat === tab)

    return(
       
        <div className="home">

            {/* The Smallest Café */}
            <section className="main-visual">
                <div className="main-visual-text">
                    <p className="main-visual-sub">SINCE 2011 · 세상에서 가장 작은 카페</p>
                    <h2 className="main-visual-title">
                        The Smallest Café<span className="dot">.</span>
                    </h2>

                    <div className="main-visual-btns">
                        <Link to="/brand" className="main-visual-btn btn-red">브랜드 스토리 보러가기</Link>
                        <Link to="/store" className="main-visual-btn btn-white">스토어 바로가기</Link>
                    </div>
                </div>
            </section>

            {/*KANU STORE*/}
            <section className="home-store home-inner">
                <div className="home-header">
                    <div>
                        <p className="sub-title">KANU STORE</p>
                        <h3 className="home-title">
                            나에게 맞는 카누를<br/>
                            찾아보세요
                        </h3>
                    </div>

                    <Link to="/store" className="go-store">스토어 전체 보기</Link>

                </div>

                <ul className="home-catalog">
                    {kanuStore.map((item, index) => (
                        <li key={item.eng}>
                            <Reveal delay={index * 0.25}>
                                <Link to={item.to}>
                                    <div className="home-catalog-img"><img src={item.img} alt={item.eng} /></div>
                                    <p className="home-catalog-eng">{item.eng}</p>
                                    <p className="home-catalog-name">{item.name}</p>
                                    <p className="home-catalog-desc">{item.desc}</p>
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </section>

            {/*KANU IN NUMBERS*/}
            <section className="kanu-in-numbers home-inner">
                <Reveal>
                    <p className="sub-title">KANU IN NUMBERS</p>
                    <h3 className="home-title">숫자로 보는 카누</h3>
                </Reveal>

                <ul className="numbers-list">
                    {kanuNumbers.map((item) => (
                        <li key={item.cls} className={item.cls}>
                            <p className="numbers-label">{item.label}</p>
                            <p className="numbers-value">
                                <strong><SlotNumber value={item.value} /></strong>
                                <span>{item.unit}</span>
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            {/*ABOUT KANU*/}
            <section className="about-kanu home-inner">
                <Reveal>
                    <div className="about-kanu-img">
                        <img src="/images/home/about.jpg" alt="정원 속 테이블 위의 카누 커피" />
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="about-kanu-text">
                        <p className="sub-title">ABOUT KANU</p>
                        <h3 className="home-title">
                            세상에서<br/>
                            가장 작은 카페
                        </h3>
                        <p className="about-kanu-desc">
                            스틱 한 봉, 캡슐 한 알에 담은 카페.<br/>
                            2011년부터 이어온 카누의 이야기
                        </p>
                        <Link to="/brand" className="about-kanu-btn">브랜드 스토리 보기</Link>
                    </div>
                </Reveal>
            </section>

            {/*BENEFITS*/}
            <section className="kanu-benefits home-inner">
                <Reveal>
                    <p className="sub-title">BENEFITS</p>
                    <h3 className="home-title">알아두면 좋은 카누 혜택</h3>
                </Reveal>

                <ul className="benefits-list">
                    {kanuBenefits.map((item, index) => (
                        <li key={item.title}>
                            <Reveal delay={index * 0.15}>
                                <div className="benefits-card">
                                    <DrawIcon className="benefits-icon">{item.icon}</DrawIcon>
                                    <p className="benefits-title">{item.title}</p>
                                    <p className="benefits-desc">{item.desc}</p>
                                </div>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </section>

            {/*LOUNGE*/}
            <section className="kanu-lounge home-inner">
                <Reveal>
                    <div className="lounge-head">
                        <p className="sub-title">LOUNGE</p>
                        <h3 className="home-title">카누 소식</h3>

                        <div className="lounge-tabs">
                            {["전체", "공지사항", "이벤트"].map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    className={tab === name ? "lounge-tab is-active" : "lounge-tab"}
                                    onClick={() => setTab(name)}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <ul className="lounge-list">
                    {newsList.map((item) => (
                        <li key={item.title}>
                            <Link to="/notice">
                                <span className="lounge-cat">{item.cat}</span>
                                <span className="lounge-title">{item.title}</span>
                                <span className="lounge-date">{item.date}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/*JOIN*/}
            <section className="kanu-join">
                <div className="join-box">
                    <div>
                        <p className="join-eng">JOIN KANU <span>•</span></p>
                        <h3 className="join-title">
                            지금 가입하고<br/>
                            첫 구매 혜택 받기
                        </h3>
                    </div>
                    <Link to="/join" className="join-btn">회원가입</Link>
                </div>
            </section>

        </div>

    )
}

export default Home