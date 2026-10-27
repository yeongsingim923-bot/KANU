import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyPosts.css"
import { useNavigate } from "react-router-dom"

function MyPosts() {
    const navigate = useNavigate()

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
                            <th>제목</th>
                            <th>등록일자</th>
                            <th>조회수</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                <tbody id="list"></tbody> 
                </table>
            </div>
        </>
    )
}

export default MyPosts