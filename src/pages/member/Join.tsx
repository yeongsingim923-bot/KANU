import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import "../../css/pages/member/Join.css"
type Field = 'username' | 'password' | 'passwordCheck' | 'name' | 'birth' | 'phone' | 'email'
type DupField = 'username' | 'phone' | 'email'      // 중복확인이 필요한 칸
type Msg = { text: string; ok?: boolean }           // 칸 아래 안내 문구 (ok = 초록색)

// 중복확인 API 주소 + 결과 문구
const DUP = {
    username: { url: '/api/check-id?username=', exists: '이미 사용 중인 아이디입니다.', ok: '사용 가능한 아이디입니다.' },
    phone: { url: '/api/check-phone?phone=', exists: '이미 가입된 휴대폰 번호입니다.', ok: '사용 가능한 번호입니다.' },
    email: { url: '/api/check-email?email=', exists: '이미 가입된 이메일입니다.', ok: '사용 가능한 이메일입니다.' },
}

// 형식 검사: 틀리면 안내 문구, 맞으면 '' (server.js의 RULES와 같은 규칙)
function validate(f: Field, form: Record<Field, string>) {
    const v = form[f]
    switch (f) {
        case 'username': return /^[A-Za-z0-9]{4,16}$/.test(v) ? '' : '아이디를 영문, 숫자 4~16자로 입력해주세요.'
        case 'password': return v.length >= 8 ? '' : '비밀번호는 8자리 이상 입력해주세요.'
        case 'passwordCheck': return v && v === form.password ? '' : '입력하신 비밀번호가 일치하지 않습니다.'
        case 'name': return v.trim() ? '' : '성함을 입력해주세요.'
        case 'birth': return /^\d{2}\.\d{2}\.\d{2}$/.test(v) ? '' : '생년월일 6자리를 입력해주세요. (예: 99.01.31)'
        case 'phone': return /^010-\d{4}-\d{4}$/.test(v) ? '' : '휴대폰 번호를 010-0000-0000 형식으로 입력해주세요.'
        case 'email': return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : '올바른 이메일 형식이 아닙니다.'
    }
}

