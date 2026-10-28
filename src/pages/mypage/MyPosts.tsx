import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import "../../css/pages/mypage/MyPosts.css"

// GET /api/community/mine 응답 한 줄
type MyPost = {
    id: number
    category: string
    title: string
    views: number
    created_at: string
}

function MyPosts() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const [posts, setPosts] = useState<MyPost[] | null>(null)   // null = 불러오는 중
    const [error, setError] = useState("")

    // 로그인 확인이 끝나면 내가 쓴 글 불러오기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const res = await fetch('/api/community/mine')
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setPosts(data)
            else setError(data.message)
        }
        load()
    }, [user])

    // 삭제: 확인창 → 서버에서 삭제 → 표에서도 빼기
    const handleDelete = async (id: number) => {
        if (!confirm("글을 삭제할까요? 삭제한 글은 되돌릴 수 없어요.")) return
        const res = await fetch('/api/community/' + id, { method: 'DELETE' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setPosts((prev) => prev && prev.filter((p) => p.id !== id))
    }

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/mypage/posts" }} />

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
            <div className="mypage-posts">
                <div className="mypage-posts-header">
                    <label> 
                        <h2>내가 쓴 글</h2>
                        <span>커뮤니티에 남긴 글과 댓글을 모아봤어요.</span>
                    </label>
                    <button type="button" onClick={() => navigate('/board/write')}><img src="/images/write.png"/>새 글 쓰기</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>분류</th>
                            <th className="mypage-posts-title">제목</th>
                            <th>등록일자</th>
                            <th>조회수</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr><td colSpan={5}>{error}</td></tr>
                        ) : posts === null ? (
                            <tr><td colSpan={5}>불러오는 중...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={5}>아직 작성한 글이 없어요.</td></tr>
                        ) : (
                            posts.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.category}</td>
                                    <td className="mypage-posts-title"><Link to={`/board/${p.id}`}>{p.title}</Link></td>
                                    <td>{p.created_at.slice(0, 10).replaceAll('-', '.')}</td>
                                    <td>{p.views}</td>
                                    <td>
                                        <div className="mypage-posts-manage">
                                            <button type="button" onClick={() => navigate(`/board/edit/${p.id}`)}>수정</button>
                                            <button type="button" onClick={() => handleDelete(p.id)}>삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MyPosts