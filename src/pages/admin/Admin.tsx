import { Navigate, useSearchParams } from "react-router-dom"
import Lnb from "../../components/common/Lnb"
import SubVisual from "../../components/common/SubVisual"
import { useAuthStore } from "../../store/authStore"
import AdminInquiries from "./AdminInquiries"
import AdminNotices from "./AdminNotices"
import AdminOrders from "./AdminOrders"
import AdminCommunity from "./AdminCommunity"
import AdminProducts from "./AdminProducts"
import "../../css/pages/admin/Admin.css"

// 관리자 화면: 탭은 주소로 구분 (/admin, /admin?tab=notices ...)
function Admin() {
    const [params] = useSearchParams()
    const tab = params.get("tab") ?? "inquiries"
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)

    if (loading) return null
    if (!user) return <Navigate to="/login" replace state={{ from: "/admin" }} />
    if (user.role !== "admin") return <Navigate to="/" replace />   // 관리자가 아니면 홈으로 (서버도 403으로 막음)

    return (
        <>
            <SubVisual label="관리자" title="Admin" desc="문의 답변, 공지, 주문, 상품, 커뮤니티를 관리합니다"/>
            <Lnb
                items={[
                    { title: "1:1 문의", to: "/admin" },
                    { title: "공지사항", to: "/admin?tab=notices" },
                    { title: "주문 관리", to: "/admin?tab=orders" },
                    { title: "상품 관리", to: "/admin?tab=products" },
                    { title: "커뮤니티 · 검색어", to: "/admin?tab=community" },
                ]}
            />
            <div className="admin">
                {tab === "notices" ? <AdminNotices />
                    : tab === "orders" ? <AdminOrders />
                    : tab === "products" ? <AdminProducts />
                    : tab === "community" ? <AdminCommunity />
                    : <AdminInquiries />}
            </div>
        </>
    )
}

export default Admin
