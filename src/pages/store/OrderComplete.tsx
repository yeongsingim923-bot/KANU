import { Link } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/store/OrderComplete.css"

function OrderComplete() {

    return(
        <>
            <SubVisual label="주문 완료" title="Thank You" desc="주문해주셔서 감사합니다" />

            <section className="complete">
                <h3 className="complete-title">주문이 완료되었어요</h3>
                <p className="complete-num">주문번호 20261016-0024</p>

                <dl className="complete-table">
                    <div>
                        <dt>주문 상품</dt>
                        <dd>카누 라떼 (50T) 외 1건</dd>
                    </div>
                    <div>
                        <dt>받는 분</dt>
                        <dd>김카누 · 010-1234-5678</dd>
                    </div>
                    <div>
                        <dt>배송지</dt>
                        <dd>서울특별시 OO구 OO로 00</dd>
                    </div>
                    <div>
                        <dt>결제 수단</dt>
                        <dd>신용카드 (일시불)</dd>
                    </div>
                    <div>
                        <dt>총 결제 금액</dt>
                        <dd>32,600원</dd>
                    </div>
                </dl>

                <div className="complete-btns">
                    <Link to="/mypage" className="complete-history">주문 내역 보기</Link>
                    <Link to="/store" className="complete-shop">쇼핑 계속하기</Link>
                </div>
            </section>
        </>
    )
}

export default OrderComplete