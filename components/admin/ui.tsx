import clsx from 'clsx';
import type { ReactNode } from 'react';

/** Primitivas del panel. Paleta del estudio, densidad de herramienta interna. */

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx('flex flex-col gap-2', className)}>
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-olive-deep">
        {label}
      </span>
      {children}
      {hint && <span className="text-[13px] leading-relaxed text-charcoal/50">{hint}</span>}
      {error && <span className="text-[13px] font-medium text-red-600">{error}</span>}
    </label>
  );
}

const controlBase =
  'w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-[15px] text-charcoal ' +
  'placeholder-charcoal/35 transition focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/12 ' +
  'disabled:bg-charcoal/5 disabled:text-charcoal/40';

// React 19: `ref` viaja como prop normal, sin forwardRef.
export function Input(props: React.ComponentPropsWithRef<'input'>) {
  return <input {...props} className={clsx(controlBase, props.className)} />;
}

export function Textarea(props: React.ComponentPropsWithRef<'textarea'>) {
  return <textarea {...props} className={clsx(controlBase, 'min-h-24 resize-y', props.className)} />;
}

export function Select(props: React.ComponentPropsWithRef<'select'>) {
  return <select {...props} className={clsx(controlBase, 'pr-8', props.className)} />;
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition',
        'focus:outline-none focus:ring-4 focus:ring-olive/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-olive-deep text-cream hover:bg-olive',
        variant === 'secondary' &&
          'border border-charcoal/15 bg-white text-charcoal hover:border-olive/40 hover:bg-olive/5',
        variant === 'ghost' && 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        className
      )}
    />
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-7',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-5">
      <h2
        className="text-[21px] font-bold text-charcoal"
        style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
      >
        {children}
      </h2>
      {hint && <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal/55">{hint}</p>}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'muted';
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider',
        tone === 'success' && 'bg-olive-deep/10 text-olive-deep',
        tone === 'muted' && 'bg-charcoal/8 text-charcoal/50',
        tone === 'neutral' && 'bg-wood/15 text-wood'
      )}
    >
      {children}
    </span>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'error';
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'rounded-xl border-l-4 p-5 text-[15px] leading-relaxed',
        tone === 'info' && 'border-olive bg-olive/5 text-charcoal/75',
        tone === 'warn' && 'border-wood bg-wood/8 text-charcoal/80',
        tone === 'error' && 'border-red-500 bg-red-50 text-red-800'
      )}
    >
      {title && <p className="mb-1 font-bold">{title}</p>}
      {children}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-charcoal/20 bg-white/60 px-6 py-16 text-center">
      <p className="text-[17px] font-semibold text-charcoal">{title}</p>
      {children && <div className="mt-2.5 text-[15px] text-charcoal/55">{children}</div>}
    </div>
  );
}
