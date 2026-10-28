import { useEffect, useState } from "react"

// GET /api/notices 한 줄
type NoticeItem = {
    id: number
    title: string
    content: string
    pinned: boolean
    createdAt: string
}
type NoticeForm = { title: string; content: string; pinned: boolean }
const EMPTY_FORM: NoticeForm = { title: "", content: "", pinned: false }

// 공지사항 관리: 위쪽 입력 폼(새 공지 / 수정) + 아래 목록
function AdminNotices() {
    const [list, setList] = useState<NoticeItem[]>([])
    const [form, setForm] = useState<NoticeForm>(EMPTY_FORM)
    const [editingId, setEditingId] = useState<number | null>(null)   // 고치는 중인 공지 (null = 새 공지)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/notices")
            if (res.ok) setList(await res.json())
        }
        load()
    }, [reloadKey])

    // 공지 저장: 새 공지는 POST, 수정은 PUT
    const send = async (url: string, method: string, body: NoticeForm) => {
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) {
            alert(data.message)
            return false
        }
        setReloadKey((k) => k + 1)
        return true
    }

    const handleSave = async () => {
        const ok = editingId
            ? await send(`/api/admin/notices/${editingId}`, "PUT", form)
            : await send("/api/admin/notices", "POST", form)
        if (ok) {
            setForm(EMPTY_FORM)
            setEditingId(null)
        }
    }

    // 수정 버튼: 그 공지 내용을 위 폼에 채우기
    const startEdit = (n: NoticeItem) => {
        setEditingId(n.id)
        setForm({ title: n.title, content: n.content, pinned: n.pinned })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
    }

    // 고정 켜기/끄기: 제목·내용은 그대로, 고정만 바꿔서 저장
    const togglePin = (n: NoticeItem) =>
        send(`/api/admin/notices/${n.id}`, "PUT", { title: n.title, content: n.content, pinned: !n.pinned })

    const remove = async (n: NoticeItem) => {
        if (!confirm(`'${n.title}' 공지를 삭제할까요?`)) return
        const res = await fetch(`/api/admin/notices/${n.id}`, { method: "DELETE" })
        if (!res.ok) return alert("삭제하지 못했습니다.")
        if (editingId === n.id) cancelEdit()
        setReloadKey((k) => k + 1)
    }

    return (
        <section>
            <div className="admin-head">
                <h2>{editingId ? "공지 수정" : "새 공지"}</h2>
            </div>
            <div className="admin-form">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목 (100자까지)" maxLength={100} />
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="내용 (엔터로 줄바꿈)" />
                <div className="admin-form-bottom">
                    <label className="admin-check">
                        <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
                        목록 맨 위에 고정
                    </label>
                    {editingId && <button type="button" className="admin-btn" onClick={cancelEdit}>취소</button>}
                    <button type="button" className="admin-btn is-primary" onClick={handleSave}>{editingId ? "수정 저장" : "공지 등록"}</button>
                </div>
            </div>

            <div className="admin-head">
                <h2>공지 목록 <span>{list.length}</span></h2>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>고정</th>
                        <th className="admin-left">제목</th>
                        <th>등록일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr><td colSpan={4}>등록된 공지가 없어요.</td></tr>
                    ) : (
                        list.map((n) => (
                            <tr key={n.id} className={editingId === n.id ? "is-editing" : ""}>
                                <td>{n.pinned && <span className="admin-status is-done">공지</span>}</td>
                                <td className="admin-left">{n.title}</td>
                                <td>{n.createdAt.slice(0, 10).replaceAll("-", ".")}</td>
                                <td>
                                    <div className="admin-btns">
                                        <button type="button" className="admin-btn" onClick={() => startEdit(n)}>수정</button>
                                        <button type="button" className="admin-btn" onClick={() => togglePin(n)}>{n.pinned ? "고정 해제" : "고정"}</button>
                                        <button type="button" className="admin-btn is-danger" onClick={() => remove(n)}>삭제</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    )
}

export default AdminNotices
