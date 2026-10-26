import { useLocation, useNavigate } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import "../../css/pages/member/Login.css"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const login = useAuthStore((s) => s.login)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();  // 페이지 새로고침 막기
        const form = new FormData(e.currentTarget)
        // 로그인 요청 + 저장소 갱신은 authStore가 처리 (실패하면 메시지가 돌아옴)
        const error = await login(String(form.get('username') ?? ''), String(form.get('password') ?? ''))
        if (error) alert(error)
        else navigate(location.state?.from ?? '/')
    }

    return (
        <>
            <SubVisual label="로그인" title="Welcome Back" desc="카누 회원으로 더 많은 혜택을 누리세요" />
            <div className="login">
                <form onSubmit={handleSubmit}>
                    <label>
                        <span>아이디</span>
                        <input name="username" placeholder="아이디를 입력하세요" required autoComplete="username" />
                    </label>
                    <label>
                        <span>비밀번호</span>
                        <input name="password" type="password" placeholder="비밀번호를 입력하세요" required autoComplete="current-password"/>
                    </label>
                    <div className="login-under-bar">
                        <label className="check">
                            <input type="checkbox" id="remember"/>
                            <span>자동저장</span>
                        </label>
                        <span>아이디 찾기 | 비밀번호 찾기</span>
                    </div>
                    <button className="login-button">로그인하기</button>
                    <div className="login-new">
                        <span>계정이 없으신가요?</span>
                        <button type="button" onClick={() => navigate('/join')}>회원가입</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login