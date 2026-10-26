import { Link } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/store/Cart.css"

function Cart() {

    return(
        <>
            <SubVisual label="장바구니" title="My Cart" desc="담아둔 상품을 확인하고 주문하세요" />

            <div className="cart-inner">
                <section className="cart-main">
                    <div className="cart-toolbar">
                        <label className="cart-check-all">
                            <input type="checkbox" className="cart-check" />
                            전체 선택 (2/2)
                        </label>
                        <button type="button" className="cart-delete">선택 삭제</button>
                    </div>

                    <ul className="cart-list">
                        <li className="cart-item">
                            <input type="checkbox" className="cart-check" />
                            <div className="cart-item-img">
                                <img src="/images/store/stick-latte.png" alt="카누 라떼" />
                            </div>
                            <div className="cart-item-info">
                                <p className="cart-item-name">카누 라떼 (50T)</p>
                                <p className="cart-item-count">1개</p>
                                <p className="cart-item-price">24,200원</p>
                            </div>
                            <div className="cart-qty">
                                <button type="button">-</button>
                                <span>1</span>
                                <button type="button">+</button>
                            </div>
                            <button type="button" className="cart-remove">X</button>
                        </li>
                        <li className="cart-item">
                            <input type="checkbox" className="cart-check" />
                            <div className="cart-item-img">
                                <img src="/images/store/capsule-caring-star.png" alt="케어링 스타 디카페인" />
                            </div>
                            <div className="cart-item-info">
                                <p className="cart-item-name">케어링 스타 디카페인 (10캡슐)</p>
                                <p className="cart-item-count">1개</p>
                                <p className="cart-item-price">8,400원</p>
                            </div>
                            <div className="cart-qty">
                                <button type="button">-</button>
                                <span>1</span>
                                <button type="button">+</button>
                            </div>
                            <button type="button" className="cart-remove">X</button>
                        </li>
                    </ul>
                </section>

                <aside className="cart-summary">
                    <h3 className="cart-summary-title">결제 예상 금액</h3>
                    <dl className="cart-summary-list">
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
                    </dl>
                    <div className="cart-summary-total">
                        <p>최종 결제 금액</p>
                        <strong>32,600원</strong>
                    </div>
                    <Link to="/checkout" className="cart-order">주문 하기</Link>
                    <Link to="/store" className="cart-continue">쇼핑 계속하기</Link>
                </aside>
            </div>
        </>
    )
}

export default Cart