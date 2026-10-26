import { create } from 'zustand'

type User = { id: number; username: string }

type AuthState = {
    user: User | null     // 로그인한 사람 (없으면 null)
    loading: boolean      // 처음 로그인 여부를 확인하는 중인지
    fetchMe: () => Promise<void>
    login: (username: string, password: string) => Promise<string | null>   // 실패: 메시지, 성공: null
    logout: () => Promise<void>
}

// 로그인 상태 저장소: 어느 컴포넌트에서든 useAuthStore로 꺼내 씀
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    // 서버에 "지금 누가 로그인해 있나" 0물어보고 저장
    fetchMe: async () => {
        const data = await (await fetch('/api/me')).json().catch(() => null)
        set({ user: data, loading: false })
    },

    login: async (username, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        const data = await res.json().catch(() => ({ message: `서버 오류 (${res.status})` }))
        if (!res.ok) return data.message
        await useAuthStore.getState().fetchMe()   // 저장소 갱신 → 헤더 등 즉시 반영
        return null
    },

    logout: async () => {
        await fetch('/api/logout', { method: 'POST' })
        set({ user: null })
    },
}))
