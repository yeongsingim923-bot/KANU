import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import { useProductStore } from "../../store/productStore"
import { useCartStore } from "../../store/cartStore"
import { useAuthStore } from "../../store/authStore"
import "../../css/pages/store/Cart.css"
import ServerError from "../ServerError"
import { won } from "../../utils/format"

const FREE_SHIPPING = 30000   // 이 금액 이상이면 배송비 무료
const SHIPPING_FEE = 3000     // 기본 배송비

function Cart() {
    const items = useCartStore((s) => s.items)
    const setQty = useCartStore((s) => s.setQty)
    const remove = useCartStore((s) => s.remove)
    const [unchecked, setUnchecked] = useState<string[]>([])   // 체크 해제한 상품 id (처음엔 전부 선택된 상태)
    const user = useAuthStore((s) => s.user)                    // 로그인한 사람 (주문은 로그인 필수)
    const navigate = useNavigate()

    // 상품 목록: 서버(DB)에서 불러오기 (이름, 가격, 사진을 붙이기 위해)
    const products = useProductStore((s) => s.products)
    const loading = useProductStore((s) => s.loading)
    const error = useProductStore((s) => s.error)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    useEffect(() => { fetchProducts() }, [fetchProducts])

    if (loading) return null                                       // 불러오는 중 (빈 장바구니로 잠깐 보이는 것 방지)
    if (error) return <ServerError />     // 서버 오류 → 404 디자인의 오류 화면

    // 장바구니(id + 수량)에 상품 정보 붙이기 (products에 없는 id는 빼기)
    const rows = items.flatMap((it) => {
        const product = products.find((p) => p.id === it.id)
        return product ? [{ ...it, product }] : []
    })
    const selected = rows.filter((r) => !unchecked.includes(r.id))   // 체크된 상품
    const isAllChecked = rows.length > 0 && selected.length === rows.length

    // 전체 선택: 다 체크돼 있으면 전부 해제, 아니면 전부 체크
    const toggleAll = () => setUnchecked(isAllChecked ? rows.map((r) => r.id) : [])
    const toggleOne = (id: string) =>
        setUnchecked(unchecked.includes(id) ? unchecked.filter((x) => x !== id) : [...unchecked, id])

    // 금액 계산 (체크된 상품만)
    const total = selected.reduce((sum, r) => sum + (r.product.originPrice ?? r.product.price) * r.qty, 0)   // 정가 합계
    const pay = selected.reduce((sum, r) => sum + r.product.price * r.qty, 0)                                // 할인가 합계
    const discount = total - pay
    const shipping = pay === 0 || pay >= FREE_SHIPPING ? 0 : SHIPPING_FEE
    const final = pay + shipping

    // 선택한 상품이 없으면 주문서로 못 가게
    const handleOrder = (e: React.MouseEvent) => {
        if (selected.length === 0) {
            e.preventDefault()
            alert("주문할 상품을 선택해주세요.")
        } else if (!user) {
            e.preventDefault()
            alert("로그인 후 주문할 수 있습니다.")
            navigate("/login", { state: { from: "/cart" } })   // 로그인하면 장바구니로 돌아옴
        }
    }

    return(

        <>
            <SubVisual label="장바구니" title="My Cart" desc="담아둔 상품을 확인하고 주문하세요" />
            {rows.length === 0 ? (
                // 장바구니가 비었을 때
                <div className="cart-empty">
                    <p className="cart-empty-title">장바구니가 비어 있어요</p>
                    <p className="cart-empty-desc">마음에 드는 카누를 담아보세요.</p>
                    <Link to="/store" className="cart-empty-btn">쇼핑하러 가기</Link>
                </div>
            ) : (
            <div className="cart-inner">
                <section className="cart-main">
                    <div className="cart-toolbar">
                        <label className="cart-check-all">
                            <input type="checkbox" className="cart-check" checked={isAllChecked} onChange={toggleAll} />
                            전체 선택 ({selected.length}/{rows.length})
                        </label>
                        <button type="button" className="cart-delete" onClick={() => remove(selected.map((r) => r.id))}>선택 삭제</button>
                    </div>
                    <ul className="cart-list">
                        {rows.map((r) => (
                            <li className="cart-item" key={r.id}>
                                <input type="checkbox" className="cart-check" checked={!unchecked.includes(r.id)} onChange={() => toggleOne(r.id)} />
                                <Link to={`/store/${r.id}`} className="cart-item-img">
                                    <img src={r.product.img} alt={r.product.name} />
                                </Link>
                                <div className="cart-item-info">
                                    <p className="cart-item-name">{r.product.name} {r.product.option}</p>
                                    <p className="cart-item-count">{r.qty}개</p>
                                    <p className="cart-item-price">{won(r.product.price * r.qty)}</p>
                                </div>
                                <div className="cart-qty">
                                    <button type="button" onClick={() => setQty(r.id, r.qty - 1)}>-</button>
                                    <span>{r.qty}</span>
                                    <button type="button" onClick={() => setQty(r.id, r.qty + 1)}>+</button>
                                </div>
                                <button type="button" className="cart-remove" onClick={() => remove([r.id])}>X</button>
                            </li>
                        ))}
                    </ul>
                </section>

                <aside className="cart-summary">
                    <h3 className="cart-summary-title">결제 예상 금액</h3>
                    <dl className="cart-summary-list">
                        <div>
                            <dt>상품 합계</dt>
                            <dd>{won(total)}</dd>
                        </div>
                        <div>
                            <dt>할인 금액</dt>
                            <dd>-{won(discount)}</dd>
                        </div>
                        <div>
                            <dt>배송비</dt>
                            <dd>{won(shipping)}</dd>
                        </div>
                    </dl>
                    <div className="cart-summary-total">
                        <p>최종 결제 금액</p>
                        <strong>{won(final)}</strong>
                    </div>
                    <Link
                        to="/checkout"
                        state={{ items: selected.map((r) => ({ id: r.id, qty: r.qty })), fromCart: true }}   // 체크한 상품만 주문서로
                        className="cart-order"
                        onClick={handleOrder}
                    >
                        주문 하기
                    </Link>
                    <Link to="/store" className="cart-continue">쇼핑 계속하기</Link>
                </aside>
            </div>
            )}
        </>
    )
}

export default Cart