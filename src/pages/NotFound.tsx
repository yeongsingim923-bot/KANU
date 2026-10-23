import { Link, useNavigate } from "react-router-dom"
import "../css/NotFound.css"

function NotFound() {
    
    const navigate = useNavigate()

    return(
        <section className="not-found">
            <p className="not-found-label">ERROR 404</p>          

            <div className="not-found-number">
                <span>4</span>
                <div className="not-found-cup">
                    <img src="/images/coffee-americano.png" alt="" />
                </div>
                <span>4</span>
                <span className="not-found-dot">.</span>    
            </div>

            <h2 className="not-found-title">찾으시는 페이지가 없습니다</h2>
            <p className="not-found-desc">
                주소가 잘못 입력 되었거나, 페이지가 이동 또는 삭제 되었을 수 있어요
            </p>

            <div className="not-found-btns">
                <button 
                    type="button" 
                    className="
                    not-found-btn btn-back" 
                    onClick={() => navigate(-1)}
                >
                    이전 페이지로 가기
                </button>

                <Link to="/" className="not-found-btn btn-home">
                    홈화면으로 바로가기
                </Link>
            </div>
        </section>
    )
}

export default NotFound