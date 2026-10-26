import { Link } from 'react-router-dom';
import SubVisual from '../../components/common/SubVisual'
import '../../css/pages/board/Board.css'
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore'
type Post = {
    id: number
    category: string
    title: string
    author: string
    images: string | null
    created_at: string
}


function Board() {
    const [posts, setPosts] = useState<Post[]>([])
    const [category, setCategory] = useState('전체') 
    const[keyword,setKeyword]=useState('')
    const user = useAuthStore((s) => s.user)   // 로그인했을 때만 글쓰기 버튼 표시

    useEffect(() => {
            const load = async () => {
                const url = category !=='전체'
                    ? '/api/community?category=' + encodeURIComponent(category)
                    : '/api/community';
                setPosts(await (await fetch(url)).json());
            };
        load();}
    ,[category])

    const shown = posts.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()))
    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()   // 페이지 새로고침 막기
        setKeyword(String(new FormData(e.currentTarget).get('q') ?? '').trim())
    }
    return(
        <>
            <SubVisual label="커뮤니티" title="Community" desc="카누를 좋아하는 사람들의 이야기" />
            <div  className="board">
                <div className='board-header'>
                    <span>WEEKLY HOT</span>
                    <h1>이번 주 인기글</h1>
                </div>
                <div className="pop-board">
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                </div>
                <div className="board-top">
                    <div className="tabs">
                        <button type="button" onClick={()=>setCategory('전체')} className={category==='전체'?'tab active':'tab'}>전체</button>
                        <button type="button" onClick={()=>setCategory('자유')} className={category==='자유'?'tab active':'tab'}>자유</button>
                        <button type="button" onClick={()=>setCategory('질문')} className={category==='질문'?'tab active':'tab'}>질문</button>
                        <button type="button" onClick={()=>setCategory('후기')} className={category==='후기'?'tab active':'tab'}>후기</button>
                    </div>
                    <div className="tools">
                        <form onSubmit={handleSearch} role="search">
                            <input name='q' type="search" placeholder="검색어를 입력해주세요" aria-label="커뮤니티 검색" />
                            <button>검색</button>
                        </form>
                        {user && <Link to="/board/write" className="write-btn">글쓰기</Link>}
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th><th>분류</th><th className="col-title">제목</th><th>작성자</th><th>등록일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((p,i)=>(
                            <tr key={p.id}>
                                <td>{i + 1}</td>
                                <td>{p.category}</td>
                                <td className="col-title">{p.title}</td>
                                <td>{p.author}</td>
                                <td>{p.created_at.slice(0, 10).replaceAll('-', '.')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Board