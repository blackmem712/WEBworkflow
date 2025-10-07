'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api, setTokens } from '@/services/api'
import styles from '@/app/login/login.module.css'

export default function LoginPage() {
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const router = useRouter()
  const search = useSearchParams()

  // Pegamos o redirect cru da URL (?redirect=%2FOrcamentos%3Fopen%3Dnovo_orcamento%26equip%3D10)
  const redirectRaw = search.get('redirect') || search.get('next') || '/Home'
  const startParam  = search.get('start') || '' // compatibilidade com fluxo antigo

  // Decodifica para virar "/Orcamentos?open=novo_orcamento&equip=10"
  let redirect = '/Home'
  try {
    redirect = decodeURIComponent(redirectRaw)
  } catch {
    redirect = redirectRaw || '/Home'
  }

  // Sanitiza: precisa começar com "/"
  if (!redirect.startsWith('/')) {
    redirect = '/Home'
  }

  // Monta destino final, preservando 'start' se vier do fluxo antigo
  const buildDestino = () => {
    if (startParam) {
      const sep = redirect.includes('?') ? '&' : '?'
      return `${redirect}${sep}start=${encodeURIComponent(startParam)}`
    }
    return redirect
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const resp = await api.post('/auth/token/', { username, password })
      const { access, refresh } = resp.data

      // Salva tokens (ex.: localStorage + axios headers)
      setTokens(access, refresh)

      // Cookie leve pro middleware (UX, não segurança)
      document.cookie = 'auth=1; path=/; max-age=604800; samesite=lax' // 7 dias
      // Em produção + HTTPS, considere: '; secure'

      // Apenas UMA navegação (sem push + replace)
      const destino = buildDestino()
      router.replace(destino)
      // Se preferir reload completo: window.location.replace(destino)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Usuário ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>🔒</div>
          <h1>Entrar</h1>
          <p className={styles.sub}>Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Usuário
            <input
              className={styles.input}
              placeholder="seu usuário"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Senha
            <div className={styles.passWrap}>
              <input
                className={styles.input}
                placeholder="••••••••"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className={styles.tips}>
          <span>Dica: use o perfil correto (TC, GE ou RC) conforme seu acesso.</span>
        </div>
      </div>
    </div>
  )
}
 