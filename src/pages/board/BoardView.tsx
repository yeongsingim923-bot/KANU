import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SubVisual from '../../components/common/SubVisual'
import { useAuthStore } from '../../store/authStore'
import '../../css/pages/board/BoardView.css'

type Post = {
    id: number
    category: string
    title: string
    content: string
    author: string
    images: string | string[] | null   // 서버에서 '["/uploads/a.jpg"]' 같은 JSON 문자열로 옴
    views: number                      // 조회수
    created_at: string
    prev: NearPost | null              // 이전글 (먼저 쓴 글, 없으면 null)
    next: NearPost | null              // 다음글 (나중에 쓴 글, 없으면 null)
    likeCount: number                  // 좋아요 수
    liked: boolean                     // 내가 눌렀는지 (로그인 안 했으면 false)
}

// 댓글 한 개
type Comment = {
    id: number
    content: string
    author: string
    created_at: string
}

// 이전글/다음글 한 줄
type NearPost = {
    id: number
    title: string
    created_at: string
}

// 이번에 조회수를 올린 글 번호 (React 개발 모드가 화면 코드를 두 번 실행해도 한 번만 올리게)
const viewedIds = new Set<string>()

function BoardView() {
    const { id } = useParams()              // 주소 /board/5 → id = "5"
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)               // 로그인한 사람 (본인 글이면 수정/삭제 버튼)
    const [post, setPost] = useState<Post | null>(null)   // 불러온 글 (불러오기 전엔 null)
    const [error, setError] = useState('')                // 없는 글 등 오류 메시지
    const [comments, setComments] = useState<Comment[]>([])   // 댓글 목록
    const [commentText, setCommentText] = useState('')        // 쓰는 중인 댓글
    useEffect(() => {
        window.scrollTo(0, 0)   // 이전글/다음글로 넘어가면 맨 위부터 보이게
        const load = async () => {
            // 이 글을 처음 열 때만 조회수 +1 → 그 다음 글 불러오기 (올라간 조회수로 보이게)
            if (id && !viewedIds.has(id)) {
                viewedIds.add(id)
                await fetch(`/api/community/${id}/view`, { method: 'POST' })
            }
            const res = await fetch('/api/community/' + id)
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setPost(data)
            else setError(data.message)

            // 댓글 목록
            const cRes = await fetch(`/api/community/${id}/comments`)
            if (cRes.ok) setComments(await cRes.json())
        }
        load()
    }, [id])

    // 댓글 다시 불러오기 (쓰거나 지운 뒤)
    const reloadComments = async () => {
        const res = await fetch(`/api/community/${id}/comments`)
        if (res.ok) setComments(await res.json())
    }

    // 좋아요 누르기/취소 (로그인 안 했으면 로그인 화면으로 → 로그인 후 이 글로 돌아옴)
    const handleLike = async () => {
        if (!user) {
            alert('로그인 후 좋아요를 누를 수 있어요.')
            return navigate('/login', { state: { from: `/board/${id}` } })
        }
        const res = await fetch(`/api/community/${id}/like`, { method: 'POST' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setPost((prev) => prev && { ...prev, liked: data.liked, likeCount: data.likeCount })   // 서버가 알려준 상태로 바꾸기
    }

    // 댓글 등록
    const handleComment = async () => {
        const res = await fetch(`/api/community/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: commentText }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setCommentText('')
        reloadComments()
    }

    // 댓글 삭제 (본인 댓글만 버튼이 보임)
    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('댓글을 삭제할까요?')) return
        const res = await fetch('/api/comments/' + commentId, { method: 'DELETE' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        reloadComments()
    }

    // 삭제: 확인창 → 서버에서 삭제 → 목록으로
    const handleDelete = async () => {
        if (!confirm('글을 삭제할까요? 삭제한 글은 되돌릴 수 없어요.')) return
        const res = await fetch('/api/community/' + id, { method: 'DELETE' })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        alert('글이 삭제되었습니다')
        navigate('/board', { replace: true })
    }

    if (error) return (     // 없는 글 / 서버 오류
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
                        <div className='board-view board-view-error'>
                            <p className='board-view-error-msg'>{error}</p>
                            <button type="button" className='board-view-error-btn' onClick={() => navigate('/board')}>목록</button>
                        </div>
        </>
    )
    if (!post) return null      // 불러오는 중
    const images: string[] = typeof post.images === 'string' ? JSON.parse(post.images) : (post.images ?? [])        // 사진 주소 배열로 바꾸기 (사진 없으면 빈 배열)
    const isMine = user?.username === post.author   // 본인 글인지
    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            <div className='board-view'>
                <div className='board-view-header'> {/*위쪽 각 정보별 백엔드받기*/}
                    <label>{post.category}</label>     {/*분류칸*/}
                    <h2>{post.title}</h2>   {/*제목 */}
                    <span>{post.author} · {post.created_at.slice(0, 10).replaceAll('-', '.')} · 조회 {post.views}</span>
                </div>
                <div className='main'>  {/* 메인 사진이랑 글*/}
                    {images.map((src, i) => (   /* 사진: 있는 만큼만 출력 (없으면 아무것도 안 나옴) */
                        <div className={'view-main-' + (i + 1)} key={src}>
                            <img src={src} alt={`첨부 사진 ${i + 1}`} />
                        </div>
                    ))}
                    <p>{post.content}</p> {/*본문 */}
                    <button type="button" className={post.liked ? 'Like-btn is-liked' : 'Like-btn'} onClick={handleLike}>
                        <span className='Like-icon'>{post.liked ? '♥' : '♡'}</span>
                        <span>좋아요</span>
                        <span className='Like-count'>{post.likeCount}</span>
                    </button>
                </div>
                <div className='coment'>    {/*댓글창, 로그인 하면 (목록,수정,삭제)칸 보이게 */}                    
                    <div className='coment-btn'>  {/* 목록은 자기글이 아닐때는 중앙에, 자기글이면 아래버튼과 정렬 되어 왼쪽으로 보이게 */}
                        <button type="button" onClick={() => navigate('/board')}>목록</button>
                        {isMine && (
                            <div className='loginUser-control'>  {/*자기 글일때만 보이게, 글 수정칸 */}
                                <button type="button" onClick={() => navigate(`/board/edit/${id}`)}>수정</button>
                                <button type="button" onClick={handleDelete}>삭제</button>
                            </div>
                        )}
                    </div> 
                                        <span>댓글 {comments.length}</span>
                    {user ? (
                        <div className='coment-add'>       {/*댓글등록칸: 로그인했을 때만*/}
                            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={500} placeholder="댓글을 입력해주세요 (500자까지)"></textarea>
                            <button type="button" onClick={handleComment} disabled={!commentText.trim()}>등록</button>
                        </div>
                    ) : (
                        <p className='coment-login'>댓글을 남기려면 <Link to="/login" state={{ from: `/board/${id}` }}>로그인</Link>해주세요.</p>
                    )}
                    <ul className='coment-list'>       {/*댓글 목록: 먼저 쓴 댓글부터*/}
                        {comments.length === 0 ? (
                            <li className='coment-empty'>첫 댓글을 남겨보세요.</li>
                        ) : (
                            comments.map((c) => (
                                <li key={c.id}>
                                    <div>
                                        <span>{c.author}</span>
                                        <span>{c.created_at.slice(0, 16).replaceAll('-', '.')}</span>
                                        {user?.username === c.author && (
                                            <button type="button" onClick={() => handleDeleteComment(c.id)}>삭제</button>
                                        )}
                                    </div>
                                    <p>{c.content}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className='board-list'>    {/* 다음글(나중에 쓴 글) / 이전글(먼저 쓴 글) */}
                    <div className='board-list-next'>
                        <span>다음글</span>
                        <button type="button" disabled={!post.next} onClick={() => post.next && navigate(`/board/${post.next.id}`)}>
                            {post.next ? post.next.title : '다음글이 없습니다'}
                        </button>
                        <span>{post.next ? post.next.created_at.slice(0, 10).replaceAll('-', '.') : ''}</span>
                    </div>
                    <div className='board-list-prev'>
                        <span>이전글</span>
                        <button type="button" disabled={!post.prev} onClick={() => post.prev && navigate(`/board/${post.prev.id}`)}>
                            {post.prev ? post.prev.title : '이전글이 없습니다'}
                        </button>
                        <span>{post.prev ? post.prev.created_at.slice(0, 10).replaceAll('-', '.') : ''}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardView