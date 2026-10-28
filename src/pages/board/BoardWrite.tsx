import { useEffect, useState } from 'react'
import SubVisual from '../../components/common/SubVisual'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import PhotoPicker from '../../components/common/PhotoPicker'
import type { Photo } from '../../components/common/PhotoPicker'
import '../../css/pages/board/BoardWrite.css'

// 수정할 글 (GET /api/community/:id 응답 중 쓰는 것만)
type EditPost = {
    category: string
    title: string
    content: string
    author: string
    images: string | null     // 기존 사진 (JSON 글자)
}

function BoardWrite() {
    const { id } = useParams()       // 수정: /board/edit/5 → id = "5" / 새 글(/board/write): 없음
    const isEdit = Boolean(id)
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)
    const [post, setPost] = useState<EditPost | null>(null)   // 수정할 글 (불러오기 전엔 null)
    const [photos, setPhotos] = useState<Photo[]>([])         // 새로 고른 사진

    // 수정 모드: 기존 글 불러오기
    useEffect(() => {
        if (!id) return
        const load = async () => {
            const res = await fetch('/api/community/' + id)
            const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
            if (res.ok) setPost(data)
            else {
                alert(data.message)
                navigate('/board', { replace: true })
            }
        }
        load()
    }, [id, navigate])

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();  // 페이지 새로고침 막기
        const formData = new FormData(e.currentTarget)
        photos.forEach((p) => formData.append('photos', p.file))   // 고른 사진을 'photos'라는 이름으로 붙이기 (서버 multer와 같은 이름)
        // 새 글: POST /api/community / 수정: PUT /api/community/5
        const res = await fetch(isEdit ? '/api/community/' + id : '/api/community', {
            method: isEdit ? 'PUT' : 'POST',
            body: formData,
        });
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }));
        if (res.ok) {
            alert(isEdit ? '글이 수정되었습니다' : '글이 등록되었습니다');
            navigate(isEdit ? `/board/${id}` : '/board')  // 수정 후에는 그 글로, 새 글은 목록으로
        } else {
            alert(data.message);
        }
    };

    // 로그인 확인 중이면 잠깐 비워 두고, 로그인 안 했으면 로그인 페이지로 이동
    // (반드시 모든 Hook 아래에 있어야 함)
    if (loading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: isEdit ? `/board/edit/${id}` : '/board/write' }} />
    if (isEdit && !post) return null                                                          // 수정할 글 불러오는 중
    if (post && post.author !== user.username) return <Navigate to={`/board/${id}`} replace />   // 남의 글은 수정 불가
    const hasOldPhotos = Boolean(post?.images && post.images !== '[]')   // 수정할 글에 기존 사진이 있는지

    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            {/* 이 페이지 전용 CSS가 다른 페이지에 퍼지지 않도록 .board-write로 감쌈 */}
            <div className="board-write">
                <div className="write-head">
                    <h1>{isEdit ? '글 수정' : '글쓰기'}</h1>
                    <span>카누와 함께한 이야기를 자유롭게 나눠주세요.</span>
                </div>
                <div className="notice">
                    <p>글쓰기 전 확인해주세요</p>
                    <ul>
                        <li>광고, 욕설, 개인정보가 담긴 글은 예고 없이 삭제될 수 있어요</li>
                        <li>제품 고장이나 주문 문의는 1:1 문의를 이용하면 더 빠르게 답변받을 수 있어요.</li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="class-btn">
                        <span>분류</span>
                        {/* radio: 셋 중 하나만 선택되고, 고른 값이 form에 자동으로 담김 (모양은 CSS로 버튼처럼) */}
                        <div className="category">
                            <label><input type="radio" name="category" value="자유" required defaultChecked={post?.category === '자유'} /><span>자유</span></label>
                            <label><input type="radio" name="category" value="질문" defaultChecked={post?.category === '질문'} /><span>질문</span></label>
                            <label><input type="radio" name="category" value="후기" defaultChecked={post?.category === '후기'} /><span>후기</span></label>
                        </div>
                    </div>
                    <label>
                        <span>제목</span>
                        <input type="text" name="title" maxLength={40} required placeholder="제목을 입력하세요 (최대 40자)" defaultValue={post?.title} />
                    </label>
                    <label>
                        <span>내용</span>
                        <textarea name="content" required placeholder="내용을 자세히 적어주세요" defaultValue={post?.content}></textarea>
                    </label>
                    <div className="photo-field">
                        <span>사진첨부</span>
                        <PhotoPicker photos={photos} onChange={setPhotos}
                            note={hasOldPhotos ? '새 사진을 고르면 기존 사진은 지워지고 새 사진으로 바뀌어요. 고르지 않으면 그대로 유지돼요.' : undefined} />
                    </div>
                    <button className="submit-btn">{isEdit ? '수정하기' : '등록하기'}</button>
                </form>
                
            </div>
        </>
    )
    
}

export default BoardWrite
