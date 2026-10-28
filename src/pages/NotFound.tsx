import { Link, useNavigate } from "react-router-dom"
import "../css/NotFound.css"

// 오류 화면 (404 디자인을 같이 씀)
// 아무것도 안 넘기면 지금처럼 404 화면, 넘기면 그 내용으로 (예: 서버 오류 503)
type NotFoundProps = {
    code?: string       // 세 자리 숫자: 가운데 자리는 커피잔으로 (예: "404", "503")
    title?: string
    desc?: string
    retry?: boolean     // true면 왼쪽 버튼이 '이전 페이지로 가기' 대신 '다시 시도'(새로고침)
}

function NotFound({
    code = "404",
    title = "찾으시는 페이지가 없습니다",
    desc = "주소가 잘못 입력 되었거나, 페이지가 이동 또는 삭제 되었을 수 있어요",
    retry = false,
}: NotFoundProps) {

    const navigate = useNavigate()

    return(
        <section className="not-found">
            <p className="not-found-label">ERROR 404</p>          

            <div className="not-found-number">
                <span>{code[0]}</span>
                <div className="not-found-cup">
                    <img src="/images/coffee-americano.png" alt="" />
                </div>
                <span>{code[2]}</span>
                <span className="not-found-dot">.</span>    
            </div>

            <h2 className="not-found-title">찾으시는 페이지가 없습니다</h2>
            <h2 className="not-found-title">{title}</h2>
            <p className="not-found-desc">{desc}</p>

            <div className="not-found-btns">
                <button
                    type="button"
                    className="not-found-btn btn-back"
                    onClick={() => (retry ? window.location.reload() : navigate(-1))}
                >
                    {retry ? "다시 시도" : "이전 페이지로 가기"}
                </button>

                <Link to="/" className="not-found-btn btn-home">
                    홈화면으로 바로가기
                </Link>
            </div>
        </section>
    )
}

export default NotFound