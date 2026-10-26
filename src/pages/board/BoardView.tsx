import SubVisual from '../../components/common/SubVisual'
import '../../css/pages/board/BoardView.css'

function BoardView() {

    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            <div className='board-view'>
                <div className='board-view-header'> {/*위쪽 각 정보별 백엔드받기*/}
                    <label>후기</label>     {/*분류칸*/}
                    <h2>한정판 과테말라 안티구아 마셔본 후기</h2>   {/*제목 */}
                    <span>작성자.작성일.조회수.좋아요</span> 
                </div>
                <div className='main'>  {/* 메인 사진이랑 글*/}
                    <div className='view-main-1'>사진1</div> {/*사진들 없으면 숨기게 수정*/}
                    <div className='view-main-2'>사진2</div>
                    <div className='view-main-3'>사진3</div>
                    <p>산미가 은은하고 끝맛이 깔끔해요.</p> {/*본문 */}
                    <button className='Like-btn'>
                        <span className='Like-icon'>♡</span>
                        <span>좋아요</span>
                        <span className='Like-count'>1</span>
                    </button>
                </div>
                <div className='coment'>    {/*댓글창, 로그인 하면 (목록,수정,삭제)칸 보이게 */}                    
                    <div className='coment-btn'>  {/* 목록은 자기글이 아닐때는 중앙에, 자기글이면 아래버튼과 정렬 되어 왼쪽으로 보이게 */}
                        <button>목록</button>
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