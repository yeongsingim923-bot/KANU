import SubVisual from '../../components/common/SubVisual'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import '../../css/pages/board/BoardWrite.css'

function BoardWrite() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();  // 페이지 새로고침 막기
        const res = await fetch('/api/community', { method:'POST', body: new FormData(e.currentTarget)});
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }));
        if (res.ok) {
            alert('글이 등록되었습니다');
            navigate('/board')  // 등록 후 목록으로 이동
        } else {
            alert(data.message);
        }
    };

    // 로그인 확인 중이면 잠깐 비워 두고, 로그인 안 했으면 로그인 페이지로 이동
    // (반드시 모든 Hook 아래에 있어야 함)
    if (loading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: '/board/write' }} />

    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            {/* 이 페이지 전용 CSS가 다른 페이지에 퍼지지 않도록 .board-write로 감쌈 */}
            <div className="board-write">
                <div className="write-head">
                    <h1>글쓰기</h1>
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
                            <label><input type="radio" name="category" value="자유" required /><span>자유</span></label>
                            <label><input type="radio" name="category" value="질문" /><span>질문</span></label>
                            <label><input type="radio" name="category" value="후기" /><span>후기</span></label>
                        </div>
                    </div>
                    <label>
                        <span>제목</span>
                        <input type="text" name="title" maxLength={40} required placeholder="제목을 입력하세요 (최대 40자)" />
                    </label>
                    <label>
                        <span>내용</span>
                        <textarea name="content" required placeholder="내용을 자세히 적어주세요"></textarea>
                    </label>
                    <div className="photo-field">
                        <span>사진첨부</span>
                        <div className="picture">
                            <button type="button">파일첨부</button>
                            <span>최대 3장 · jpg, png</span>
                        </div>
                    </div>
                    <button className="submit-btn">등록하기</button>
                </form>
                
            </div>
        </>
    )
    
}

export default BoardWrite
