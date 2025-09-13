import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'


export const api = axios.create({
    baseURL: API_BASE,
})


// ------- Token storage helpers -------
const ACCESS_KEY = 'jwt_access'
const REFRESH_KEY = 'jwt_refresh'


export function getAccessToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_KEY)
}
export function getRefreshToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_KEY)
}
export function setTokens(access: string, refresh: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
}
export function clearTokens() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
}


// ------- Request: injeta Authorization -------
api.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


// ------- Response: auto‑refresh quando 401 -------
let refreshing = false
let queue: Array<() => void> = []


async function refreshToken() {
    const refresh = getRefreshToken()
    if (!refresh) throw new Error('no-refresh')
    const resp = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh })
    const { access, refresh: newRefresh } = resp.data
    setTokens(access, newRefresh ?? refresh)
    return access
}


api.interceptors.response.use(
    (resp) => resp,
    async (error) => {
        const status = error?.response?.status
        const original = error.config


        if (status === 401 && !original._retry) {
            if (refreshing) {
                await new Promise<void>((ok) => queue.push(ok))
                original.headers.Authorization = `Bearer ${getAccessToken()}`
                original._retry = true
                return api(original)
            }
            try {
                refreshing = true
                const newAccess = await refreshToken()
                queue.forEach((ok) => ok())
                queue = []
                original.headers.Authorization = `Bearer ${newAccess}`
                original._retry = true
                return api(original)
            } catch (e) {
                clearTokens()
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
                return Promise.reject(e)
            } finally {
                refreshing = false
            }
        }


        return Promise.reject(error)
    }
)