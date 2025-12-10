'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { api, setTokens } from '@/services/api'
import { EyeIcon, EyeOffIcon } from '@/components/icons'
import styles from '@/app/login/login.module.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ERROR_STORAGE_KEY = 'loginErrorMessage'

  const router = useRouter()
  const search = useSearchParams()

  // Pegamos o redirect cru da URL (?redirect=%2FOrcamentos%3Fopen%3Dnovo_orcamento%26equip%3D10)
  const redirectRaw = search.get('redirect') || search.get('next') || '/Home'
  const startParam = search.get('start') || '' // compatibilidade com fluxo antigo

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

  // Carrega último erro persistido (caso a página recarregue após falha)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem(ERROR_STORAGE_KEY)
    if (stored) setError(stored)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    // Não limpa o erro aqui - ele permanecerá até o login ser bem-sucedido

    try {
      const resp = await api.post('/auth/token/', { username, password })
      const { access, refresh } = resp.data

      // Salva tokens (ex.: localStorage + axios headers)
      setTokens(access, refresh)

      // Cookie leve pro middleware (UX, não segurança)
      document.cookie = 'auth=1; path=/; max-age=604800; samesite=lax' // 7 dias
      // Em produção + HTTPS, considere: '; secure'

      // Limpa o erro apenas quando o login for bem-sucedido
      setError(null)
      if (typeof window !== 'undefined') sessionStorage.removeItem(ERROR_STORAGE_KEY)

      // Apenas UMA navegação (sem push + replace)
      const destino = buildDestino()
      router.replace(destino)
      // Se preferir reload completo: window.location.replace(destino)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Usuário ou senha inválidos'
      setError(msg)
      if (typeof window !== 'undefined') sessionStorage.setItem(ERROR_STORAGE_KEY, msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/sgee-logo.png"
                alt="SGEE - Sistema de Gestão"
                width={280}
                height={90}
                priority
                className={styles.logo}
              />
            </div>
            <h2 className={styles.welcomeTitle}>Bem-vindo de volta</h2>
            <p className={styles.welcomeSubtitle}>
              Sistema de Gestão de Equipamentos e Orçamentos
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Gestão completa de equipamentos</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Controle de orçamentos e serviços</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Rastreamento em tempo real</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1>Entrar</h1>
              <p className={styles.subtitle}>Acesse sua conta para continuar</p>
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
                    {showPass ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </label>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}


