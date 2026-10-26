import { Link } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import "../../css/pages/store/Detail.css"

function Detail() {

    return(
        <>
            <section className="detail-top">
                <div className="detail-img">
                    <img src="/images/store/detail-caring-star.png" alt="케어링 스타 디카페인" />
                </div>
                
                <div className="detail-info">
                    <span className="detail-chip">캡슐 커피</span>
                    <h2 className="detail-name">케어링 스타 디카페인</h2>
                    <p className="detail-sub">카누 바리스타 전용캡슐 (10캡슐)</p>

                    <p className="detail-price">
                        <span className="detail-rate">11%</span>
                        <strong>8,400원</strong>
                        <del>9,400원</del>
                    </p>

                    <div className="detail-option">
                        <p className="detail-strength">
                            강도 <span className="detail-strength-bar"></span>
                        </p>
                        <ul className="detail-tags">
                            <li>#디카페인</li>
                            <li>#부드러운</li>
                        </ul>
                    </div>

                    <div className="detail-total">
                        <div className="detail-qty">
                            <button type="button">-</button>
                            <span>1</span>
                            <button type="button">+</button>
                        </div>
                        <p className="detail-sum">
                            총 금액 <strong>8,400원</strong>
                        </p>
                    </div>

                    <div className="detail-btns">
                        <button type="button" className="detail-cart">장바구니 담기</button>
                        <button type="button" className="detail-buy">바로 구매</button>
                    </div>
                </div>                
            </section>

            <div className="detail-tabs">
                <Lnb
                    items={[
                        { title: "상품 정보", to: "#detail-info" },
                        { title: "맛 & 특징", to: "#detail-taste" },
                    ]}
                    active="#detail-info"
                />
            </div>

            <section className="detail-banner" id="detail-info">
                <div className="detail-banner-text">
                    <p className="detail-banner-eng">KANU CAPSULE</p>
                    <h3 className="detail-banner-title">
                        A Garden<br />
                        In Your Cup<span className="detail-banner-dot">.</span>
                    </h3>
                    <p className="detail-banner-desc">별이 뜨는 밤에도 편안하게 즐기는 디카페인 캡슐</p>
                </div>
                <div className="detail-banner-img">
                    <img src="/images/store/banner-capsule.jpg" alt="" />
                </div>
            </section>

            <section className="detail-taste" id="detail-taste">
                <h3 className="detail-title">맛 &amp; 특징</h3>

                <ul className="detail-taste-list">
                    <li>
                        <p className="detail-taste-label">산미</p>
                        <ol className="detail-dots">
                            <li className="is-on"></li>
                            <li className="is-on"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ol>
                    </li>
                    <li>
                        <p className="detail-taste-label">바디감</p>
                        <ol className="detail-dots">
                            <li className="is-on"></li>
                            <li className="is-on"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ol>
                    </li>
                    <li>
                        <p className="detail-taste-label">쓴맛</p>
                        <ol className="detail-dots">
                            <li className="is-on"></li>
                            <li className="is-on"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ol>
                    </li>
                    <li>
                        <p className="detail-taste-label">단맛</p>
                        <ol className="detail-dots">
                            <li className="is-on"></li>
                            <li className="is-on"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ol>
                    </li>
                </ul>

                <dl className="detail-spec">
                    <div>
                        <dt>원산지</dt>
                        <dd>콜롬비아</dd>
                    </div>
                    <div>
                        <dt>로스팅</dt>
                        <dd>미디엄 로스트</dd>
                    </div>
                    <div>
                        <dt>추천 추출량</dt>
                        <dd>40ml</dd>
                    </div>
                    <div>
                        <dt>구성</dt>
                        <dd>10캡슐</dd>
                    </div>
                </dl>
            </section>

            <section className="detail-related">
                <h3 className="detail-title">함께 보면 좋은 카누</h3>

                <ul className="store-list">
                    <li className="store-card">
                        <Link to="/store/stick-latte">
                            <div className="store-card-img">
                                <img src="/images/store/stick-latte.png" alt="카누 라떼" />
                            </div>
                            <p className="store-card-name">카누 라떼<br />(50T)</p>
                            <p className="store-card-desc">부드러운 우유와 진한 커피의 조화</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">9%</span>
                            <strong>24,200원</strong>
                            <del>26,700원</del>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/stick-chocolat">
                            <div className="store-card-img">
                                <img src="/images/store/stick-chocolat.png" alt="카누 에스프레소 쇼콜라 라떼" />
                            </div>
                            <p className="store-card-name">카누 에스프레소 쇼콜라 라떼<br />(24T)</p>
                            <p className="store-card-desc">진한 에스프레소에 달콤한 초콜릿 한 스푼</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">10%</span>
                            <strong>12,900원</strong>
                            <del>14,400원</del>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/machine-oasis">
                            <div className="store-card-img">
                                <img src="/images/store/machine-oasis.png" alt="카누 바리스타 오아시스" />
                            </div>
                            <p className="store-card-name">카누 바리스타 오아시스</p>
                            <p className="store-card-desc">버튼 하나로 만나는 바리스타의 한 잔</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">20%</span>
                            <strong>399,000원</strong>
                            <del>499,000원</del>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/capsule-bright-garden">
                            <div className="store-card-img">
                                <img src="/images/store/capsule-bright-garden.png" alt="브라이트 가든" />
                            </div>
                            <p className="store-card-name">브라이트 가든 | 카누 바리스타 전용캡슐<br />(10캡슐)</p>
                            <p className="store-card-desc">꽃처럼 화사하고 산뜻한 한 잔</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">11%</span>
                            <strong>8,400원</strong>
                            <del>9,400원</del>
                        </p>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default Detail