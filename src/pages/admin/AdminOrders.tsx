import { useEffect, useState } from "react"
import type { OrderItem } from "../../data/orders"
import { won } from "../../utils/format"

// GET /api/admin/orders 한 줄
type AdminOrder = {
    orderNo: string
    status: string
    username: string
    receiver: string
    phone: string
    address: string
    memo?: string
    payPrice: number
    createdAt: string
    items: OrderItem[]
}

// server.js의 ORDER_STATUSES와 같게
const STATUSES = ["결제 완료", "배송 준비", "배송 중", "배송 완료", "주문 취소"]

// 주문 관리: 상태별로 보기 + 상태 바꾸기
function AdminOrders() {
    const [filter, setFilter] = useState("")                       // "" = 전체
    const [list, setList] = useState<AdminOrder[] | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/admin/orders" + (filter ? "?status=" + encodeURIComponent(filter) : ""))
            if (res.ok) setList(await res.json())
        }
        load()
    }, [filter, reloadKey])

    // 상태 바꾸기 (주문 취소는 한 번 더 확인)
    const changeStatus = async (o: AdminOrder, status: string) => {
        if (status === "주문 취소" && !confirm(`${o.orderNo} 주문을 취소 상태로 바꿀까요?`)) return
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(o.orderNo)}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setReloadKey((k) => k + 1)
    }

    return (
        <section>
            <div className="admin-head">
                <h2>주문 관리 <span>{list?.length ?? 0}</span></h2>
                <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">전체 상태</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>주문번호 · 일시</th>
                        <th>회원</th>
                        <th className="admin-left">받는 분 · 배송지</th>
                        <th className="admin-left">상품</th>
                        <th>결제 금액</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {list === null ? (
                        <tr><td colSpan={6}>불러오는 중...</td></tr>
                    ) : list.length === 0 ? (
                        <tr><td colSpan={6}>주문이 없어요.</td></tr>
                    ) : (
                        list.map((o) => (
                            <tr key={o.orderNo}>
                                <td>{o.orderNo}<br /><small>{o.createdAt.slice(0, 16).replaceAll("-", ".")}</small></td>
                                <td>{o.username}</td>
                                <td className="admin-left">
                                    {o.receiver} · {o.phone}<br /><small>{o.address}{o.memo && ` (${o.memo})`}</small>
                                </td>
                                <td className="admin-left">
                                    {o.items.map((it) => <div key={it.productId}>{it.name} {it.option} × {it.qty}</div>)}
                                </td>
                                <td>{won(o.payPrice)}</td>
                                <td>
                                    <select className="admin-select" value={o.status} onChange={(e) => changeStatus(o, e.target.value)}>
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    )
}

export default AdminOrders
