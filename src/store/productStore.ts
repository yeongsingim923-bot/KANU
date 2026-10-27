import { create } from 'zustand'
import type { Product } from '../data/products'

// 상품 목록 저장소: 서버(DB)에서 한 번 불러와 두고 스토어/상세/장바구니가 같이 씀
type ProductState = {
    products: Product[]
    loading: boolean     // 처음 불러오는 중인지
    error: string        // 불러오기 실패 메시지 (없으면 '')
    fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    loading: true,
    error: '',

    fetchProducts: async () => {
        if (get().products.length > 0) return   // 이미 불러왔으면 다시 안 부름 (페이지 이동할 때마다 요청 X)
        try {
            const res = await fetch('/api/products')
            if (!res.ok) throw new Error(`서버 오류 (${res.status})`)
            set({ products: await res.json(), loading: false, error: '' })
        } catch (e) {
            set({ loading: false, error: e instanceof Error ? e.message : '상품을 불러오지 못했습니다' })
        }
    },
}))
