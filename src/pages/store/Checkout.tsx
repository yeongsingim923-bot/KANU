import { useState } from "react"
import { Link } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/store/Cart.css"       
import "../../css/pages/store/Checkout.css"
import { motion, AnimatePresence } from "motion/react"

const requests = ["문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락 부탁드려요"]

function Checkout() {

    const [open, setOpen] = useState(false)          // 목록 열림/닫힘
    const [request, setRequest] = useState("")       // 고른 요청사항 (처음엔 비어있음)

    return(
        <>
            <SubVisual label="주문서" title="Checkout" desc="주문 정보를 확인하고 결제를 진행해주세요" />

            <div className="cart-inner">
                <section className="cart-main">
                    <div className="checkout-address">
                        <div className="checkout-head">
                            <h3 className="checkout-title">배송지</h3>
                            <button type="button" className="checkout-change">변경</button>
                        </div>

                        <div className="checkout-box">
                            <p className="checkout-name">김카누</p>
                            <p>010-1234-5678</p>
                            <p>서울특별시 OO구 OO로 00 (101동 101호)</p>
                        </div>

                        {/* ===== 배송 요청사항 (직접 만든 선택창) ===== */}
                        <div className={open ? "checkout-request is-open" : "checkout-request"}>
                            <button
                                type="button"
                                className={request ? "checkout-request-btn is-picked" : "checkout-request-btn"}
                                onClick={() => setOpen(!open)}
                            >
                                {request || "배송 요청사항을 선택해주세요"}
                            </button>

                            <AnimatePresence>
                                {open && (
                                    <motion.ul
                                        className="checkout-request-list"
                                        initial={{ opacity: 0, y: -10 }}   // 처음: 투명 + 살짝 위
                                        animate={{ opacity: 1, y: 0 }}     // 열림: 선명 + 제자리
                                        exit={{ opacity: 0, y: -10 }}      // 닫힘: 다시 투명 + 위로
                                        transition={{ duration: 0.25 }}
                                    >
                                        {requests.map((item) => (
                                            <li key={item}>
                                                <button
                                                    type="button"
                                                    className={request === item ? "is-active" : ""}
                                                    onClick={() => { setRequest(item); setOpen(false) }}
                                                >
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <ul className="cart-list checkout-list">
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
                    <Link to="/order-complete" className="cart-order">주문 하기</Link>
                    <Link to="/store" className="cart-continue">쇼핑 계속하기</Link>
                </aside>
            </div>
        </>
    )
}

export default Checkout