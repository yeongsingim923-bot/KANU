import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import { ORDER_STEPS, formatDate } from "../../data/orders"
import { won } from "../../utils/format"
import type { OrderSummary } from "../../data/orders"
import "../../css/pages/mypage/MyOrder.css"

// 주문내역 기간 (months 0 = 전체)
const PERIODS = [
    { months: 1, label: "1개월" },
    { months: 3, label: "3개월" },
    { months: 6, label: "6개월" },
    { months: 0, label: "전체" },
]
const PER_PAGE = 5   // 주문내역 한 페이지에 5개

// 주문 날짜가 기간 안인지 ("2026-10-28 14:00:00" → 날짜로 바꿔 비교)
function inPeriod(createdAt: string, months: number) {
    if (months === 0) return true
    const since = new Date()
    since.setMonth(since.getMonth() - months)   // 오늘부터 N개월 전
    return new Date(createdAt.replace(" ", "T")) >= since
}

function MyOrders() {
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const [orders, setOrders] = useState<OrderSummary[] | null>(null)   // null = 불러오는 중
    const [error, setError] = useState("")
    const [months, setMonths] = useState(1)             // 기간 (처음엔 1개월)
    const [periodOpen, setPeriodOpen] = useState(false) // 기간 목록 열림
    const [page, setPage] = useState(1)

    // 로그인 확인이 끝나면 내 주문 목록 불러오기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const res = await fetch('/api/orders')
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setOrders(data)
            else setError(data.message)
        }
        load()
    }, [user])

    // 주문 취소: 서버에서 바꾼 뒤 화면의 상태도 '주문 취소'로
    const cancelOrder = async (orderNo: string) => {
        if (!confirm("주문을 취소할까요?")) return
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNo)}/cancel`, { method: 'POST' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setOrders((prev) => prev && prev.map((o) => (o.orderNo === orderNo ? { ...o, status: "주문 취소" } : o)))
    }

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/mypage" }} />   // 로그인하면 다시 마이페이지로

    const list = orders ?? []
    const activeCount = list.filter((o) => o.status !== "배송 완료" && o.status !== "주문 취소").length   // 진행 중인 주문 (기간과 상관없이 전체)

    // 기간 안의 주문 → 지금 페이지 것만
    const periodList = list.filter((o) => inPeriod(o.createdAt, months))
    const lastPage = Math.max(1, Math.ceil(periodList.length / PER_PAGE))
    const shown = periodList.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // 기간 고르기: 1페이지부터 + 목록 닫기
    const choosePeriod = (m: number) => {
        setMonths(m)
        setPage(1)
        setPeriodOpen(false)
    }

    return(
        <>
            <SubVisual label="마이페이지" title="My Page" desc="주문과 활동 내역을 한눈에 확인하세요" />

            <Lnb
                items={[
                    { title: "주문 내역", to: "/mypage" },
                    { title: "회원 정보 수정", to: "/mypage/info" },
                    { title: "내가 쓴 글", to: "/mypage/posts" },
                    { title: "1:1 문의 내역", to: "/mypage/qna" },
                ]}
            />

            <div className="my-inner">
                {/* ===== 위쪽 카드 3개 ===== */}
                <div className="my-cards">
                    <div className="my-welcome">
                        <p className="my-welcome-eng">WELCOME</p>
                        <p className="my-welcome-name">{user.username} 님</p>
                        <Link to="/mypage/info" className="my-welcome-btn">회원 정보 수정</Link>
                    </div>
                    <div className="my-card">
                        <p className="my-card-title">사용 가능한 쿠폰</p>
                        <p className="my-card-num"><strong>3</strong>장</p>
                    </div>
                    <div className="my-card">
                        <p className="my-card-title">진행 중인 주문</p>
                        <p className="my-card-num"><strong>{activeCount}</strong>건</p>
                    </div>
                </div>
                {/* 단계별 주문 수 (1건 이상이면 강조) */}
                <ol className="my-steps">
                    {ORDER_STEPS.map((step) => {
                        const n = periodList.filter((o) => o.status === step).length   // 고른 기간 기준
                        return <li key={step} className={n > 0 ? "is-on" : ""}><strong>{n}</strong>{step}</li>
                    })}
                </ol>

                <div className="my-head">
                    <h3 className="my-title">주문내역</h3>
                    {/* 기간: 누르면 목록이 열리고, 마우스가 벗어나면 닫힘 (스토어 정렬과 같은 방식) */}
                    <div className="my-period-wrap" onMouseLeave={() => setPeriodOpen(false)}>
                        <button type="button" className="my-period" onClick={() => setPeriodOpen(!periodOpen)}>
                            {PERIODS.find((p) => p.months === months)?.label}
                        </button>
                        {periodOpen && (
                            <ul className="my-period-list">
                                {PERIODS.map((p) => (
                                    <li key={p.months}>
                                        <button type="button" className={p.months === months ? "is-active" : ""} onClick={() => choosePeriod(p.months)}>
                                            {p.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 주문 목록 */}
                {error ? (
                    <p className="my-empty">{error}</p>
                ) : orders === null ? (
                    <p className="my-empty">주문 내역을 불러오는 중...</p>
                ) : orders.length === 0 ? (
                    <p className="my-empty">아직 주문 내역이 없어요.</p>
                ) : periodList.length === 0 ? (
                    <p className="my-empty">이 기간에 주문 내역이 없어요. 기간을 늘려 보세요.</p>
                ) : (
                    shown.map((o) => (
                        <div className="my-order" key={o.orderNo}>
                            <div className="my-order-top">
                                <span>{formatDate(o.createdAt)}</span>
                                <span>{o.orderNo}</span>
                                <Link to={`/mypage/order/${o.orderNo}`} className="my-order-link">주문 상세 &gt;</Link>
                            </div>
                            <div className="my-order-item">
                                <div className="my-order-img">
                                    {o.firstItem?.img && <img src={o.firstItem.img} alt={o.firstItem.name} />}
                                </div>
                                <div className="my-order-info">
                                    <span className="my-order-status">{o.status}</span>
                                    <p className="my-order-name">
                                        {o.firstItem?.name} {o.firstItem?.option}
                                        {o.itemCount > 1 && ` 외 ${o.itemCount - 1}건`}
                                    </p>
                                    <p className="my-order-sub">{o.totalQty}개 · {won(o.payPrice)}</p>
                                </div>
                                {/* 결제 완료일 때만 취소 가능 */}
                                {o.status === "결제 완료" && (
                                    <button type="button" className="my-order-cancel" onClick={() => cancelOrder(o.orderNo)}>주문 취소</button>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* 페이지 번호 (한 페이지뿐이면 숨김) */}
                {lastPage > 1 && (
                    <div className="my-pager">
                        <button type="button" className="my-pager-arrow" onClick={() => setPage(page - 1)} disabled={page === 1}>&lt;</button>
                        {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
                            <button
                                type="button"
                                key={n}
                                className={n === page ? "my-pager-num is-active" : "my-pager-num"}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button type="button" className="my-pager-arrow" onClick={() => setPage(page + 1)} disabled={page === lastPage}>&gt;</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default MyOrders