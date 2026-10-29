// 주문 API(GET /api/orders, /api/orders/:orderNo) 응답 모양 + 공통 도우미
// 마이페이지 주문내역(MyOrders)과 주문상세(MyOrderDetail)가 같이 씀

export type OrderItem = {
    productId: string
    name: string
    option?: string
    price: number          // 주문 당시 판매가 (1개)
    originPrice?: number
    qty: number
    img?: string
}

// 주문 목록 한 줄
export type OrderSummary = {
    orderNo: string
    status: string
    payPrice: number
    createdAt: string      // "2026-10-27 18:50:12"
    firstItem?: OrderItem  // 대표 상품
    itemCount: number      // 상품 종류 수
    totalQty: number       // 전체 수량
}

// 주문 상세
export type OrderDetail = {
    orderNo: string
    status: string
    createdAt: string
    receiver: string
    phone: string
    address: string
    memo?: string
    totalPrice: number
    discount: number
    shippingFee: number
    payPrice: number
    items: OrderItem[]
}

// 주문 단계 (마이페이지 단계 박스 순서)
export const ORDER_STEPS = ["결제 완료", "배송 준비", "배송 중", "배송 완료"]

// "2026-10-27 18:50:12" → "2026.10.27"
export const formatDate = (s: string) => s.slice(0, 10).replaceAll("-", ".")
