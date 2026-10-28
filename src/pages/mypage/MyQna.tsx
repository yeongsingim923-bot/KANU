import { Fragment, useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import "../../css/pages/mypage/MyQna.css"

// GET /api/inquiries/mine 응답 한 줄
type Inquiry = {
    id: number
    category: string
    title: string
    content: string
    images: string[]
    answer?: string          // 답변 전이면 없음
    answeredAt?: string
    createdAt: string
}

const formatDate = (s: string) => s.slice(0, 10).replaceAll("-", ".")

function MyQna() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const [list, setList] = useState<Inquiry[] | null>(null)   // null = 불러오는 중
    const [error, setError] = useState("")
    const [openId, setOpenId] = useState<number | null>(null)  // 펼쳐 본 문의 번호

    // 로그인 확인이 끝나면 내 문의 불러오기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const res = await fetch('/api/inquiries/mine')
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setList(data)
            else setError(data.message)
        }
        load()
    }, [user])

    // 삭제: 확인창 → 서버에서 삭제 → 표에서도 빼기
    const handleDelete = async (id: number) => {
        if (!confirm("문의를 삭제할까요? 삭제한 문의는 되돌릴 수 없어요.")) return
        const res = await fetch('/api/inquiries/' + id, { method: 'DELETE' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setList((prev) => prev && prev.filter((q) => q.id !== id))
    }

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/mypage/qna" }} />

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
            <div className="mypage-qna">
                <div className="mypage-qna-header">
                    <label> 
                        <h2>1:1 문의 내역</h2>
                        <span>제목을 누르면 문의 내용과 답변을 볼 수 있어요.</span>
                    </label>
                    <button type="button" onClick={() => navigate('/qna')}><img src="/images/notice.png"/>새 문의 하기</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>분류</th>
                            <th className="mypage-qna-title">제목</th>
                            <th>등록일자</th>
                            <th>답변 상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                                        <tbody>
                        {error ? (
                            <tr><td colSpan={5}>{error}</td></tr>
                        ) : list === null ? (
                            <tr><td colSpan={5}>불러오는 중...</td></tr>
                        ) : list.length === 0 ? (
                            <tr><td colSpan={5}>아직 문의 내역이 없어요.</td></tr>
                        ) : (
                            list.map((q) => (
                                // Fragment: 한 문의 = 요약 줄 + (펼쳤을 때) 내용 줄, 두 줄을 묶음
                                <Fragment key={q.id}>
                                    <tr>
                                        <td>{q.category}</td>
                                        <td className="mypage-qna-title">
                                            <button type="button" onClick={() => setOpenId(openId === q.id ? null : q.id)}>{q.title}</button>
                                        </td>
                                        <td>{formatDate(q.createdAt)}</td>
                                        <td>
                                            <span className={q.answer ? "mypage-qna-status is-done" : "mypage-qna-status"}>
                                                {q.answer ? "답변 완료" : "답변 대기"}
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" className="mypage-qna-delete" onClick={() => handleDelete(q.id)}>삭제</button>
                                        </td>
                                    </tr>
                                    {openId === q.id && (
                                        <tr className="mypage-qna-detail">
                                            <td colSpan={5}>
                                                <p className="mypage-qna-content">{q.content}</p>
                                                {q.images.map((src) => <img key={src} src={src} alt="첨부 사진" />)}
                                                <div className="mypage-qna-answer">
                                                    {q.answer ? (
                                                        <>
                                                            <strong>KANU 답변 · {formatDate(q.answeredAt ?? "")}</strong>
                                                            <p>{q.answer}</p>
                                                        </>
                                                    ) : (
                                                        <p>답변을 준비하고 있어요. 평일 9~17시에 순서대로 답변드립니다.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MyQna