import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import Reveal from "../../components/common/Reveal"
import { useProductStore } from "../../store/productStore"
import "../../css/pages/store/Store.css"
import CartModal from "../../components/common/CartModal"
import ServerError from "../ServerError"
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

// ===== 정렬 =====
const sorts = [
    { key: "recommend", label: "추천순" },
    { key: "low", label: "낮은 가격순" },
    { key: "high", label: "높은 가격순" },
    { key: "discount", label: "할인율순" },
] as const
type SortKey = (typeof sorts)[number]["key"]   // "recommend" | "low" | "high" | "discount"

const PER_PAGE = 8   // 한 페이지에 보여줄 제품 수

// 할인율 (원래 가격 있을 때만)
const getRate = (p: Product) => p.originPrice ? Math.round((1 - p.price / p.originPrice) * 100) : 0

// 정렬한 새 목록 (원래 목록은 그대로 둠)
function sortItems(list: Product[], sort: SortKey) {
    const copy = [...list]
    if (sort === "low") copy.sort((a, b) => a.price - b.price)
    if (sort === "high") copy.sort((a, b) => b.price - a.price)
    if (sort === "discount") copy.sort((a, b) => getRate(b) - getRate(a))
    return copy   // 추천순: 진열 순서(DB sort_order) 그대로
}

function Store() {
    
    // 지금 선택된 탭 = 주소의 ?cat= 값 (없으면 전체)
    const [searchParams, setSearchParams] = useSearchParams()
    const active = (searchParams.get("cat") ?? "all") as TabKey
    const banner = banners[active]   // 지금 탭에 맞는 배너 꺼내기

    // 탭 누르면 주소를 바꿈 → 주소가 바뀌면 화면도 바뀜
    const changeTab = (key: TabKey) => {
        setSearchParams(key === "all" ? {} : { cat: key })
        setPage(1)   // 탭을 바꾸면 1페이지부터
    }

    // 팝업에 보여줄 제품 (null이면 팝업 숨김)
    const [cartItem, setCartItem] = useState<Product | null>(null)
    const addToCart = useCartStore((s) => s.add)   // 장바구니 담기

    // 정렬 / 페이지
    const [sort, setSort] = useState<SortKey>("recommend")
    const [sortOpen, setSortOpen] = useState(false)          // 정렬 목록 열림
    const [page, setPage] = useState(1)
    const listRef = useRef<HTMLDivElement>(null)              // 탭+정렬 줄 (배너 버튼·페이지 이동 때 여기로 스크롤)

    // 상품 목록: 서버(DB)에서 불러오기
    const products = useProductStore((s) => s.products)
    const loading = useProductStore((s) => s.loading)
    const error = useProductStore((s) => s.error)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    useEffect(() => { fetchProducts() }, [fetchProducts])
    if (error) return <ServerError />   // 상품을 못 불러오면 서버 오류 화면

    const items = active === "all"
        ? products.filter((p) => p.best)
        : products.filter((p) => p.category === active)
    const count = active === "all" ? products.length : items.length

    // 정렬 → 지금 페이지 것만 자르기
    const sorted = sortItems(items, sort)
    const lastPage = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
    const shown = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // 목록 맨 위(탭 줄)로 부드럽게 스크롤
    const scrollToList = () => listRef.current?.scrollIntoView({ behavior: "smooth" })

    // 페이지 이동: 번호 바꾸고 목록 위로
    const goPage = (n: number) => {
        setPage(n)
        scrollToList()
    }

    // 정렬 고르기: 1페이지부터 + 목록 닫기
    const chooseSort = (key: SortKey) => {
        setSort(key)
        setPage(1)
        setSortOpen(false)
    }

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
                        <button type="button" className="store-banner-btn" onClick={scrollToList}>{banner.btn}</button>
                    </Reveal>
                </section>

                {/* ===== 탭 + 정렬 ===== */}
                <div className="store-toolbar" ref={listRef}>
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
                                        {/* 정렬: 누르면 목록이 열리고, 마우스가 벗어나면 닫힘 */}
                    <div className="store-sort-wrap" onMouseLeave={() => setSortOpen(false)}>
                        <button type="button" className="store-sort" onClick={() => setSortOpen(!sortOpen)}>
                            {sorts.find((s) => s.key === sort)?.label}
                        </button>
                        {sortOpen && (
                            <ul className="store-sort-list">
                                {sorts.map((s) => (
                                    <li key={s.key}>
                                        <button type="button" className={s.key === sort ? "is-active" : ""} onClick={() => chooseSort(s.key)}>
                                            {s.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                    <p className="store-count">{loading ? "상품을 불러오는 중..." : error || `총 ${count}개`}</p>
                {/* ===== 제품 목록 ===== */}
                <ul className="store-list">
                    {shown.map((item) => {
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

                {/* ===== 페이지 번호 (한 페이지뿐이면 숨김) ===== */}
                {lastPage > 1 && (
                    <div className="store-pager">
                        <button type="button" className="store-pager-arrow" onClick={() => goPage(page - 1)} disabled={page === 1}>&lt;</button>
                        {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
                            <button
                                type="button"
                                key={n}
                                className={n === page ? "store-pager-num is-active" : "store-pager-num"}
                                onClick={() => goPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button type="button" className="store-pager-arrow" onClick={() => goPage(page + 1)} disabled={page === lastPage}>&gt;</button>
                    </div>
                )}
            </div>

            {/* 장바구니 팝업: cartItem이 있을 때만 보임 */}
                        {cartItem && <CartModal item={cartItem} qty={1} onClose={() => setCartItem(null)} />}
        </>
    )
}

export default Store