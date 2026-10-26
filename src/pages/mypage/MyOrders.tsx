import { Link } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyOrder.css"

// 디자인용 화면 (데이터 연결은 나중에)
function MyOrders() {

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

            <div className="my-inner">
                {/* ===== 위쪽 카드 3개 ===== */}
                <div className="my-cards">
                    <div className="my-welcome">
                        <p className="my-welcome-eng">WELCOME</p>
                        <p className="my-welcome-name">김카누 님</p>
                        <Link to="/mypage/info" className="my-welcome-btn">회원 정보 수정</Link>
                    </div>
                    <div className="my-card">
                        <p className="my-card-title">사용 가능한 쿠폰</p>
                        <p className="my-card-num"><strong>3</strong>장</p>
                    </div>
                    <div className="my-card">
                        <p className="my-card-title">진행 중인 주문</p>
                        <p className="my-card-num"><strong>1</strong>건</p>
                    </div>
                </div>

                <ol className="my-steps">
                    <li className="is-on"><strong>1</strong>결제 완료</li>
                    <li><strong>0</strong>배송 준비</li>
                    <li><strong>0</strong>배송 중</li>
                    <li><strong>0</strong>배송 완료</li>
                </ol>

                <div className="my-head">
                    <h3 className="my-title">주문내역</h3>
                    <button type="button" className="my-period">1개월</button>
                </div>

                <div className="my-order">
                    <div className="my-order-top">
                        <span>2026.10.16</span>
                        <span>20261016-0024</span>
                        <Link to="/mypage/order/20261016-0024" className="my-order-link">주문 상세 &gt;</Link>
                    </div>
                    <div className="my-order-item">
                        <div className="my-order-img">
                            <img src="/images/store/stick-latte.png" alt="카누 라떼" />
                        </div>
                        <div className="my-order-info">
                            <span className="my-order-status">결제 완료</span>
                            <p className="my-order-name">카누 라떼 (50T) 외 1건</p>
                            <p className="my-order-sub">2개 · 32,600원</p>
                        </div>
                        <button type="button" className="my-order-cancel">주문 취소</button>
                    </div>
                </div>

                <div className="my-pager">
                    <button type="button" className="my-pager-arrow">&lt;</button>
                    <button type="button" className="my-pager-num is-active">1</button>
                    <button type="button" className="my-pager-num">2</button>
                    <button type="button" className="my-pager-num">3</button>
                    <button type="button" className="my-pager-arrow">&gt;</button>
                </div>
            </div>
        </>
    )
}

export default MyOrders