// src/services/api.ts
import axios from 'axios'

function computeApiBase() {
  // 1) .env (produção/dev)
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  // 2) fallback inteligente para DEV: mesmo host do front, porta 8000
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:8000`
  }

  // 3) fallback neutro (quase não usado)
  return 'http://localhost:8000'
}

const API_BASE = computeApiBase()

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
  // >>> ponte pro middleware:
  document.cookie = `auth=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
}
export function clearTokens() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  // limpa o sinalizador do middleware
  document.cookie = 'auth=; Path=/; Max-Age=0; SameSite=Lax'
}

// ------- Authorization header -------
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ------- Auto-refresh 401 -------
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
        queue.forEach((ok) => ok()); queue = []
        original.headers.Authorization = `Bearer ${newAccess}`
        original._retry = true
        return api(original)
      } catch (e) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(e)
      } finally { refreshing = false }
    }

    return Promise.reject(error)
  }
)

