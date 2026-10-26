import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyInfo.css"

function MyInfo() {

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
            <div className="mypage-info">
                <div>
                    <h1>회원정보 수정</h1>
                    <span>정보를 바꾼 뒤 저장하기를 눌러주세요.</span>
                </div>
                <form className="main">
                    <div className="basic">
                        <p>기본정보</p>
                        <label>
                            <span>아이디</span>
                            <input placeholder="고객님의 아이디" readOnly />
                        </label>
                        <div className="field-row">
                            <label>
                                <span>성명</span>
                                <input/>
                            </label>
                            <label>
                                <span>생년월일</span>
                                <input placeholder="00.00.00"/>
                            </label>
                        </div>
                        <label>
                            <span>휴대폰 번호</span>
                            <input type="tel" placeholder="00.00.00"/>
                        </label>
                        <label>
                            <span>이메일</span>
                            <input type="email" placeholder="you@example.com"/>
                        </label>
                    </div>
                    <div className="pw-change">
                        <p>비밀번호 변경</p>
                        <label>
                            <span>현재 비밀번호</span>
                            <input type="password"/>
                        </label>
                        <div className="field-row">
                            <label>
                                <span>새 비밀번호</span>
                                <input type="password"/>
                            </label>
                            <label>
                                <span>비밀번호 확인</span>
                                <input type="password"/>
                            </label>
                        </div>
                    </div>
                    <div className="marketing">
                        <p>마케팅 정보 수신</p>
                        <div>
                            <label>
                                <input type="checkbox"/>
                                <span>이메일 수신</span>
                            </label>
                            <label>
                                <input type="checkbox"/>
                                <span>SMS 수신</span>
                            </label>
                        </div>
                    </div>
                    <div className="btn">
                        <button type="button">취소</button>
                        <button type="button">저장하기</button>
                    </div>
                </form>
                <button type="button">회원탈퇴</button>
            </div>
        </>
    )
}

export default MyInfo