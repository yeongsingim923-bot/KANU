import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type Post = { id: number; category: string; title: string; author: string; views: number; created_at: string }
type AdminComment = { id: number; content: string; created_at: string; author: string; post_id: number; post_title: string }
type SearchLog = { keyword: string; count: number; lastAt: string }

const formatDate = (s: string) => s.slice(0, 10).replaceAll("-", ".")

// 커뮤니티 · 검색어 관리: 게시글 / 댓글 / 검색어 (누구 것이든 삭제 가능)
function AdminCommunity() {
    const [posts, setPosts] = useState<Post[]>([])
    const [comments, setComments] = useState<AdminComment[]>([])
    const [logs, setLogs] = useState<SearchLog[]>([])
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const load = async () => {
            const [p, c, l] = await Promise.all([
                fetch("/api/community"),
                fetch("/api/admin/comments"),
                fetch("/api/admin/search-logs"),
            ])
            if (p.ok) setPosts(await p.json())
            if (c.ok) setComments(await c.json())
            if (l.ok) setLogs(await l.json())
        }
        load()
    }, [reloadKey])

    // 삭제 공통: 확인창 → DELETE → 목록 다시 불러오기
    const remove = async (message: string, url: string) => {
        if (!confirm(message)) return
        const res = await fetch(url, { method: "DELETE" })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setReloadKey((k) => k + 1)
    }

    return (
        <section>
            <div className="admin-head">
                <h2>게시글 <span>{posts.length}</span></h2>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>분류</th><th className="admin-left">제목</th><th>작성자</th><th>등록일</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {posts.length === 0 ? (
                        <tr><td colSpan={5}>게시글이 없어요.</td></tr>
                    ) : (
                        posts.map((p) => (
                            <tr key={p.id}>
                                <td>{p.category}</td>
                                <td className="admin-left"><Link to={`/board/${p.id}`}>{p.title}</Link></td>
                                <td>{p.author}</td>
                                <td>{formatDate(p.created_at)}</td>
                                <td>
                                    <button type="button" className="admin-btn is-danger"
                                        onClick={() => remove(`'${p.title}' 글을 삭제할까요? 댓글과 좋아요도 함께 삭제됩니다.`, `/api/admin/community/${p.id}`)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="admin-head">
                <h2>최근 댓글 <span>{comments.length}</span></h2>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th className="admin-left">글</th><th className="admin-left">댓글</th><th>작성자</th><th>등록일</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {comments.length === 0 ? (
                        <tr><td colSpan={5}>댓글이 없어요.</td></tr>
                    ) : (
                        comments.map((c) => (
                            <tr key={c.id}>
                                <td className="admin-left"><Link to={`/board/${c.post_id}`}>{c.post_title}</Link></td>
                                <td className="admin-left">{c.content}</td>
                                <td>{c.author}</td>
                                <td>{formatDate(c.created_at)}</td>
                                <td>
                                    <button type="button" className="admin-btn is-danger"
                                        onClick={() => remove("이 댓글을 삭제할까요?", `/api/admin/comments/${c.id}`)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="admin-head">
                <h2>검색어 <span>최근 7일</span></h2>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th className="admin-left">검색어</th><th>횟수</th><th>마지막 검색</th><th>관리</th></tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr><td colSpan={4}>검색 기록이 없어요.</td></tr>
                    ) : (
                        logs.map((l) => (
                            <tr key={l.keyword}>
                                <td className="admin-left">{l.keyword}</td>
                                <td>{l.count}</td>
                                <td>{formatDate(l.lastAt)}</td>
                                <td>
                                    <button type="button" className="admin-btn is-danger"
                                        onClick={() => remove(`'${l.keyword}' 검색 기록을 모두 지울까요? 인기 검색어에서 빠집니다.`, "/api/admin/search-logs?keyword=" + encodeURIComponent(l.keyword))}>삭제</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    )
}

export default AdminCommunity
