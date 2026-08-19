'use client';

import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { signIn, type AuthState } from '../_actions/auth';

const labelClass =
  'mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-olive-deep';

const inputClass =
  'w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-[15px] text-charcoal ' +
  'placeholder-charcoal/30 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition ' +
  'focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/12';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-olive-deep px-5 py-3.5
                 text-[15px] font-semibold text-cream shadow-[0_2px_10px_rgba(58,74,42,0.22)] transition
                 hover:bg-olive hover:shadow-[0_4px_16px_rgba(58,74,42,0.28)]
                 focus:outline-none focus:ring-4 focus:ring-olive/25
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
    >
      {pending ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Ingresando…
        </>
      ) : (
        'Ingresar'
      )}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(signIn, { error: null });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="tu@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center
                       rounded-lg text-charcoal/40 transition hover:bg-charcoal/5 hover:text-charcoal/70
                       focus:outline-none focus:ring-2 focus:ring-olive/25"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3
                     text-sm leading-relaxed text-red-800"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
