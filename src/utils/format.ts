// 입력값 모양 자동 맞춤 (숫자만 입력해도 점/하이픈을 넣어줌)

// 990131 → 99.01.31
export const formatBirth = (v: string) => v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(?=\d)/g, '$1.')

// 01012345678 → 010-1234-5678
export const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length < 4) return d
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}
