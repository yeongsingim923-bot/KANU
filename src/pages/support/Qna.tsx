import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/support/Qna.css"

function Qna() {

    return (
        <>
            <SubVisual label="1:1 문의" title="Contact Us" desc="궁금한 점을 남겨주시면 빠르게 답변드릴게요" />

            <Lnb
                items={[
                    { title: "공지사항", to: "/notice" },
                    { title: "1:1 문의", to: "/qna" },
                ]}
            />
            <div className="qna">
                <div className="notice">
                    <span>문의 전 확인해주세요</span>
                    <ul>
                        <li>답변은 평일 9~17시에 순서대로 드립니다.</li>
                        <li>머신 · 캡슐 080-025-9114 / 스틱 · 원두 080-023-9114</li>
                    </ul>
                </div>
                <label>
                    <span>문의 유형</span>
                    <input placeholder="선택해주세요" />
                </label>
                <div className="qna-row">
                    <label>
                        <span>성함</span>
                        <input />
                    </label>
                    <label>
                        <span>연락처</span>
                        <input placeholder="010-0000-0000" />
                    </label>
                </div>
                <label>
                    <span>이메일</span>
                    <input placeholder="you@example.com" />
                </label>
                <label>
                    <span>제목</span>
                    <input />
                </label>
                <label>
                    <span>내용</span>
                    <textarea placeholder="문의 내용을 자세히 적어주세요" />
                </label>
                <div className="photo-field">
                    <span>사진첨부</span>
                    <div className="picture">
                        <button type="button">파일첨부</button>
                        <span>최대 3장 · jpg, png</span>
                    </div>
                </div>
                <label className="check">
                    <input type="checkbox"/>
                    <span>개인정보 수집 · 이용에 동의합니다. (필수)</span>
                </label>
                <div className="under-bar">
                    <button>취소</button>
                    <button>문의등록</button>
                </div>
            </div>
        </>
    )
}

export default Qna