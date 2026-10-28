import { useRef } from "react"
import "../../css/components/common/PhotoPicker.css"

// 사진첨부: 파일첨부 버튼 + 고른 사진 미리보기(X로 빼기)
// 게시판 글쓰기/수정, 1:1 문의가 같이 씀 (서버 규칙: 최대 3장, jpg/png, 한 장 5MB)

export type Photo = {
    file: File      // 서버로 보낼 실제 파일
    url: string     // 미리보기용 임시 주소 (브라우저 안에서만 쓰임)
}

const MAX_FILES = 3
const MAX_SIZE = 5 * 1024 * 1024
const TYPES = ["image/jpeg", "image/png"]

type PhotoPickerProps = {
    photos: Photo[]                        // 지금 고른 사진 (부모가 관리)
    onChange: (photos: Photo[]) => void    // 사진을 더하거나 뺄 때
    note?: string                          // 버튼 옆 안내 아래에 덧붙일 문구 (없어도 됨)
}

function PhotoPicker({ photos, onChange, note }: PhotoPickerProps) {
    const inputRef = useRef<HTMLInputElement>(null)   // 숨겨 둔 파일 선택창

    // 파일을 고르면: 형식/크기 확인 → 남은 자리만큼 추가
    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(e.target.files ?? [])
        e.target.value = ""   // 같은 파일을 다시 골라도 동작하게 비워 둠

        const ok = picked.filter((f) => TYPES.includes(f.type) && f.size <= MAX_SIZE)
        if (ok.length < picked.length) alert("jpg, png 파일만, 한 장에 5MB까지 올릴 수 있어요.")

        const room = MAX_FILES - photos.length
        if (ok.length > room) alert(`사진은 최대 ${MAX_FILES}장까지 올릴 수 있어요.`)

        const added = ok.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }))
        onChange([...photos, ...added])
    }

    // X: 그 사진 빼기 (미리보기 임시 주소도 정리)
    const remove = (index: number) => {
        URL.revokeObjectURL(photos[index].url)
        onChange(photos.filter((_, i) => i !== index))
    }

    return (
        <>
            <div className="picture">
                <button type="button" onClick={() => inputRef.current?.click()} disabled={photos.length >= MAX_FILES}>파일첨부</button>
                <span>최대 {MAX_FILES}장 · jpg, png ({photos.length}/{MAX_FILES})</span>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={handleSelect} />
            </div>
            {note && <p className="photo-note">{note}</p>}
            {photos.length > 0 && (
                <ul className="photo-preview">
                    {photos.map((p, i) => (
                        <li key={p.url}>
                            <img src={p.url} alt={`첨부 사진 ${i + 1}`} />
                            <button type="button" onClick={() => remove(i)} aria-label="사진 빼기">X</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default PhotoPicker
