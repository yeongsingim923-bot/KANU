import { useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { useProductStore } from "../../store/productStore"
import "../../css/pages/store/Cart.css"       
import "../../css/pages/store/Checkout.css"
import { motion, AnimatePresence } from "motion/react"

const requests = ["문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락 부탁드려요"]

const won = (n: number) => n.toLocaleString() + "원"
const FREE_SHIPPING = 30000   // 이 금액 이상이면 배송비 무료 (Cart.tsx, server.js와 같은 규칙)
const SHIPPING_FEE = 3000     // 기본 배송비

// 장바구니 / 바로 구매에서 넘겨주는 값
type CheckoutState = {
    items: { id: string; qty: number }[]   // 주문할 상품 id + 수량
    fromCart: boolean                      // 장바구니에서 왔으면 true (주문 후 장바구니에서 빼기)
}

// 숫자만 입력해도 010-0000-0000 모양으로
const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length < 4) return d
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

// 내 정보(성함, 휴대폰) 불러오기 → 받는 분/연락처 채우기용
async function fetchProfile(): Promise<{ name: string | null; phone: string | null } | null> {
    const res = await fetch('/api/me/profile')
    return res.ok ? res.json() : null
}

function Checkout() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as CheckoutState | null

    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const removeFromCart = useCartStore((s) => s.remove)

    // 상품 목록: 서버(DB)에서 불러오기 (이름, 가격, 사진을 붙이기 위해)
    const products = useProductStore((s) => s.products)
    const loading = useProductStore((s) => s.loading)
    const error = useProductStore((s) => s.error)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    useEffect(() => { fetchProducts() }, [fetchProducts])

    const [open, setOpen] = useState(false)          // 목록 열림/닫힘
    const [request, setRequest] = useState("")       // 고른 요청사항 (처음엔 비어있음)

    // 배송지 입력값
    const [receiver, setReceiver] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [errorMsg, setErrorMsg] = useState("")          // 입력/주문 오류 문구
    const [submitting, setSubmitting] = useState(false)   // 주문 보내는 중 (버튼 두 번 누르기 방지)

    // 내 정보로 받는 분/연락처 채우기 ('내 정보' 버튼)
    const fillMyInfo = async () => {
        const me = await fetchProfile()
        if (me?.name) setReceiver(me.name)
        if (me?.phone) setPhone(me.phone)
    }

    // 로그인 확인이 끝나면 한 번 자동으로 채우기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const me = await fetchProfile()
            if (me?.name) setReceiver(me.name)
            if (me?.phone) setPhone(me.phone)
        }
        load()
    }, [user])

    // 주문할 상품이 없으면(주소로 바로 들어옴) 장바구니로
    if (!state?.items?.length) return <Navigate to="/cart" replace />
    // 로그인 / 상품 확인 중이면 잠깐 비워 두기
    if (authLoading || loading) return null
    // 로그인 안 했으면 로그인 화면으로 (로그인 후 장바구니 또는 상품 상세로 돌아옴)
    if (!user) return <Navigate to="/login" replace state={{ from: state.fromCart ? '/cart' : `/store/${state.items[0].id}` }} />
    if (error) return <p className="product-error">{error}</p>     // 서버 오류

    // 주문할 상품에 상품 정보 붙이기
    const rows = state.items.flatMap((it) => {
        const product = products.find((p) => p.id === it.id)
        return product ? [{ ...it, product }] : []
    })

    // 금액 계산 (화면 미리보기용 - 실제 저장 금액은 서버가 DB 가격으로 다시 계산)
    const total = rows.reduce((sum, r) => sum + (r.product.originPrice ?? r.product.price) * r.qty, 0)   // 정가 합계
    const pay = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0)                                // 할인가 합계
    const discount = total - pay
    const shipping = pay >= FREE_SHIPPING ? 0 : SHIPPING_FEE
    const final = pay + shipping

    // 주문하기
    const handleOrder = async () => {
        if (submitting) return
        setErrorMsg("")
        if (!receiver.trim()) return setErrorMsg("받는 분을 입력해주세요.")
        if (!/^010-\d{4}-\d{4}$/.test(phone)) return setErrorMsg("연락처를 010-0000-0000 형식으로 입력해주세요.")
        if (!address.trim()) return setErrorMsg("배송지를 입력해주세요.")

        setSubmitting(true)
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: rows.map((r) => ({ id: r.id, qty: r.qty })),   // 금액은 보내지 않음 (서버가 계산)
                receiver,
                phone,
                address,
                memo: request,
            }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        setSubmitting(false)
        if (!res.ok) return setErrorMsg(data.message)

        if (state.fromCart) removeFromCart(rows.map((r) => r.id))   // 주문한 상품은 장바구니에서 빼기
        navigate('/order-complete', { replace: true, state: { orderNo: data.orderNo } })   // 뒤로가기로 주문서에 다시 안 오게 replace
    }

    return(
        <>
            <SubVisual label="주문서" title="Checkout" desc="주문 정보를 확인하고 결제를 진행해주세요" />

            <div className="cart-inner">
                <section className="cart-main">
                    <div className="checkout-address">
                        <div className="checkout-head">
                            <h3 className="checkout-title">배송지</h3>
                            <button type="button" className="checkout-change" onClick={fillMyInfo}>내 정보</button>
                        </div>

                        <div className="checkout-box checkout-form">
                            <label>
                                <span>받는 분</span>
                                <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="이름을 입력해주세요" maxLength={30} />
                            </label>
                            <label>
                                <span>연락처</span>
                                <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-0000-0000" inputMode="numeric" />
                            </label>
                            <label>
                                <span>주소</span>
                                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="도로명 주소와 상세 주소를 입력해주세요" maxLength={255} />
                            </label>
                        </div>
                        {errorMsg && <p className="checkout-error">{errorMsg}</p>}

                        {/* ===== 배송 요청사항 (직접 만든 선택창) ===== */}
                        <div className={open ? "checkout-request is-open" : "checkout-request"}>
                            <button
                                type="button"
                                className={request ? "checkout-request-btn is-picked" : "checkout-request-btn"}
                                onClick={() => setOpen(!open)}
                            >
                                {request || "배송 요청사항을 선택해주세요"}
                            </button>

                            <AnimatePresence>
                                {open && (
                                    <motion.ul
                                        className="checkout-request-list"
                                        initial={{ opacity: 0, y: -10 }}   // 처음: 투명 + 살짝 위
                                        animate={{ opacity: 1, y: 0 }}     // 열림: 선명 + 제자리
                                        exit={{ opacity: 0, y: -10 }}      // 닫힘: 다시 투명 + 위로
                                        transition={{ duration: 0.25 }}
                                    >
                                        {requests.map((item) => (
                                            <li key={item}>
                                                <button
                                                    type="button"
                                                    className={request === item ? "is-active" : ""}
                                                    onClick={() => { setRequest(item); setOpen(false) }}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <ul className="cart-list checkout-list">
                        {rows.map((r) => (
                            <li className="cart-item" key={r.id}>
                                <div className="cart-item-img">
                                    <img src={r.product.img} alt={r.product.name} />
                                </div>
                                <div className="cart-item-info">
                                    <p className="cart-item-name">{r.product.name} {r.product.option}</p>
                                    <p className="cart-item-count">{r.qty}개</p>
                                    <p className="cart-item-price">{won(r.product.price * r.qty)}</p>
                                </div>
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
                    <button type="button" className="cart-order" onClick={handleOrder} disabled={submitting}>
                        {submitting ? "주문 중..." : "주문 하기"}
                    </button>
                    <Link to="/store" className="cart-continue">쇼핑 계속하기</Link>
                </aside>
            </div>
        </>
    )
}

export default Checkout