import { useEffect, useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/store/OrderComplete.css"

// GET /api/orders/:orderNo 응답 중 이 화면에서 쓰는 것만
type OrderDetail = {
    orderNo: string
    receiver: string
    phone: string
    address: string
    memo?: string
    payPrice: number
    items: { name: string; option?: string; qty: number }[]
}

const won = (n: number) => n.toLocaleString() + "원"

function OrderComplete() {
    const location = useLocation()
    const orderNo = (location.state as { orderNo?: string } | null)?.orderNo   // 주문서에서 넘겨준 주문번호
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [error, setError] = useState("")

    // 주문번호로 주문 내용 불러오기
    useEffect(() => {
        if (!orderNo) return
        const load = async () => {
            const res = await fetch('/api/orders/' + encodeURIComponent(orderNo))
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setOrder(data)
            else setError(data.message)
        }
        load()
    }, [orderNo])

    if (!orderNo) return <Navigate to="/mypage" replace />          // 주소로 바로 들어오면 주문내역으로
    if (error) return <p className="product-error">{error}</p>      // 없는 주문 / 서버 오류
    if (!order) return null                                          // 불러오는 중

    // "카누 라떼 (50T) 외 1건"
    const first = order.items[0]
    const itemText = `${first.name} ${first.option ?? ""}`.trim() + (order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : "")

    return(
        <>
            <SubVisual label="주문 완료" title="Thank You" desc="주문해주셔서 감사합니다" />

            <section className="complete">
                <h3 className="complete-title">주문이 완료되었어요</h3>
                <p className="complete-num">주문번호 {order.orderNo}</p>
                <dl className="complete-table">
                    <div>
                        <dt>주문 상품</dt>
                        <dd>{itemText}</dd>
                    </div>
                    <div>
                        <dt>받는 분</dt>
                        <dd>{order.receiver} · {order.phone}</dd>
                    </div>
                    <div>
                        <dt>배송지</dt>
                        <dd>{order.address}</dd>
                    </div>
                    <div>
                        <dt>배송 요청</dt>
                        <dd>{order.memo ?? "없음"}</dd>
                    </div>
                    <div>
                        <dt>총 결제 금액</dt>
                        <dd>{won(order.payPrice)}</dd>
                    </div>
                </dl>

                <div className="complete-btns">
                    <Link to="/mypage" className="complete-history">주문 내역 보기</Link>
                    <Link to="/store" className="complete-shop">쇼핑 계속하기</Link>
                </div>
            </section>
        </>
    )
}

export default OrderComplete