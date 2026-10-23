import "../../css/pages/search/SearchEmpty.css"

type SearchEmptyProps = {
    keyword: string;   // 사용자가 검색한 단어 → "'OOO'에 대한 검색 결과가 없어요"에 표시
};

function SearchEmpty({ keyword }: SearchEmptyProps) {
    return (
        <div className="search-empty">
           디자인
        </div>
    )
}

export default SearchEmpty