export type Category = "stick" | "machine" | "capsule"

export type Product = {
    id: string
    category: Category
    name: string        // 제품 이름
    option?: string     // 이름 아래 줄 (예: (100T)) - 없어도 됨
    desc: string        // 한 줄 설명
    price: number       // 판매가
    originPrice?: number // 원래 가격 (할인 있을 때만)
    best?: boolean      // 전체 탭 추천순에서 맨 앞에 보여줄 제품
    img: string
    detail?: ProductDetail   // 상세 정보 (없으면 상세 페이지에서 해당 칸 숨김)
    sortOrder: number        // 진열 순서 (작을수록 앞, 관리자 화면에서 씀)
}

// 상세 페이지 전용 정보 (있는 제품만 적으면 됨)
export type ProductDetail = {
    img?: string                // 상세 페이지 큰 사진 (없으면 img 사용)
    tags: string[]              // 예: ["#디카페인", "#부드러운"]
    taste: { acid: number; body: number; bitter: number; sweet: number }   // 산미/바디감/쓴맛/단맛 1~5
    spec: { label: string; value: string }[]                              // 원산지, 로스팅 등
}

// 상품 목록은 DB(products 테이블)에 있음 → GET /api/products 로 불러옴 (src/store/productStore.ts)