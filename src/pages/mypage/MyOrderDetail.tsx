import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import { ORDER_STEPS, won, formatDate } from "../../data/orders"
import type { OrderDetail } from "../../data/orders"
import "../../css/pages/mypage/MyOrder.css"        // 주문 단계 박스 같이 쓰기
import "../../css/pages/mypage/MyOrderDetail.css"

function MyOrderDetail() {
    const { id } = useParams()     // 주소 /mypage/order/20261027-0002 → 주문번호
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [error, setError] = useState("")

    // 로그인 확인이 끝나면 주문 상세 불러오기
    useEffect(() => {
        if (!user || !id) return
        const load = async () => {
            const res = await fetch('/api/orders/' + encodeURIComponent(id))
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setOrder(data)
            else setError(data.message)
        }
        load()
    }, [user, id])

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: `/mypage/order/${id}` }} />
    if (error) return <p className="product-error">{error}</p>     // 없는 주문 / 남의 주문 / 서버 오류
    if (!order) return null                                         // 불러오는 중

    const totalQty = order.items.reduce((sum, it) => sum + it.qty, 0)

    return(
        <>
            <SubVisual label="마이페이지" title="My Page" desc="주문과 활동 내역을 한눈에 확인하세요" />

            <div className="order-inner">
                {/* ===== 제목 ===== */}
                <div className="order-head">
                    <div>
                        <h3 className="order-title">주문상세</h3>
                        <p className="order-date">{formatDate(order.createdAt)} · {order.orderNo}</p>
                    </div>
                    <Link to="/mypage" className="order-back">목록으로</Link>
                </div>
                {/* ===== 주문 단계 (마이페이지 홈이랑 같은 박스) ===== */}
                                {/* 지금 단계만 강조 (취소된 주문은 모두 꺼짐) */}
                <ol className="my-steps order-steps">
                    {ORDER_STEPS.map((step) => {
                        const isNow = order.status === step
                        return <li key={step} className={isNow ? "is-on" : ""}><strong>{isNow ? 1 : 0}</strong>{step}</li>
                    })}
                </ol>

                {/* ===== 주문 상품 ===== */}
                <section className="order-products">
                    <div className="order-section-head">
                        <h4 className="order-section-title">주문 상품 {totalQty}개</h4>
                        <button type="button" className="order-track">배송 조회</button>
                    </div>

                    <ul className="order-list">
                        {order.items.map((it) => (
                            <li className="order-item" key={it.productId}>
                                <div className="order-item-img">
                                    {it.img && <img src={it.img} alt={it.name} />}
                                </div>
                                <div className="order-item-info">
                                    <p className="order-item-name">{it.name} {it.option}</p>
                                    <p className="order-item-count">{it.qty}개</p>
                                </div>
                                <p className="order-item-price">{won(it.price * it.qty)}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ===== 배송지 + 결제정보 ===== */}
                <div className="order-bottom">
                    <section className="order-box">
                        <h4 className="order-section-title">배송지</h4>
                        <div className="order-address">
                            <p className="order-address-name">{order.receiver}</p>
                            <p>{order.phone}</p>
                            <p>{order.address}</p>
                            {order.memo && <p className="order-address-memo">{order.memo}</p>}
                        </div>
                    </section>

                    <section className="order-box">
                        <h4 className="order-section-title">결제정보</h4>
                        <dl className="order-pay">
                            <div>
                                <dt>상품 합계</dt>
                                <dd>{won(order.totalPrice)}</dd>
                            </div>
                            <div>
                                <dt>할인 금액</dt>
                                <dd>-{won(order.discount)}</dd>
                            </div>
                            <div>
                                <dt>배송비</dt>
                                <dd>{won(order.shippingFee)}</dd>
                            </div>
                            <div>
                                <dt>주문 상태</dt>
                                <dd>{order.status}</dd>
                            </div>
                            <div>
                                <dt>총 결제 금액</dt>
                                <dd className="order-pay-total">{won(order.payPrice)}</dd>
                            </div>
                        </dl>
                    </section>
                </div>
                
                <div className="order-btns">
                    <Link to="/qna" className="order-qna">문의하기</Link>
                    <Link to="/mypage" className="order-list-btn">주문내역으로</Link>
                </div>
            </div>
        </>
    )
}

export default MyOrderDetail