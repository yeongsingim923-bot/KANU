import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import SubVisual from "../../components/common/SubVisual"
import SearchEmpty from "./SearchEmpty"
import type { Product } from "../../data/products"
import "../../css/pages/store/Store.css"          // 제품 카드 모양 같이 쓰기
import "../../css/pages/search/search.css"

// 입력 중 추천 (GET /api/search/suggest)
type Suggest = {
    products: { id: string; name: string; option?: string; img: string }[]
    posts: { id: number; title: string }[]
}
// 검색 결과 (GET /api/search)
type SearchResult = {
    products: Product[]
    posts: { id: number; category: string; title: string; author: string; views: number; created_at: string }[]
}

const RECENT_KEY = "kanu-recent-searches"   // 최근 검색어를 브라우저에 저장할 이름
const PRODUCT_PER_PAGE = 4                  // 결과: 제품은 한 번에 4개
const POST_PER_PAGE = 5                     // 결과: 게시글은 한 번에 5개

const won = (n: number) => n.toLocaleString() + "원"
const getRate = (p: Product) => p.originPrice ? Math.round((1 - p.price / p.originPrice) * 100) : 0

// 최근 검색어 읽기/저장 (브라우저 localStorage, 못 읽어도 검색은 되게)
function loadRecent(): string[] {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") } catch { return [] }
}
function saveRecent(list: string[]) {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)) } catch { /* 저장 못 해도 검색은 됨 */ }
}

// 페이지 번호: ◀ 1 2 3 ▶
type PagerProps = { page: number; total: number; perPage: number; onChange: (page: number) => void }
function Pager({ page, total, perPage, onChange }: PagerProps) {
    const last = Math.ceil(total / perPage)
    if (last <= 1) return null   // 한 페이지면 번호 숨김
    return (
        <div className="search-pager">
            <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="이전">◀</button>
            {Array.from({ length: last }, (_, i) => i + 1).map((n) => (
                <button type="button" key={n} className={n === page ? "is-active" : ""} onClick={() => onChange(n)}>{n}</button>
            ))}
            <button type="button" onClick={() => onChange(page + 1)} disabled={page === last} aria-label="다음">▶</button>
        </div>
    )
}

// 주소의 검색어(?q=)가 바뀔 때마다 화면을 새로 그림 (key) → 입력칸/결과/페이지가 자동으로 처음 상태가 됨
function Search() {
    const [params] = useSearchParams()
    const q = (params.get("q") ?? "").trim()
    return <SearchContent key={q} q={q} />
}

