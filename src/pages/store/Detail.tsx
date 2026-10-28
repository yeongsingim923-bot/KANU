import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import CartModal from "../../components/common/CartModal"
import NotFound from "../NotFound"
import { useProductStore } from "../../store/productStore"
import type { Category, Product } from "../../data/products"
import { useCartStore } from "../../store/cartStore"
import "../../css/pages/store/Detail.css"
import ServerError from "../ServerError"

// 분류별 글자 + 배너 (배너 사진은 스토어 배너를 같이 씀)
const categoryInfo: Record<Category, { chip: string; eng: string; lines: [string, string]; banner: string }> = {
    stick:   { chip: "스틱 커피", eng: "KANU STICK",   lines: ["Café In", "Your Pocket"], banner: "/images/store/banner-stick.jpg" },
    machine: { chip: "머신",      eng: "KANU MACHINE", lines: ["One Touch", "Barista"],   banner: "/images/store/banner-machine.jpg" },
    capsule: { chip: "캡슐 커피", eng: "KANU CAPSULE", lines: ["Every Origin", "In One"], banner: "/images/store/banner-capsule.jpg" },
}

// 맛 & 특징 4줄 (key = 데이터 이름, label = 화면 글자)
const tasteLabels = [
    { key: "acid", label: "산미" },
    { key: "body", label: "바디감" },
    { key: "bitter", label: "쓴맛" },
    { key: "sweet", label: "단맛" },
] as const

const won = (n: number) => n.toLocaleString() + "원"

// 할인율 (원래 가격 있을 때만)
const getRate = (p: Product) => p.originPrice ? Math.round((1 - p.price / p.originPrice) * 100) : 0

function Detail() {
    const { id } = useParams()                       // 주소 /store/stick-latte → id = "stick-latte"
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)                // 수량
    const [isCartOpen, setIsCartOpen] = useState(false)   // 장바구니 팝업
        const addToCart = useCartStore((s) => s.add)          // 장바구니 담기

    // 상품 목록: 서버(DB)에서 불러오기
    const products = useProductStore((s) => s.products)
    const loading = useProductStore((s) => s.loading)
    const error = useProductStore((s) => s.error)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    useEffect(() => { fetchProducts() }, [fetchProducts])

    // 다른 제품으로 넘어오면 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    if (loading) return null                                       // 불러오는 중
    if (error) return <ServerError />     // 서버 오류 → 404 디자인의 오류 화면
    const item = products.find((p) => p.id === id)
    if (!item) return <NotFound />                   // 없는 제품 주소
    const info = categoryInfo[item.category]
    const [name, sub] = item.name.split(" | ")       // "케어링 스타 디카페인 | 카누 바리스타 전용캡슐" → 두 줄로 나눔
    const subText = [sub, item.option].filter(Boolean).join(" ")
    const rate = getRate(item)
    const detail = item.detail
    // 함께 보면 좋은 카누: 같은 분류에서 자기 자신 빼고 4개
    const related = products.filter((p) => p.category === item.category && p.id !== item.id).slice(0, 4)

    return(
        <>
            <section className="detail-top">
                <div className="detail-img">
                    <img src={detail?.img ?? item.img} alt={name} />
                </div>
                
                <div className="detail-info">
                    <span className="detail-chip">{info.chip}</span>
                    <h2 className="detail-name">{name}</h2>
                    {subText && <p className="detail-sub">{subText}</p>}

                    <p className="detail-price">
                        {rate > 0 && <span className="detail-rate">{rate}%</span>}
                        <strong>{won(item.price)}</strong>
                        {item.originPrice && <del>{won(item.originPrice)}</del>}
                    </p>

                    {detail && (
                        <div className="detail-option">
                            <p className="detail-strength">
                                강도 <span className="detail-strength-bar"></span>
                            </p>
                            <ul className="detail-tags">
                                {detail.tags.map((tag) => <li key={tag}>{tag}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="detail-total">
                        <div className="detail-qty">
                            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span>{qty}</span>
                            <button type="button" onClick={() => setQty(qty + 1)}>+</button>
                        </div>
                        <p className="detail-sum">
                            총 금액 <strong>{won(item.price * qty)}</strong>
                        </p>
                    </div>

                    <div className="detail-btns">
                        <button type="button" className="detail-cart" onClick={() => { addToCart(item.id, qty); setIsCartOpen(true) }}>장바구니 담기</button>
                        <button type="button" className="detail-buy" onClick={() => navigate("/checkout", { state: { items: [{ id: item.id, qty }], fromCart: false } })}>바로 구매</button>
                    </div>
                </div>                
            </section>

            <div className="detail-tabs">
                <Lnb
                    items={detail
                        ? [{ title: "상품 정보", to: "#detail-info" }, { title: "맛 & 특징", to: "#detail-taste" }]
                        : [{ title: "상품 정보", to: "#detail-info" }]}
                    active="#detail-info"
                />
            </div>

            <section className="detail-banner" id="detail-info">
                <div className="detail-banner-text">
                    <p className="detail-banner-eng">{info.eng}</p>
                    <h3 className="detail-banner-title">
                        {info.lines[0]}<br />
                        {info.lines[1]}<span className="detail-banner-dot">.</span>
                    </h3>
                    <p className="detail-banner-desc">{item.desc}</p>
                </div>
                <div className="detail-banner-img">
                    <img src={info.banner} alt="" />
                </div>
            </section>

            {detail && (
                <section className="detail-taste" id="detail-taste">
                    <h3 className="detail-title">맛 &amp; 특징</h3>
                    <ul className="detail-taste-list">
                        {tasteLabels.map(({ key, label }) => (
                            <li key={key}>
                                <p className="detail-taste-label">{label}</p>
                                <ol className="detail-dots">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <li key={n} className={n <= detail.taste[key] ? "is-on" : ""}></li>
                                    ))}
                                </ol>
                            </li>
                        ))}
                    </ul>
                    <dl className="detail-spec">
                        {detail.spec.map((s) => (
                            <div key={s.label}>
                                <dt>{s.label}</dt>
                                <dd>{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

                        <section className="detail-related">
                <h3 className="detail-title">함께 보면 좋은 카누</h3>
                <ul className="store-list">
                    {related.map((p) => {
                        const r = getRate(p)
                        return (
                            <li key={p.id} className="store-card">
                                <Link to={`/store/${p.id}`} onClick={() => setQty(1)}>
                                    <div className="store-card-img">
                                        <img src={p.img} alt={p.name} />
                                    </div>
                                    <p className="store-card-name">
                                        {p.name}
                                        {p.option && <><br />{p.option}</>}
                                    </p>
                                    <p className="store-card-desc">{p.desc}</p>
                                </Link>
                                <p className="store-card-price">
                                    {r > 0 && <span className="store-card-rate">{r}%</span>}
                                    <strong>{won(p.price)}</strong>
                                    {p.originPrice && <del>{won(p.originPrice)}</del>}
                                </p>
                            </li>
                        )
                    })}
                </ul>
            </section>
            {/* 장바구니 팝업: 담기 눌렀을 때만 보임 */}
            {isCartOpen && <CartModal item={item} qty={qty} onClose={() => setIsCartOpen(false)} />}

        </>
    )
}

export default Detail