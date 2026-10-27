import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SubVisual from '../../components/common/SubVisual'
import '../../css/pages/board/BoardView.css'

type Post = {
    id: number
    category: string
    title: string
    content: string
    author: string
    images: string | string[] | null   // 서버에서 '["/uploads/a.jpg"]' 같은 JSON 문자열로 옴
    created_at: string
}

function BoardView() {
    const { id } = useParams()              // 주소 /board/5 → id = "5"
    const navigate = useNavigate()
    const [post, setPost] = useState<Post | null>(null)   // 불러온 글 (불러오기 전엔 null)
    const [error, setError] = useState('')                // 없는 글 등 오류 메시지
    useEffect(() => {
        const load = async () => {
            const res = await fetch('/api/community/' + id)
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setPost(data)
            else setError(data.message)
        }
        load()
    }, [id])
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
    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            <div className='board-view'>
                <div className='board-view-header'> {/*위쪽 각 정보별 백엔드받기*/}
                    <label>{post.category}</label>     {/*분류칸*/}
                    <h2>{post.title}</h2>   {/*제목 */}
                    <span>{post.author} · {post.created_at.slice(0, 10).replaceAll('-', '.')}</span>
                </div>
                <div className='main'>  {/* 메인 사진이랑 글*/}
                    {images.map((src, i) => (   /* 사진: 있는 만큼만 출력 (없으면 아무것도 안 나옴) */
                        <div className={'view-main-' + (i + 1)} key={src}>
                            <img src={src} alt={`첨부 사진 ${i + 1}`} />
                        </div>
                    ))}
                    <p>{post.content}</p> {/*본문 */}
                    <button className='Like-btn'>
                        <span className='Like-icon'>♡</span>
                        <span>좋아요</span>
                        <span className='Like-count'>1</span>
                    </button>
                </div>
                <div className='coment'>    {/*댓글창, 로그인 하면 (목록,수정,삭제)칸 보이게 */}                    
                    <div className='coment-btn'>  {/* 목록은 자기글이 아닐때는 중앙에, 자기글이면 아래버튼과 정렬 되어 왼쪽으로 보이게 */}
                        <button type="button" onClick={() => navigate('/board')}>목록</button>
                        <div className='loginUser-control'>  {/*자기 글일때만 보이게, 글 수정칸 */}
                            <button>수정</button>
                            <button>삭제</button>
                        </div>
                    </div> 
                    <span>댓글</span>
                    <div className='coment-add'>       {/*댓글등록칸, 이것도 로그인하면 보이게*/}
                        <textarea></textarea>
                        <button>등록</button>
                    </div>
                    <label>         {/*댓글 칸, 있는 댓글에 따라 높이 달라지게 */} {/*시간남을때 : 내가 쓴글 수정, 삭제버튼, 댓글 여러개인 경우 목록*/}
                        <div>
                            <span>작성자</span>
                            <span>작성일</span>
                        </div>
                        <p>내용</p>
                    </label>
                </div>
                <div className='board-list'>    {/* 게시판 다음글로 가게 링크*/}
                    <div className='board-list-next'>
                        <span>다음글</span>
                        <button>게시판 다음글</button>
                        <span>작성일</span>
                    </div>
                    <div className='board-list-prev'>
                        <span>다음글</span>
                        <button>게시판 다음글</button>
                        <span>작성일</span>
                    </div>
                </div>  
            </div>
        </>
    )
}

export default BoardView