function SearchContent({ q }: { q: string }) {
    const navigate = useNavigate()

    const [text, setText] = useState(q)                         // 검색창에 입력 중인 글자
    const [suggest, setSuggest] = useState<Suggest | null>(null) // 입력 중 추천
    const [showSuggest, setShowSuggest] = useState(false)        // 추천 목록 보이기
    const [recent, setRecent] = useState<string[]>(loadRecent)   // 최근 검색어
    const [popular, setPopular] = useState<string[]>([])         // 인기 검색어
    const [hotProducts, setHotProducts] = useState<Product[]>([]) // 지금 많이 찾는 제품
    const [result, setResult] = useState<SearchResult | null>(null) // 검색 결과 (null = 불러오는 중)
    const [productPage, setProductPage] = useState(1)
    const [postPage, setPostPage] = useState(1)

    // 첫 화면(검색어 없음): 인기 검색어 + 많이 찾는 제품 / 결과 화면: 검색 결과
    useEffect(() => {
        const load = async () => {
            if (q) {
                const res = await fetch("/api/search?q=" + encodeURIComponent(q))
                if (res.ok) setResult(await res.json())
            } else {
                const [p, h] = await Promise.all([fetch("/api/search/popular"), fetch("/api/search/hot-products")])
                if (p.ok) setPopular(await p.json())
                if (h.ok) setHotProducts(await h.json())
            }
        }
        load()
    }, [q])

    // 입력 중 추천: 입력을 0.3초 멈추면 요청 (글자마다 요청하지 않게 = 디바운스)
    useEffect(() => {
        const word = text.trim()
        if (!word || word === q) return          // 비었거나 지금 결과와 같은 검색어면 추천 안 함
        let cancelled = false                    // 더 새로 입력했으면 이전 응답은 버림
        const timer = setTimeout(async () => {
            const res = await fetch("/api/search/suggest?q=" + encodeURIComponent(word))
            if (!cancelled && res.ok) setSuggest(await res.json())
        }, 300)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [text, q])

    // 검색 실행: 최근 검색어 저장 → 검색어 기록(인기 검색어용) → 결과 화면으로
    const search = (word: string) => {
        const w = word.trim().replace(/\s+/g, " ")
        if (!w) return
        const next = [w, ...recent.filter((r) => r !== w)].slice(0, 10)   // 같은 단어는 맨 앞으로, 10개까지
        setRecent(next)
        saveRecent(next)
        fetch("/api/search/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: w }),
        })   // 기록은 기다리지 않음
        setShowSuggest(false)
        navigate("/search?q=" + encodeURIComponent(w))
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        search(text)
    }

    // X: 입력 지우기 (결과 화면이면 첫 화면으로)
    const handleClear = () => {
        setText("")
        setShowSuggest(false)
        if (q) navigate("/search")
    }

    // 최근 검색어 하나 / 전체 지우기
    const removeRecent = (word: string) => {
        const next = recent.filter((r) => r !== word)
        setRecent(next)
        saveRecent(next)
    }
    const clearRecent = () => {
        setRecent([])
        saveRecent([])
    }

    const hasSuggest = showSuggest && text.trim() !== "" && suggest && (suggest.products.length > 0 || suggest.posts.length > 0)
    const total = result ? result.products.length + result.posts.length : 0

    return(
        <>
            <SubVisual label="검색" title="Search" desc="찾으시는 제품과 글을 한 번에 확인하세요" />

            <div className="search">
                {/* ===== 검색창 + 입력 중 추천 ===== */}
                <form className="search-bar" onSubmit={handleSubmit} role="search">
                    <input
                        value={text}
                        onChange={(e) => { setText(e.target.value); setShowSuggest(true) }}
                        onFocus={() => setShowSuggest(true)}
                        onBlur={() => setShowSuggest(false)}
                        placeholder="찾으시는 제품이나 글을 검색해보세요"
                        aria-label="검색어"
                        maxLength={50}
                    />
                    <button type="submit" className="search-bar-submit" aria-label="검색"><img src="/images/search.png" alt="" /></button>
                    <button type="button" className="search-bar-clear" onClick={handleClear} aria-label="지우기">X</button>

                    {hasSuggest && (
                        // onMouseDown 막기: 추천을 누르는 순간 입력칸이 포커스를 잃어 목록이 먼저 닫히는 것 방지
                        <div className="search-suggest" onMouseDown={(e) => e.preventDefault()}>
                            {suggest.products.length > 0 && (
                                <ul>
                                    {suggest.products.map((p) => (
                                        <li key={p.id}>
                                            <Link to={`/store/${p.id}`}>
                                                <img src={p.img} alt="" />
                                                <span>{p.name} {p.option}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {suggest.posts.length > 0 && (
                                <ul>
                                    {suggest.posts.map((p) => (
                                        <li key={p.id}>
                                            <Link to={`/board/${p.id}`}>
                                                <em>게시글</em>
                                                <span>{p.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </form>

                {!q ? (
                    /* ===== 첫 화면: 최근 / 인기 / 많이 찾는 제품 ===== */
                    <div className="search-home">
                        <section>
                            <div className="search-home-head">
                                <h3>최근 검색어</h3>
                                {recent.length > 0 && <button type="button" onClick={clearRecent}>전체 삭제</button>}
                            </div>
                            {recent.length === 0 ? (
                                <p className="search-home-empty">최근 검색어가 없어요.</p>
                            ) : (
                                <ul className="search-recent">
                                    {recent.map((r) => (
                                        <li key={r}>
                                            <button type="button" onClick={() => search(r)}>{r}</button>
                                            <button type="button" className="search-recent-remove" onClick={() => removeRecent(r)} aria-label={`${r} 지우기`}>×</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                        <section>
                            <div className="search-home-head">
                                <h3>인기 검색어</h3>
                                <span>최근 7일 기준</span>
                            </div>
                            {popular.length === 0 ? (
                                <p className="search-home-empty">아직 집계된 검색어가 없어요.</p>
                            ) : (
                                <ol className="search-popular">
                                    {popular.map((word, i) => (
                                        <li key={word}>
                                            <button type="button" onClick={() => search(word)}>
                                                <strong>{i + 1}</strong>{word}
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </section>
                        <section>
                            <div className="search-home-head">
                                <h3>지금 많이 찾는 제품</h3>
                            </div>
                            <ul className="search-hot">
                                {hotProducts.map((p) => (
                                    <li key={p.id}>
                                        <Link to={`/store/${p.id}`}>
                                            <img src={p.img} alt="" />
                                            <span>{p.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                ) : result === null ? (
                    <p className="search-home-empty">검색 중...</p>
                ) : total === 0 ? (
                    /* ===== 결과 없음: 추천 태그를 누르면 그 단어로 검색 ===== */
                    <SearchEmpty keyword={q} onTagClick={search} />
                ) : (
                    /* ===== 검색 결과 ===== */
                    <div className="search-result">
                        <p className="search-result-title"><em>‘{q}’</em> 검색결과입니다</p>

                        <section className="search-result-section">
                            <h2>제품 <span>{result.products.length}</span></h2>
                            {result.products.length === 0 ? (
                                <p className="search-home-empty">검색된 제품이 없어요.</p>
                            ) : (
                                <>
                                    <ul className="store-list">
                                        {result.products
                                            .slice((productPage - 1) * PRODUCT_PER_PAGE, productPage * PRODUCT_PER_PAGE)
                                            .map((p) => {
                                                const rate = getRate(p)
                                                return (
                                                    <li key={p.id} className="store-card">
                                                        <Link to={`/store/${p.id}`}>
                                                            <div className="store-card-img">
                                                                <img src={p.img} alt={p.name} />
                                                            </div>
                                                            <p className="store-card-name">
                                                                {p.name}
                                                                {p.option && <><br />{p.option}</>}
                                                            </p>
                                                            <p className="store-card-desc">{p.desc}</p>
                                                        </Link>
                                                        <p className="store-card-price">
                                                            {rate > 0 && <span className="store-card-rate">{rate}%</span>}
                                                            <strong>{won(p.price)}</strong>
                                                            {p.originPrice && <del>{won(p.originPrice)}</del>}
                                                        </p>
                                                    </li>
                                                )
                                            })}
                                    </ul>
                                    <Pager page={productPage} total={result.products.length} perPage={PRODUCT_PER_PAGE} onChange={setProductPage} />
                                </>
                            )}
                        </section>

                        <section className="search-result-section">
                            <h2>게시글 <span>{result.posts.length}</span></h2>
                            {result.posts.length === 0 ? (
                                <p className="search-home-empty">검색된 게시글이 없어요.</p>
                            ) : (
                                <>
                                    <ul className="search-posts">
                                        {result.posts
                                            .slice((postPage - 1) * POST_PER_PAGE, postPage * POST_PER_PAGE)
                                            .map((p) => (
                                                <li key={p.id}>
                                                    <Link to={`/board/${p.id}`}>
                                                        <em>{p.category}</em>
                                                        <strong>{p.title}</strong>
                                                        <span>{p.author} · {p.created_at.slice(0, 10).replaceAll("-", ".")} · 조회 {p.views}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                    <Pager page={postPage} total={result.posts.length} perPage={POST_PER_PAGE} onChange={setPostPage} />
                                </>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </>
    )
}

export default Search
