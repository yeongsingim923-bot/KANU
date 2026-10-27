/*장바구니 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 장바구니에는 상품 id + 수량만 저장 (이름, 가격, 사진은 products.tsx에서 찾아 씀 → 가격이 바뀌어도 자동 반영)
export type CartItem = { id: string; qty: number }

type CartState = {
    items: CartItem[]
    add: (id: string, qty: number) => void      // 담기 (이미 있으면 수량 더하기)
    setQty: (id: string, qty: number) => void   // 수량 바꾸기 (1보다 작아지지 않음)
    remove: (ids: string[]) => void             // 여러 개 한 번에 지우기
}

// persist: 브라우저(localStorage)에 저장 → 새로고침하거나 창을 닫았다 열어도 유지
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            add: (id, qty) => set((s) => {
                const found = s.items.find((it) => it.id === id)
                return {
                    items: found
                        ? s.items.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it))
                        : [...s.items, { id, qty }],
                }
            }),

            setQty: (id, qty) => set((s) => ({
                items: s.items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)),
            })),

            remove: (ids) => set((s) => ({
                items: s.items.filter((it) => !ids.includes(it.id)),
            })),
        }),
        { name: 'kanu-cart' },   // localStorage에 저장될 이름
    ),
)
