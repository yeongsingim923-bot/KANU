import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { Category, Product } from "../../data/products"
import { won } from "../../utils/format"
import { useProductStore } from "../../store/productStore"

// 분류 이름 (server.js의 PRODUCT_CATEGORIES와 같게)
const CATEGORY_NAMES: Record<Category, string> = { stick: "스틱커피", machine: "머신", capsule: "캡슐" }

// 입력 폼: 숫자 칸도 글자로 들고 있다가 그대로 보냄 (서버가 숫자로 바꾸고 검사, 빈 칸 = 없음)
type ProductForm = {
    id: string
    category: Category
    name: string
    option: string
    desc: string
    price: string
    originPrice: string
    best: boolean
    img: string
    sortOrder: string
}
const EMPTY_FORM: ProductForm = {
    id: "", category: "stick", name: "", option: "", desc: "",
    price: "", originPrice: "", best: false, img: "", sortOrder: "",
}

// 상품 관리: 위쪽 입력 폼(새 상품 / 수정) + 아래 목록
function AdminProducts() {
    const products = useProductStore((s) => s.products)
    const fetchProducts = useProductStore((s) => s.fetchProducts)
    const [filter, setFilter] = useState("")                              // "" = 전체 분류
    const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
    const [editingId, setEditingId] = useState<string | null>(null)      // 고치는 중인 상품 (null = 새 상품)

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const shown = filter ? products.filter((p) => p.category === filter) : products

    const cancelEdit = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
    }

    // 저장: 새 상품은 POST, 수정은 PUT → 성공하면 상품 목록 다시 불러오기 (스토어·상세·장바구니도 새 값으로)
    const handleSave = async () => {
        const res = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return alert(data.message)
        alert(editingId ? "상품을 수정했어요." : "상품을 등록했어요.")
        cancelEdit()
        fetchProducts(true)
    }

    // 수정 버튼: 그 상품 내용을 위 폼에 채우기
    const startEdit = (p: Product) => {
        setEditingId(p.id)
        setForm({
            id: p.id,
            category: p.category,
            name: p.name,
            option: p.option ?? "",
            desc: p.desc,
            price: String(p.price),
            originPrice: p.originPrice ? String(p.originPrice) : "",
            best: !!p.best,
            img: p.img,
            sortOrder: String(p.sortOrder),
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <section>
            <div className="admin-head">
                <h2>{editingId ? "상품 수정" : "새 상품"}</h2>
            </div>
            <div className="admin-form">
                <div className="admin-product-form">
                    {/* 사진 미리보기: 경로가 틀리면 깨진 그림으로 보임 */}
                    <div className="admin-product-preview">
                        {form.img ? <img src={form.img} alt="사진 미리보기" /> : "사진 미리보기"}
                    </div>
                    <div className="admin-product-fields">
                        <label>
                            상품 id (주소에 쓰여서 등록 후엔 못 바꿈)
                            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="예: stick-vanilla" maxLength={50} disabled={!!editingId} />
                        </label>
                        <label>
                            분류
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                                {Object.entries(CATEGORY_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                            </select>
                        </label>
                        <label className="is-wide">
                            상품 이름
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 카누 바닐라 라떼" maxLength={100} />
                        </label>
                        <label>
                            옵션 (없으면 비워두기)
                            <input value={form.option} onChange={(e) => setForm({ ...form, option: e.target.value })} placeholder="예: (30T)" maxLength={30} />
                        </label>
                        <label>
                            진열 순서 (작을수록 앞)
                            <input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} placeholder="비우면 맨 뒤" />
                        </label>
                        <label className="is-wide">
                            한 줄 설명
                            <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="예: 달콤한 바닐라 향의 부드러운 라떼" maxLength={100} />
                        </label>
                        <label>
                            판매가 (원)
                            <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="예: 15900" />
                        </label>
                        <label>
                            원래 가격 (할인이 없으면 비워두기)
                            <input type="number" min={0} value={form.originPrice} onChange={(e) => setForm({ ...form, originPrice: e.target.value })} placeholder="예: 17900" />
                        </label>
                        <label className="is-wide">
                            사진 경로 (public 폴더 기준)
                            <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="예: /images/store/stick-vanilla.png" maxLength={255} />
                        </label>
                    </div>
                </div>
                <div className="admin-form-bottom">
                    <label className="admin-check">
                        <input type="checkbox" checked={form.best} onChange={(e) => setForm({ ...form, best: e.target.checked })} />
                        추천 상품 (스토어 전체 탭에서 앞쪽에 보임)
                    </label>
                    {editingId && <button type="button" className="admin-btn" onClick={cancelEdit}>취소</button>}
                    <button type="button" className="admin-btn is-primary" onClick={handleSave}>{editingId ? "수정 저장" : "상품 등록"}</button>
                </div>
            </div>

            <div className="admin-head">
                <h2>상품 목록 <span>{shown.length}</span></h2>
                <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">전체 분류</option>
                    {Object.entries(CATEGORY_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                </select>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>순서</th>
                        <th>사진</th>
                        <th>분류</th>
                        <th className="admin-left">상품</th>
                        <th>판매가</th>
                        <th>추천</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {shown.length === 0 ? (
                        <tr><td colSpan={7}>등록된 상품이 없어요.</td></tr>
                    ) : (
                        shown.map((p) => (
                            <tr key={p.id} className={editingId === p.id ? "is-editing" : ""}>
                                <td>{p.sortOrder}</td>
                                <td><img className="admin-product-thumb" src={p.img} alt="" /></td>
                                <td>{CATEGORY_NAMES[p.category]}</td>
                                <td className="admin-left">
                                    <Link to={`/store/${p.id}`}>{p.name}</Link> {p.option}<br />
                                    <small>{p.id}</small>
                                </td>
                                <td>
                                    {won(p.price)}
                                    {p.originPrice && <><br /><small><del>{won(p.originPrice)}</del></small></>}
                                </td>
                                <td>{p.best && <span className="admin-status is-done">추천</span>}</td>
                                <td>
                                    <div className="admin-btns">
                                        <button type="button" className="admin-btn" onClick={() => startEdit(p)}>수정</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    )
}

export default AdminProducts
