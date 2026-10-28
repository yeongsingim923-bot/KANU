import { Link } from "react-router-dom"
import "../../css/pages/store/Store.css"            // 제품 카드 모양 같아 쓸려고
import "../../css/pages/search/SearchEmpty.css"

type SearchEmptyProps = {
    keyword: string;   // 사용자가 검색한 단어 → "'OOO' 검색 결과가 없어요"에 표시
    onTagClick?: (word: string) => void;   // 추천 태그를 눌렀을 때 (그 단어로 검색)
};

function SearchEmpty({ keyword, onTagClick }: SearchEmptyProps) {
    return (
        <div className="search-empty">
            {/* ===== 결과 없음 안내 ===== */}
            <div className="search-empty-box">
                <svg className="search-empty-icon" viewBox="0 0 92 92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                    <circle cx="38" cy="38" r="33" />
                    <path d="M28 28 48 48M48 28 28 48" />
                    <path d="M62 62 87 87" />
                </svg>
                <p className="search-empty-title">‘{keyword}’ 검색 결과가 없어요</p>
                <p className="search-empty-desc">검색어의 철자를 확인하거나, 이런 검색어로 찾아보세요.</p>

                <ul className="search-empty-tags">
                    {["아메리카노", "라떼", "캡슐", "디카페인"].map((tag) => (
                        <li key={tag}><button type="button" onClick={() => onTagClick?.(tag)}>{tag}</button></li>
                    ))}
                </ul>
            </div>

            {/* ===== 추천 제품 (스토어 카드 모양) ===== */}
            <section className="search-reco">
                <p className="search-reco-eng">RECOMMEND</p>
                <h3 className="search-reco-title">이런 제품은 어떠세요?</h3>

                <ul className="store-list">
                    <li className="store-card">
                        <Link to="/store/stick-mild">
                            <div className="store-card-img">
                                <img src="/images/store/stick-mild.png" alt="카누 미니 마일드 로스트 아메리카노" />
                            </div>
                            <p className="store-card-name">카누 미니 마일드 로스트 아메리카노<br />(100T)</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">5%</span>
                            <strong>25,400원</strong>
                            <del>26,700원</del>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/stick-signature">
                            <div className="store-card-img">
                                <img src="/images/store/stick-signature.png" alt="카누 미니 시그니처 미디엄 로스트" />
                            </div>
                            <p className="store-card-name">카누 미니 시그니처 미디엄 로스트<br />(60T)</p>
                        </Link>
                        <p className="store-card-price">
                            <strong>20,900원</strong>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/stick-decaf">
                            <div className="store-card-img">
                                <img src="/images/store/stick-decaf.png" alt="카누 미니 디카페인 아메리카노" />
                            </div>
                            <p className="store-card-name">카누 미니 디카페인 아메리카노<br />(100T+20T)</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">10%</span>
                            <strong>26,500원</strong>
                            <del>29,400원</del>
                        </p>
                    </li>
                    <li className="store-card">
                        <Link to="/store/stick-latte">
                            <div className="store-card-img">
                                <img src="/images/store/stick-latte.png" alt="카누 라떼" />
                            </div>
                            <p className="store-card-name">카누 라떼<br />(50T)</p>
                        </Link>
                        <p className="store-card-price">
                            <span className="store-card-rate">9%</span>
                            <strong>24,200원</strong>
                            <del>26,700원</del>
                        </p>
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default SearchEmpty