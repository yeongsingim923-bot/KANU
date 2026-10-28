import { Fragment, useEffect, useState } from "react"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/support/Notice.css"

// GET /api/notices 응답 한 줄
type NoticeItem = {
    id: number
    title: string
    content: string
    pinned: boolean       // true면 목록 맨 위 고정 공지
    createdAt: string
}

const formatDate = (s: string) => s.slice(0, 10).replaceAll("-", ".")
function Notice() {
    const [list, setList] = useState<NoticeItem[] | null>(null)   // null = 불러오는 중
    const [error, setError] = useState("")
    const [openId, setOpenId] = useState<number | null>(null)      // 펼쳐 본 공지 번호

    // 공지 목록 불러오기 (로그인 없이 누구나)
    useEffect(() => {
        const load = async () => {
            const res = await fetch('/api/notices')
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setList(data)
            else setError(data.message)
        }
        load()
    }, [])

    // 일반 공지 번호: 오래된 공지가 1번 (고정 공지는 번호 대신 '공지' 표시)
    const normal = (list ?? []).filter((n) => !n.pinned)

    return(
        <>
            <SubVisual label="공지사항" title="Notice" desc="카누의 새로운 소식을 알려드려요" />

            <Lnb
                items={[
                    { title: "공지사항", to: "/notice" },
                    { title: "1:1 문의", to: "/qna" },
                ]}
            />

            <div className="notice-board">
                <div className="notice-board-head">
                    <h2>공지사항</h2>
                    <span>제목을 누르면 내용을 볼 수 있어요.</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th className="notice-board-title">제목</th>
                            <th>등록일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr><td colSpan={3}>{error}</td></tr>
                        ) : list === null ? (
                            <tr><td colSpan={3}>불러오는 중...</td></tr>
                        ) : list.length === 0 ? (
                            <tr><td colSpan={3}>등록된 공지가 없어요.</td></tr>
                        ) : (
                            list.map((n) => (
                                // Fragment: 한 공지 = 제목 줄 + (펼쳤을 때) 내용 줄
                                <Fragment key={n.id}>
                                    <tr className={n.pinned ? "is-pinned" : ""}>
                                        <td>
                                            {n.pinned
                                                ? <span className="notice-board-pin">공지</span>
                                                : normal.length - normal.indexOf(n)}
                                        </td>
                                        <td className="notice-board-title">
                                            <button type="button" onClick={() => setOpenId(openId === n.id ? null : n.id)}>{n.title}</button>
                                        </td>
                                        <td>{formatDate(n.createdAt)}</td>
                                    </tr>
                                    {openId === n.id && (
                                        <tr className="notice-board-detail">
                                            <td colSpan={3}>{n.content}</td>
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

export default Notice