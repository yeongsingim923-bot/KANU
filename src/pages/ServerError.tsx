import NotFound from "./NotFound"

// 서버 오류 화면: 404 디자인 그대로, 숫자와 문구만 바꿔서 (서버가 꺼졌거나 응답하지 않을 때)
function ServerError() {
    return (
        <NotFound
            code="503"
            title="잠시 연결이 원활하지 않아요"
            desc="서버 점검 중이거나 일시적인 오류일 수 있어요. 잠시 후 다시 시도해주세요."
            retry
        />
    )
}

export default ServerError
