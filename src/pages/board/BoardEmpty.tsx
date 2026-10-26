import { Link } from "react-router-dom"
import "../../css/pages/search/SearchEmpty.css"     // 아이콘/제목/설명 같이 쓰기때문에
import "../../css/pages/board/BoardEmpty.css"

type BoardEmptyProps = {
    keyword: string;   // 게시판에서 검색한 단어
};

function BoardEmpty({ keyword }: BoardEmptyProps) {
    return (
        <div className="board-empty">
            <svg className="search-empty-icon" viewBox="0 0 92 92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                <circle cx="38" cy="38" r="33" />
                <path d="M28 28 48 48M48 28 28 48" />
                <path d="M62 62 87 87" />
            </svg>
            <p className="search-empty-title">‘{keyword}’ 검색 결과가 없어요</p>
            <p className="search-empty-desc">다른 검색어로 다시 찾아보세요.</p>
            <p className="board-empty-tip">
                검색어의 철자가 정확한지 확인해주세요.<br />
                '라떼', '캡슐'처럼 짧은 단어로 검색해보세요.
            </p>

            <div className="board-empty-btns">
                <Link to="/board" className="board-empty-all">전체 글 보기</Link>
                <Link to="/board/write" className="board-empty-write">첫 글 남기기</Link>
            </div>
        </div>
    )
}

export default BoardEmpty