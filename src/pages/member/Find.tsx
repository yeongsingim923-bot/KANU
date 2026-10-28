import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { formatPhone } from "../../utils/format"
import "../../css/pages/member/Login.css"   // 입력칸/버튼은 로그인 화면 모양을 같이 씀
import "../../css/pages/member/Find.css"

const postJson = (url: string, body: object) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

// ===== 아이디 찾기: 성함 + 휴대폰 → 가린 아이디 =====
function FindId() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [result, setResult] = useState<{ username: string; joinedAt: string } | null>(null)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await postJson("/api/find-id", { name, phone })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setResult(data)
    }

    if (result) return (
        <div className="find-result">
            <p>회원님의 아이디는</p>
            <strong>{result.username}</strong>
            <span>가입일 {result.joinedAt.slice(0, 10).replaceAll("-", ".")}</span>
            <p className="find-hint">보안을 위해 아이디 일부를 가렸어요.</p>
            <Link to="/login" className="login-button">로그인하러 가기</Link>
            <Link to="/find?tab=pw" className="find-link">비밀번호도 잊으셨나요?</Link>
        </div>
    )

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <span>성함</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="가입할 때 입력한 성함" required />
            </label>
            <label>
                <span>휴대폰 번호</span>
                <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-0000-0000" inputMode="numeric" required />
            </label>
            <button className="login-button">아이디 찾기</button>
        </form>
    )
}

// ===== 비밀번호 찾기: 1) 본인 확인 → 2) 새 비밀번호 =====
function FindPassword() {
    const navigate = useNavigate()
    const [verified, setVerified] = useState(false)   // 1단계 통과
    const [form, setForm] = useState({ username: "", name: "", phone: "" })
    const [pw, setPw] = useState({ next: "", check: "" })

    // 1단계: 아이디 + 성함 + 휴대폰 확인
    const handleVerify = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await postJson("/api/find-password/verify", form)
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setVerified(true)
    }

    // 2단계: 새 비밀번호 저장 (10분 안에)
    const handleReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (pw.next.length < 8) return alert("새 비밀번호는 8자리 이상 입력해주세요.")
        if (pw.next !== pw.check) return alert("새 비밀번호가 일치하지 않습니다.")
        const res = await postJson("/api/find-password/reset", { newPassword: pw.next })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) {
            alert(data.message)
            if (res.status === 400 && data.message.includes("시간")) setVerified(false)   // 10분 지남 → 처음부터
            return
        }
        alert("비밀번호가 바뀌었습니다. 새 비밀번호로 로그인해주세요.")
        navigate("/login", { replace: true })
    }

    if (verified) return (
        <form onSubmit={handleReset}>
            <p className="find-step">본인 확인이 끝났어요. <b>10분 안에</b> 새 비밀번호를 정해주세요.</p>
            <label>
                <span>새 비밀번호</span>
                <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder="8자 이상" autoComplete="new-password" required />
            </label>
            <label>
                <span>새 비밀번호 확인</span>
                <input type="password" value={pw.check} onChange={(e) => setPw({ ...pw, check: e.target.value })} autoComplete="new-password" required />
            </label>
            <button className="login-button">비밀번호 바꾸기</button>
        </form>
    )

    return (
        <form onSubmit={handleVerify}>
            <p className="find-step">가입할 때 입력한 정보로 본인 확인을 해주세요.</p>
            <label>
                <span>아이디</span>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required />
            </label>
            <label>
                <span>성함</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
                <span>휴대폰 번호</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} placeholder="010-0000-0000" inputMode="numeric" required />
            </label>
            <button className="login-button">본인 확인</button>
        </form>
    )
}

// 아이디 찾기(/find) · 비밀번호 찾기(/find?tab=pw)
function Find() {
    const [params] = useSearchParams()
    const isPw = params.get("tab") === "pw"

    return (
        <>
            <SubVisual label="아이디 · 비밀번호 찾기" title="Find Account" desc="가입할 때 입력한 정보로 찾을 수 있어요" />
            <Lnb
                items={[
                    { title: "아이디 찾기", to: "/find" },
                    { title: "비밀번호 찾기", to: "/find?tab=pw" },
                ]}
            />
            <div className="login find">
                {isPw ? <FindPassword /> : <FindId />}
            </div>
        </>
    )
}

export default Find
