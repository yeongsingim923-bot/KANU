import { useEffect, useState } from "react"

// GET /api/admin/inquiries 한 줄
type AdminInquiry = {
    id: number
    category: string
    name: string
    phone: string
    email: string | null
    title: string
    content: string
    images: string[]
    answer: string | null
    answered_at: string | null
    created_at: string
    username: string
}

const formatDate = (s: string) => s.slice(0, 16).replaceAll("-", ".")

// 1:1 문의 답변
function AdminInquiries() {
    const [waitingOnly, setWaitingOnly] = useState(true)              // 답변 대기만 보기
    const [list, setList] = useState<AdminInquiry[] | null>(null)
    const [drafts, setDrafts] = useState<Record<number, string>>({})   // 문의별로 쓰는 중인 답변
    const [reloadKey, setReloadKey] = useState(0)                      // 숫자를 바꾸면 목록을 다시 불러옴

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/admin/inquiries" + (waitingOnly ? "?status=waiting" : ""))
            if (res.ok) setList(await res.json())
        }
        load()
    }, [waitingOnly, reloadKey])

    // 답변 저장 (빈 칸이면 답변 취소)
    const saveAnswer = async (q: AdminInquiry, answer: string) => {
        if (!answer.trim() && !confirm("답변을 비우면 '답변 대기'로 돌아갑니다. 계속할까요?")) return
        const res = await fetch(`/api/admin/inquiries/${q.id}/answer`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setDrafts((prev) => {
            const next = { ...prev }
            delete next[q.id]   // 저장했으니 쓰던 내용 정리
            return next
        })
        setReloadKey((k) => k + 1)
    }

    return (
        <section>
            <div className="admin-head">
                <h2>1:1 문의</h2>
                <label className="admin-check">
                    <input type="checkbox" checked={waitingOnly} onChange={(e) => setWaitingOnly(e.target.checked)} />
                    답변 대기만 보기
                </label>
            </div>

            {list === null ? (
                <p className="admin-empty">불러오는 중...</p>
            ) : list.length === 0 ? (
                <p className="admin-empty">{waitingOnly ? "답변을 기다리는 문의가 없어요." : "문의가 없어요."}</p>
            ) : (
                <ul className="admin-cards">
                    {list.map((q) => {
                        const draft = drafts[q.id] ?? q.answer ?? ""   // 쓰는 중인 답변이 없으면 기존 답변
                        return (
                            <li key={q.id} className="admin-card">
                                <div className="admin-card-top">
                                    <span className="admin-chip">{q.category}</span>
                                    <strong>{q.title}</strong>
                                    <span className={q.answer ? "admin-status is-done" : "admin-status"}>{q.answer ? "답변 완료" : "답변 대기"}</span>
                                </div>
                                <p className="admin-card-meta">
                                    {q.username} · {q.name} · {q.phone}{q.email && ` · ${q.email}`} · {formatDate(q.created_at)}
                                </p>
                                <p className="admin-card-content">{q.content}</p>
                                {q.images.length > 0 && (
                                    <div className="admin-card-images">
                                        {q.images.map((src) => <img key={src} src={src} alt="첨부 사진" />)}
                                    </div>
                                )}
                                <textarea
                                    value={draft}
                                    onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                                    placeholder="답변을 입력하세요"
                                />
                                <div className="admin-card-btns">
                                    {q.answered_at && <span>답변 {formatDate(q.answered_at)}</span>}
                                    <button type="button" className="admin-btn is-primary" onClick={() => saveAnswer(q, draft)}>
                                        {q.answer ? "답변 수정" : "답변 등록"}
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}

export default AdminInquiries
