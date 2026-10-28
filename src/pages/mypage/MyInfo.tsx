import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import { formatBirth, formatPhone } from "../../utils/format"
import "../../css/pages/mypage/MyInfo.css"

// 수정할 수 있는 정보 (아이디는 못 바꿈)
type InfoForm = {
    name: string
    birth: string            // 99.01.31
    phone: string            // 010-1234-5678
    email: string
    agreeMarketing: boolean
}
const EMPTY_INFO: InfoForm = { name: "", birth: "", phone: "", email: "", agreeMarketing: false }
const EMPTY_PW = { current: "", next: "", check: "" }

function MyInfo() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)
    const fetchMe = useAuthStore((s) => s.fetchMe)

    const [info, setInfo] = useState<InfoForm>(EMPTY_INFO)          // 입력 중인 값
    const [saved, setSaved] = useState<InfoForm>(EMPTY_INFO)        // 마지막으로 저장된 값 (취소하면 이걸로 되돌림)
    const [pw, setPw] = useState(EMPTY_PW)                          // 비밀번호 변경 칸 3개
    const [showWithdraw, setShowWithdraw] = useState(false)          // 회원탈퇴 칸 열림
    const [withdrawPw, setWithdrawPw] = useState("")

    // 로그인 확인이 끝나면 내 정보 불러오기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const res = await fetch('/api/me/profile')
            if (!res.ok) return
            const me = await res.json()
            const loaded: InfoForm = {
                name: me.name ?? "",
                birth: me.birth ?? "",
                phone: me.phone ?? "",
                email: me.email ?? "",
                agreeMarketing: me.agreeMarketing,
            }
            setInfo(loaded)
            setSaved(loaded)
        }
        load()
    }, [user])

    // 저장하기: 정보 저장 → (비밀번호 칸을 채웠으면) 비밀번호 변경
    const handleSave = async () => {
        // 1) 형식 검사 (서버도 한 번 더 검사함)
        if (!info.name.trim()) return alert("성명을 입력해주세요.")
        if (!/^\d{2}\.\d{2}\.\d{2}$/.test(info.birth)) return alert("생년월일 6자리를 입력해주세요. (예: 99.01.31)")
        if (!/^010-\d{4}-\d{4}$/.test(info.phone)) return alert("휴대폰 번호를 010-0000-0000 형식으로 입력해주세요.")
        if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) return alert("올바른 이메일 형식이 아닙니다.")
        const wantPw = Boolean(pw.current || pw.next || pw.check)   // 비밀번호 칸 중 하나라도 입력했으면 변경
        if (wantPw) {
            if (!pw.current) return alert("현재 비밀번호를 입력해주세요.")
            if (pw.next.length < 8) return alert("새 비밀번호는 8자리 이상 입력해주세요.")
            if (pw.next !== pw.check) return alert("새 비밀번호가 일치하지 않습니다.")
        }

        // 2) 정보 저장
        const res = await fetch('/api/me/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(info),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        setSaved(info)

        // 3) 비밀번호 변경
        if (wantPw) {
            const pwRes = await fetch('/api/me/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
            })
            const pwData = await pwRes.json().catch(() => ({ message: `서버 오류 (${pwRes.status})` }))
            if (!pwRes.ok) return alert(`정보는 저장되었지만 비밀번호는 바뀌지 않았어요.\n${pwData.message}`)
            setPw(EMPTY_PW)
        }
        alert(wantPw ? "정보와 비밀번호가 저장되었습니다." : "정보가 저장되었습니다.")
    }

    // 취소: 마지막으로 저장된 값으로 되돌리기
    const handleCancel = () => {
        setInfo(saved)
        setPw(EMPTY_PW)
    }

    // 회원탈퇴: 비밀번호 확인 → 확인창 → 탈퇴 → 홈으로
    const handleWithdraw = async () => {
        if (!withdrawPw) return alert("비밀번호를 입력해주세요.")
        if (!confirm("정말 탈퇴할까요?\n주문 기록과 작성한 글이 모두 삭제되며 되돌릴 수 없어요.")) return
        const res = await fetch('/api/me', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: withdrawPw }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        alert("탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.")
        navigate("/", { replace: true })
        fetchMe()   // 로그인 상태 비우기 → 헤더가 '로그인 / 회원가입'으로
    }

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/mypage/info" }} />

    return(
        <>
            <SubVisual label="마이페이지" title="My Page" desc="주문과 활동 내역을 한눈에 확인하세요" />

            <Lnb
                items={[
                    { title: "주문 내역", to: "/mypage" },
                    { title: "회원 정보 수정", to: "/mypage/info" },
                    { title: "내가 쓴 글", to: "/mypage/posts" },
                    { title: "1:1 문의 내역", to: "/mypage/qna" },
                    
                ]}
            />
            <div className="mypage-info">
                <div>
                    <h1>회원정보 수정</h1>
                    <span>정보를 바꾼 뒤 저장하기를 눌러주세요.</span>
                </div>
                <form className="main">
                    <div className="basic">
                        <p>기본정보</p>
                        <label>
                            <span>아이디</span>
                            <input value={user.username} readOnly />
                        </label>
                        <div className="field-row">
                            <label>
                                <span>성명</span>
                                <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} maxLength={30} />
                            </label>
                            <label>
                                <span>생년월일</span>
                                <input value={info.birth} onChange={(e) => setInfo({ ...info, birth: formatBirth(e.target.value) })} placeholder="00.00.00" inputMode="numeric" />
                            </label>
                        </div>
                        <label>
                            <span>휴대폰 번호</span>
                            <input type="tel" value={info.phone} onChange={(e) => setInfo({ ...info, phone: formatPhone(e.target.value) })} placeholder="010-0000-0000" />
                        </label>
                        <label>
                            <span>이메일</span>
                            <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} placeholder="you@example.com" />
                        </label>
                    </div>
                    <div className="pw-change">
                        <p>비밀번호 변경</p>
                        <label>
                            <span>현재 비밀번호</span>
                            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
                        </label>
                        <div className="field-row">
                            <label>
                                <span>새 비밀번호</span>
                                <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder="8자 이상" autoComplete="new-password" />
                            </label>
                            <label>
                                <span>비밀번호 확인</span>
                                <input type="password" value={pw.check} onChange={(e) => setPw({ ...pw, check: e.target.value })} autoComplete="new-password" />
                            </label>
                        </div>
                    </div>
                    <div className="marketing">
                        <p>마케팅 정보 수신</p>
                        <div>
                            <label>
                                <input type="checkbox" checked={info.agreeMarketing} onChange={(e) => setInfo({ ...info, agreeMarketing: e.target.checked })} />
                                <span>마케팅 정보 수신 (이메일 · SMS)</span>
                            </label>
                        </div>
                    </div>
                    <div className="btn">
                        <button type="button" onClick={handleCancel}>취소</button>
                        <button type="button" onClick={handleSave}>저장하기</button>
                    </div>
                </form>
                <button type="button" onClick={() => setShowWithdraw(!showWithdraw)}>회원탈퇴</button>
                {showWithdraw && (
                    <div className="withdraw">
                        <p>탈퇴하면 주문 기록과 작성한 글이 모두 삭제되며 되돌릴 수 없어요.</p>
                        <div>
                            <input type="password" value={withdrawPw} onChange={(e) => setWithdrawPw(e.target.value)} placeholder="비밀번호를 입력해주세요" autoComplete="current-password" />
                            <button type="button" onClick={handleWithdraw}>탈퇴하기</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MyInfo