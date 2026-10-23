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
}

export const products: Product[] = [
    { id: "stick-mild", category: "stick", name: "카누 미니 마일드 로스트 아메리카노", option: "(100T)", desc: "부드럽고 깔끔한 매일의 아메리카노", price: 25400, originPrice: 26700, img: "/images/store/stick-mild.png" },
    { id: "stick-signature", category: "stick", name: "카누 미니 시그니처 미디엄 로스트", option: "(60T)", desc: "균형 잡힌 풍미, 카누의 시그니처", price: 20900, img: "/images/store/stick-signature.png" },
    { id: "stick-decaf", category: "stick", name: "카누 미니 디카페인 아메리카노", option: "(100T+20T)", desc: "카페인 걱정은 덜고 맛은 그대로", price: 26500, originPrice: 29400, img: "/images/store/stick-decaf.png" },
    { id: "stick-latte", category: "stick", name: "카누 라떼", option: "(50T)", desc: "부드러운 우유와 진한 커피의 조화", price: 24200, originPrice: 26700, best: true, img: "/images/store/stick-latte.png" },
    { id: "stick-chocolat", category: "stick", name: "카누 에스프레소 쇼콜라 라떼", option: "(24T)", desc: "진한 에스프레소에 달콤한 초콜릿 한 스푼", price: 12900, originPrice: 14400, best: true, img: "/images/store/stick-chocolat.png" },

    { id: "machine-oasis", category: "machine", name: "카누 바리스타 오아시스", desc: "집에서 완성하는 카페 메뉴", price: 399000, originPrice: 499000, best: true, img: "/images/store/machine-oasis.png" },
    { id: "machine-urban", category: "machine", name: "카누 바리스타 어반", desc: "공간에 어울리는 모던한 디자인", price: 139000, originPrice: 199000, img: "/images/store/machine-urban.png" },
    { id: "machine-pebble", category: "machine", name: "카누 바리스타 페블", desc: "작은 공간에도 쏙, 콤팩트한 머신", price: 89000, originPrice: 149000, img: "/images/store/machine-pebble.png" },
    { id: "machine-breeze", category: "machine", name: "카누 바리스타 브리즈", desc: "취향대로 고르는 4가지 컬러", price: 109000, originPrice: 169000, img: "/images/store/machine-breeze.png" },

    { id: "capsule-caring-star", category: "capsule", name: "케어링 스타 디카페인 | 카누 바리스타 전용캡슐", option: "(10캡슐)", desc: "별이 뜨는 밤에도 편안한 한 잔", price: 8400, originPrice: 9400, img: "/images/store/capsule-caring-star.png" },
    { id: "capsule-eternal-mountain", category: "capsule", name: "이터널 마운틴 | 카누 바리스타 전용캡슐", option: "(10캡슐)", desc: "높은 산처럼 깊고 묵직한 풍미", price: 8400, originPrice: 9400, img: "/images/store/capsule-eternal-mountain.png" },
    { id: "capsule-deep-forest", category: "capsule", name: "딥 포레스트 | 카누 바리스타 전용캡슐", option: "(10캡슐)", desc: "깊은 숲처럼 진하고 그윽한 향", price: 8400, originPrice: 9400, img: "/images/store/capsule-deep-forest.png" },
    { id: "capsule-wild-waterfall", category: "capsule", name: "와일드 워터폴 | 카누 바리스타 전용캡슐", option: "(10캡슐)", desc: "얼음 위에서 더 시원한 아이스 캡슐", price: 8400, originPrice: 9400, img: "/images/store/capsule-wild-waterfall.png" },
    { id: "capsule-bright-garden", category: "capsule", name: "브라이트 가든 | 카누 바리스타 전용캡슐", option: "(10캡슐)", desc: "꽃처럼 화사하고 산뜻한 한 잔", price: 8400, originPrice: 9400, best: true, img: "/images/store/capsule-bright-garden.png" },
]