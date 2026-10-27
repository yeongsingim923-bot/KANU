import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import Reveal from "../../components/common/Reveal"
import { useProductStore } from "../../store/productStore"
import "../../css/pages/store/Store.css"
import CartModal from "../../components/common/CartModal"
import type { Product } from "../../data/products"
import { useCartStore } from "../../store/cartStore"

// ===== 탭 =====
type TabKey = "all" | "stick" | "machine" | "capsule"

const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "stick", label: "스틱커피" },
    { key: "machine", label: "머신" },
    { key: "capsule", label: "캡슐커피" },
]

const banners = {
    all: { eng: "KANU", lines: ["A Moment", "For You."], desc: "세상에서 가장 작은 카페, 카누", btn: "전체 상품 보기", img: "/images/store/banner-all.jpg" },
    stick: { eng: "KANU STICK", lines: ["Café In", "Your Pocket"], desc: "언제 어디서나 꺼내 마시는 카누 한 잔", btn: "스틱커피 보기", img: "/images/store/banner-stick.jpg" },
    machine: { eng: "KANU MACHINE", lines: ["One Touch", "Barista"], desc: "버튼 하나로 완성하는 카페 한 잔", btn: "머신 보기", img: "/images/store/banner-machine.jpg" },
    capsule: { eng: "KANU CAPSULE", lines: ["Every Origin", "In One"], desc: "산지마다 다른 풍미를 캡슐 한 알에", btn: "캡슐커피 보기", img: "/images/store/banner-capsule.jpg" },
}

const won = (n: number) => n.toLocaleString() + "원"

function Store() {
    
    // 지금 선택된 탭 = 주소의 ?cat= 값 (없으면 전체)
    const [searchParams, setSearchParams] = useSearchParams()
    const active = (searchParams.get("cat") ?? "all") as TabKey
    const banner = banners[active]   // 지금 탭에 맞는 배너 꺼내기

    // 탭 누르면 주소를 바꿈 → 주소가 바뀌면 화면도 바뀜
    const changeTab = (key: TabKey) => {
        setSearchParams(key === "all" ? {} : { cat: key })
    }

    // 팝업에 보여줄 제품 (null이면 팝업 숨김)
    const [cartItem, setCartItem] = useState<Product | null>(null)
    const addToCart = useCartStore((s) => s.add)   // 장바구니 담기

    // 상품 목록: 서버(DB)에서 불러오기
    const products = useProductStore((s) => s.products)
    const loading = useProductStore((s) => s.loading)
    const error = useProductStore((s) => s.error)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    useEffect(() => { fetchProducts() }, [fetchProducts])

    const items = active === "all"
        ? products.filter((p) => p.best)
        : products.filter((p) => p.category === active)
    const count = active === "all" ? products.length : items.length

    let charIndex = 0   // 배너 제목 글자 순서 (두 줄 이어서)

    return(
        <>
            <SubVisual label="스토어" title="Shop KANU" desc="취향에 맞는 카누를 골라보세요" />

            <div className="store-inner">
               <section className="store-banner">
                    <div className="store-banner-img">
                        <img src={banner.img} alt="" />
                    </div>
                    {/* key가 바뀌면 새로 그려져서 탭 바꿀 때마다 효과 다시 재생 */}
                    <Reveal key={active} className="store-banner-text">
                        <p className="store-banner-eng">{banner.eng}</p>
                        <h3 className="store-banner-title">
                            {banner.lines.map((line) => (
                                <span key={line} className="store-banner-line">
                                    {line.split("").map((char) => {
                                        const i = charIndex++
                                        return (
                                            <span
                                                key={i}
                                                className="store-banner-char"
                                                style={{ animationDelay: `${0.2 + i * 0.04}s` }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        )
                                    })}
                                </span>
                            ))}
                        </h3>
                        <p className="store-banner-desc">{banner.desc}</p>
                        <button type="button" className="store-banner-btn">{banner.btn}</button>
                    </Reveal>
                </section>

                {/* ===== 탭 + 정렬 ===== */}
                <div className="store-toolbar">
                    <ul className="store-tabs">
                        {tabs.map((tab) => (
                            <li key={tab.key}>
                                <button
                                    type="button"
                                    className={active === tab.key ? "store-tab is-active" : "store-tab"}
                                    onClick={() => changeTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="store-sort">추천순</button>
                </div>

                    <p className="store-count">{loading ? "상품을 불러오는 중..." : error || `총 ${count}개`}</p>

                {/* ===== 제품 목록 ===== */}
                <ul className="store-list">
                    {items.map((item) => {
                        // 할인율 계산 (원래 가격 있을 때만)
                        const rate = item.originPrice
                            ? Math.round((1 - item.price / item.originPrice) * 100)
                            : 0

                        return (
                            <li key={item.id} className="store-card">
                                {/* 상세 페이지는 하나로 통일 */}
                                <Link to={`/store/${item.id}`}>
                                    <div className="store-card-img">
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <p className="store-card-name">
                                        {item.name}
                                        {item.option && <><br />{item.option}</>}
                                    </p>
                                    <p className="store-card-desc">{item.desc}</p>
                                </Link>
                                <p className="store-card-price">
                                    {rate > 0 && <span className="store-card-rate">{rate}%</span>}
                                    <strong>{won(item.price)}</strong>
                                    {item.originPrice && <del>{won(item.originPrice)}</del>}
                                </p>
                                <button 
                                    type="button" 
                                    className="store-card-cart"
                                    onClick={() => { addToCart(item.id, 1); setCartItem(item) }}
                                >
                                    장바구니 담기
                                </button>
                            </li>
                        )
                    })}
                </ul>

                {/* ===== 페이지 번호 (모양만) ===== */}
                <div className="store-pager">
                    <button type="button" className="store-pager-arrow">&lt;</button>
                    <button type="button" className="store-pager-num is-active">1</button>
                    <button type="button" className="store-pager-num">2</button>
                    <button type="button" className="store-pager-num">3</button>
                    <button type="button" className="store-pager-arrow">&gt;</button>
                </div>
            </div>

            {/* 장바구니 팝업: cartItem이 있을 때만 보임 */}
                        {cartItem && <CartModal item={cartItem} qty={1} onClose={() => setCartItem(null)} />}
        </>
    )
}

export default Store