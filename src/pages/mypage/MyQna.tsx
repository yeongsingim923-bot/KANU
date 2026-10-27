import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyQna.css"
import { useNavigate } from "react-router-dom"

function MyQna() {
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

export default MyQna