// 숫자만 입력해도 모양 맞춰주기: 990131 → 99.01.31 / 01012345678 → 010-1234-5678
const formatBirth = (v: string) => v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(?=\d)/g, '$1.')
const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length < 4) return d
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function Join() {
    const navigate = useNavigate()
    const [agrees, setAgrees] = useState([false, false, false, false])  // 약관 4개 체크 상태 (순서: 이용약관, 개인정보, 만 14세, 마케팅)
    const isAllAgreed = agrees.every(Boolean)     // 4개 모두 체크됐는지
    const toggleAll = (checked: boolean) => setAgrees(agrees.map(() => checked))    // 전체 동의: 전체 체크박스 상태를 4개 모두에 똑같이 적용
    const toggleOne = (i: number) => setAgrees(agrees.map((v, idx) => (idx === i ? !v : v)))    // 하나만 바꾸기 (i = 몇 번째 약관인지, 0부터 시작)
    const [form, setForm] = useState<Record<Field, string>>({ username: '', password: '', passwordCheck: '', name: '', birth: '', phone: '', email: '' })
    const [msgs, setMsgs] = useState<Partial<Record<Field, Msg>>>({})            // 칸별 안내 문구
    const [checked, setChecked] = useState<Partial<Record<DupField, string>>>({})  // 중복확인을 통과한 값
    const [agreeTried, setAgreeTried] = useState(false)                           // 가입 버튼을 한 번이라도 눌렀는지 (약관 안내 표시용)
    const setMsg = (f: Field, text: string, ok = false) => setMsgs((prev) => ({ ...prev, [f]: text ? { text, ok } : undefined }))       // 문구 바꾸기 (text가 ''이면 문구 지움)
    // 입력할 때: 값 저장 + 문구 숨김 (생년월일/휴대폰은 모양 자동 맞춤)
    const change = (f: Field, value: string) => {
        const v = f === 'birth' ? formatBirth(value) : f === 'phone' ? formatPhone(value) : value
        setForm((prev) => ({ ...prev, [f]: v }))
        setMsg(f, '')
    }
    // input에 한 번에 붙이는 속성: 값 / 입력 / 칸을 벗어날 때 형식 검사
    const bind = (f: Field) => ({
        value: form[f],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => change(f, e.target.value),
        onBlur: () => {
            const error = validate(f, form)
            if (error) setMsg(f, error)
        },
    })

    // 칸 아래 안내 문구
    const showMsg = (f: Field) => {
        const m = msgs[f]
        return m && <span className={m.ok ? 'hidden ok' : 'hidden'}>{m.text}</span>
    }

    // 중복확인 버튼: 형식 검사 → API로 DB 확인
    const checkDup = async (f: DupField) => {
        if (!form[f]) return setMsg(f, '먼저 입력해주세요.')
        const error = validate(f, form)
        if (error) return setMsg(f, error)
        const res = await fetch(DUP[f].url + encodeURIComponent(form[f]))
        const data = await res.json().catch(() => null)
        if (!res.ok || !data) return setMsg(f, `서버 오류 (${res.status})`)
        if (data.exists) return setMsg(f, DUP[f].exists)
        setChecked((prev) => ({ ...prev, [f]: form[f] }))   // 통과한 값 기억 (값을 바꾸면 다시 확인해야 함)
        setMsg(f, DUP[f].ok, true)
    }

    // 회원 가입하기
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()   // 페이지 새로고침 막기
        // 1) 필수 약관
        setAgreeTried(true)
        if (!agrees[0] || !agrees[1] || !agrees[2]) return alert('필수 약관에 동의해주세요.')
        // 2) 모든 칸 형식 검사 → 틀린 칸마다 문구 표시
        const wrong = (Object.keys(form) as Field[]).filter((f) => validate(f, form))
        wrong.forEach((f) => setMsg(f, validate(f, form)))
        if (wrong.length) return
        // 3) 중복확인 했는지 (이메일은 입력했을 때만)
        const needCheck: DupField[] = form.email ? ['username', 'phone', 'email'] : ['username', 'phone']
        const notChecked = needCheck.filter((f) => checked[f] !== form[f])
        notChecked.forEach((f) => setMsg(f, '중복확인을 해주세요.'))
        if (notChecked.length) return
        // 4) 서버로 전송 (비밀번호 확인 칸은 보내지 않음)
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.username,
                password: form.password,
                name: form.name,
                birth: form.birth,
                phone: form.phone,
                email: form.email,
                agreeTerms: agrees[0],
                agreePrivacy: agrees[1],
                agreeAge: agrees[2],
                agreeMarketing: agrees[3],
            }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (res.ok) {
            alert('회원가입이 완료되었습니다. 로그인해주세요.')
            navigate('/login')
        } else if (data.field && data.field in form) {
            setMsg(data.field, data.message)   // 서버가 알려준 칸 아래에 표시
        } else {
            alert(data.message)
        }
    }

    return(
        <>
            <SubVisual label="회원가입" title="Join Us" desc="카누 회원이 되어 다양한 혜택을 받아보세요" />
            <div className="join">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="agreement">
                        <span>약관동의</span>
                        <ul>
                            <li>
                                <input type="checkbox" id="agree-all" checked={isAllAgreed} onChange={(e) => toggleAll(e.target.checked)} />
                                <span>전체 동의합니다.</span>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required" checked={agrees[0]} onChange={() => toggleOne(0)}/>
                                <div className="agree-text">    
                                    <span>[필수] 이용약관 동의</span>
                                    <span className="hidden" hidden={!agreeTried || agrees[0]}>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required" checked={agrees[1]} onChange={() => toggleOne(1)}/>
                                <div className="agree-text">
                                    <span>[필수] 개인정보 수집 · 이용 동의</span>
                                    <span className="hidden" hidden={!agreeTried || agrees[1]}>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree required" checked={agrees[2]} onChange={() => toggleOne(2)}/>
                                <div className="agree-text">
                                    <span>[필수] 만 14세 이상입니다</span>
                                    <span className="hidden" hidden={!agreeTried || agrees[2]}>약관에 동의해주세요</span>
                                </div>
                            </li>
                            <li>
                                <input type="checkbox" className="agree" checked={agrees[3]} onChange={() => toggleOne(3)}/>
                                <span>[선택] 마케팅 정보 수신 동의 (이메일 · SMS)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="id">
                        <label>
                            <span>아이디</span>
                            <input placeholder="영문, 숫자 4~16자" autoComplete="username" {...bind('username')} />
                            {showMsg('username')}
                        </label>
                        <button type="button" onClick={() => checkDup('username')}>중복확인</button>
                    </div>
                    <div>
                        <label>
                            <span>비밀번호</span>
                            <input type="password" placeholder="8자 이상" autoComplete="new-password" {...bind('password')} />
                            {showMsg('password')}
                        </label>
                        <label>
                            <span>비밀번호 확인</span>
                            <input type="password" autoComplete="new-password" {...bind('passwordCheck')} />
                            {showMsg('passwordCheck')}
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>성함</span>
                            <input autoComplete="name" {...bind('name')} />
                            {showMsg('name')}
                        </label>
                        <label>
                            <span>생년월일</span>
                            <input placeholder="00.00.00" inputMode="numeric" {...bind('birth')} />
                            {showMsg('birth')}
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>휴대폰 번호</span>
                            <input placeholder="010-0000-0000" inputMode="numeric" autoComplete="tel" {...bind('phone')} />
                            <button type="button" className="hidden-btn" onClick={() => checkDup('phone')}>중복확인</button>
                            {showMsg('phone')}
                        </label>
                        <label>
                            <span>인증번호</span>
                            <input placeholder="인증 생략" disabled />
                        </label>
                    </div>
                    <div>       {/* 기능상 아무의미 없지만 스타일통일때문에 */}
                        <label>
                            <span>이메일</span>
                            <input type="email" placeholder="you@example.com" autoComplete="email" {...bind('email')} />
                            <button type="button" className="hidden-btn" onClick={() => checkDup('email')}>중복확인</button>
                            {showMsg('email')}
                        </label>
                    </div>
                    <button>회원 가입하기</button>
                </form>
            </div>
            
        </>
    )
}

export default Join