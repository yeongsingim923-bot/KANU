import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import { formatPhone } from "../../utils/format"
import PhotoPicker from "../../components/common/PhotoPicker"
import type { Photo } from "../../components/common/PhotoPicker"
import "../../css/pages/support/Qna.css"

// 문의 유형 (server.js의 INQUIRY_TYPES와 같게)
const INQUIRY_TYPES = ["주문/배송", "제품", "머신 A/S", "회원/계정", "기타"]

function Qna() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const authLoading = useAuthStore((s) => s.loading)

    // 내 정보로 미리 채우는 칸 (직접 고칠 수도 있음)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [submitting, setSubmitting] = useState(false)   // 보내는 중 (두 번 누르기 방지)
    const [photos, setPhotos] = useState<Photo[]>([])     // 고른 사진

    // 로그인 확인이 끝나면 내 정보로 성함/연락처/이메일 채우기
    useEffect(() => {
        if (!user) return
        const load = async () => {
            const res = await fetch('/api/me/profile')
            if (!res.ok) return
            const me = await res.json()
            setName(me.name ?? "")
            setPhone(me.phone ?? "")
            setEmail(me.email ?? "")
        }
        load()
    }, [user])

    // 문의등록: form 안의 값(name 붙은 칸)을 그대로 보냄 → 형식 검사는 서버가 하고 문구를 돌려줌
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        photos.forEach((p) => formData.append('photos', p.file))   // 고른 사진을 'photos'라는 이름으로 붙이기
        const res = await fetch('/api/inquiries', { method: 'POST', body: formData })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        setSubmitting(false)
        if (!res.ok) return alert(data.message)
        alert("문의가 등록되었습니다. 답변은 마이페이지 > 1:1 문의 내역에서 확인할 수 있어요.")
        navigate("/mypage/qna")
    }

    if (authLoading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/qna" }} />   // 로그인하면 다시 문의하기로

    return (
        <>
            <SubVisual label="1:1 문의" title="Contact Us" desc="궁금한 점을 남겨주시면 빠르게 답변드릴게요" />

            <Lnb
                items={[
                    { title: "공지사항", to: "/notice" },
                    { title: "1:1 문의", to: "/qna" },
                ]}
            />
            <form className="qna" onSubmit={handleSubmit} noValidate>
                <div className="notice">
                    <span>문의 전 확인해주세요</span>
                    <ul>
                        <li>답변은 평일 9~17시에 순서대로 드립니다.</li>
                        <li>머신 · 캡슐 080-025-9114 / 스틱 · 원두 080-023-9114</li>
                    </ul>
                </div>
                <label>
                    <span>문의 유형</span>
                    <select name="category" defaultValue="">
                        <option value="" disabled>선택해주세요</option>
                        {INQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                </label>
                <div className="qna-row">
                    <label>
                        <span>성함</span>
                        <input name="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
                    </label>
                    <label>
                        <span>연락처</span>
                        <input name="phone" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-0000-0000" inputMode="numeric" />
                    </label>
                </div>
                <label>
                    <span>이메일</span>
                    <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </label>
                <label>
                    <span>제목</span>
                    <input name="title" maxLength={100} />
                </label>
                <label>
                    <span>내용</span>
                    <textarea name="content" placeholder="문의 내용을 자세히 적어주세요" />
                </label>
                <div className="photo-field">
                    <span>사진첨부</span>
                    <PhotoPicker photos={photos} onChange={setPhotos} />
                </div>
                <label className="check">
                    <input type="checkbox" name="agree" value="yes" />
                    <span>개인정보 수집 · 이용에 동의합니다. (필수)</span>
                </label>
                <div className="under-bar">
                    <button type="button" onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" disabled={submitting}>{submitting ? "등록 중..." : "문의등록"}</button>
                </div>
            </form>
        </>
    )
}

export default Qna