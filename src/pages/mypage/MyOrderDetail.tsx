import { Link } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/mypage/MyOrder.css"        // 주문 단계 박스 같이 쓰기
import "../../css/pages/mypage/MyOrderDetail.css"

// 디자인용 화면 (데이터 연결은 나중에)
function MyOrderDetail() {

    return(
        <>
            <SubVisual label="마이페이지" title="My Page" desc="주문과 활동 내역을 한눈에 확인하세요" />

            <div className="order-inner">
                {/* ===== 제목 ===== */}
                <div className="order-head">
                    <div>
                        <h3 className="order-title">주문상세</h3>
                        <p className="order-date">2026.10.16 · 20261016-0024</p>
                    </div>
                    <Link to="/mypage" className="order-back">목록으로</Link>
                </div>

                {/* ===== 주문 단계 (마이페이지 홈이랑 같은 박스) ===== */}
                <ol className="my-steps order-steps">
                    <li className="is-on"><strong>1</strong>결제 완료</li>
                    <li><strong>0</strong>배송 준비</li>
                    <li><strong>0</strong>배송 중</li>
                    <li><strong>0</strong>배송 완료</li>
                </ol>

                {/* ===== 주문 상품 ===== */}
                <section className="order-products">
                    <div className="order-section-head">
                        <h4 className="order-section-title">주문 상품 2개</h4>
                        <button type="button" className="order-track">배송 조회</button>
                    </div>

                    <ul className="order-list">
                        <li className="order-item">
                            <div className="order-item-img">
                                <img src="/images/store/stick-latte.png" alt="카누 라떼" />
                            </div>
                            <div className="order-item-info">
                                <p className="order-item-name">카누 라떼 (50T)</p>
                                <p className="order-item-count">1개</p>
                            </div>
                            <p className="order-item-price">24,200원</p>
                        </li>
                        <li className="order-item">
                            <div className="order-item-img">
                                <img src="/images/store/capsule-caring-star.png" alt="케어링 스타 디카페인" />
                            </div>
                            <div className="order-item-info">
                                <p className="order-item-name">케어링 스타 디카페인 (10캡슐)</p>
                                <p className="order-item-count">1개</p>
                            </div>
                            <p className="order-item-price">8,400원</p>
                        </li>
                    </ul>
                </section>

                {/* ===== 배송지 + 결제정보 ===== */}
                <div className="order-bottom">
                    <section className="order-box">
                        <h4 className="order-section-title">배송지</h4>
                        <div className="order-address">
                            <p className="order-address-name">김카누</p>
                            <p>010-1234-5678</p>
                            <p>서울특별시 OO구 OO로 00 (101동 101호)</p>
                            <p className="order-address-memo">문 앞에 놓아주세요</p>
                        </div>
                    </section>

                    <section className="order-box">
                        <h4 className="order-section-title">결제정보</h4>
                        <dl className="order-pay">
                            <div>
                                <dt>상품 합계</dt>
                                <dd>36,100원</dd>
                            </div>
                            <div>
                                <dt>할인 금액</dt>
                                <dd>-3,500원</dd>
                            </div>
                            <div>
                                <dt>배송비</dt>
                                <dd>0원</dd>
                            </div>
                            <div>
                                <dt>결제 수단</dt>
                                <dd>신용카드 (일시불)</dd>
                            </div>
                            <div>
                                <dt>총 결제 금액</dt>
                                <dd className="order-pay-total">32,600원</dd>
                            </div>
                        </dl>
                    </section>
                </div>
                
                <div className="order-btns">
                    <Link to="/qna" className="order-qna">문의하기</Link>
                    <Link to="/mypage" className="order-list-btn">주문내역으로</Link>
                </div>
            </div>
        </>
    )
}

export default MyOrderDetail