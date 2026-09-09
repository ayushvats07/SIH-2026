import { useState, type FormEvent } from 'react'
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Activity,
  CheckCircle2,
} from 'lucide-react'

const VALID_EMAIL = 'nova@gmail.com'
const VALID_PASSWORD = '123456'

type LoginProps = {
  onLoginSuccess: () => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
        onLoginSuccess()
      } else {
        setError('Invalid email or password. Please try again.')
        setIsSubmitting(false)
      }
    }, 500)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07151d] px-4 py-8 sm:px-6">
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(40,195,138,0.20),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(45,212,191,0.16),transparent_32%),linear-gradient(135deg,#07151d_0%,#0b2029_45%,#062e2b_100%)]" />
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -right-28 top-0 h-96 w-96 rounded-full bg-mint-400/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">

          {/* Brand / product side */}
          <section className="relative hidden min-h-[650px] overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-teal-300/10 bg-teal-400/5 blur-sm" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-mint-300/10 bg-mint-400/5" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 via-teal-400 to-mint-500 shadow-lg shadow-teal-500/25">
                  <Stethoscope className="h-6 w-6 text-[#06251f]" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight text-white">NOVA</p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-teal-200/70">Case-Taking</p>
                </div>
              </div>

              <div className="mt-20 max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smarter clinical workflows
                </div>

                <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-5xl">
                  Focus on the
                  <span className="block bg-gradient-to-r from-teal-300 via-mint-300 to-white bg-clip-text text-transparent">
                    patient, not paperwork.
                  </span>
                </h2>

                <p className="mt-6 max-w-sm text-sm leading-7 text-navy-300">
                  A secure clinical workspace designed to keep patient cases, appointments and documentation organized in one place.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">Secure by design</p>
                <p className="mt-1 text-xs leading-5 text-navy-400">Protected clinical workspace</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-mint-400/15 text-mint-300">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">Built for care</p>
                <p className="mt-1 text-xs leading-5 text-navy-400">Clear, efficient workflows</p>
              </div>
            </div>
          </section>

          {/* Login side */}
          <section className="flex min-h-[650px] flex-col justify-center bg-white/[0.025] p-6 sm:p-10 lg:border-l lg:border-white/10">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile brand */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-mint-500 shadow-lg shadow-teal-500/20">
                  <Stethoscope className="h-5 w-5 text-[#06251f]" />
                </div>
                <div>
                  <p className="font-bold text-white">NOVA Case-Taking</p>
                  <p className="text-xs text-navy-400">Clinical workspace</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Welcome back</p>
                <h1 className="text-3xl font-bold tracking-tight text-white">Sign in to NOVA</h1>
                <p className="mt-2 text-sm leading-6 text-navy-400">
                  Enter your credentials to continue to your clinical workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Email address
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500 transition-colors group-focus-within:text-teal-300" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white shadow-inner outline-none placeholder:text-navy-500 transition-all focus:border-teal-300/60 focus:bg-black/25 focus:ring-4 focus:ring-teal-400/10"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Password
                  </label>
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500 transition-colors group-focus-within:text-teal-300" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-11 text-sm text-white shadow-inner outline-none placeholder:text-navy-500 transition-all focus:border-teal-300/60 focus:bg-black/25 focus:ring-4 focus:ring-teal-400/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy-500 transition-colors hover:bg-white/5 hover:text-navy-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer flex-row items-center gap-2 !mb-0 text-navy-400">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-black/20 accent-teal-400" />
                    Remember me
                  </label>
                  <a href="#" className="font-semibold text-teal-300 transition-colors hover:text-teal-200">
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-200">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-mint-500 py-3.5 text-sm font-bold text-[#06251f] shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-400/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in to workspace'}
                  {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-teal-300/10 bg-gradient-to-r from-teal-400/[0.08] to-mint-400/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy-200">Demo access</p>
                    <p className="mt-1 text-xs text-navy-400">
                      <span className="text-navy-300">Email:</span> nova@gmail.com
                      <span className="mx-2 text-navy-600">•</span>
                      <span className="text-navy-300">Password:</span> 123456
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-navy-500">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
                Your clinical workspace is protected
              </div>

              <p className="mt-6 text-center text-[11px] text-navy-600">
                © {new Date().getFullYear()} NOVA Case-Taking · All rights reserved.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
