export function BakeryIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 280" role="img" aria-label="Ilustración de pan recién horneado" className={className}>
      <circle cx="160" cy="140" r="118" className="fill-secondary-strong/40" />
      <circle cx="160" cy="140" r="96" className="fill-background" />
      <ellipse cx="160" cy="214" rx="104" ry="14" className="fill-secondary-strong/25" />
      <path d="M58 196c0-56 46-96 102-96s102 40 102 96c0 10-8 16-18 16H76c-10 0-18-6-18-16z" className="fill-accent" />
      <path d="M72 194c0-46 40-80 88-80s88 34 88 80" className="fill-none stroke-primary-strong/25" strokeWidth="6" strokeLinecap="round" />
      <path d="M112 132c10 16 14 34 12 54M160 118c6 20 6 44 0 68M208 132c-10 16-14 34-12 54" className="fill-none stroke-background" strokeWidth="9" strokeLinecap="round" />
      <path d="M40 92c14-4 26 4 30 16M44 66c14-2 24 8 26 20M54 42c12 2 18 14 16 26" className="fill-none stroke-accent" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 118V36" className="stroke-accent" strokeWidth="4" strokeLinecap="round" />
      <path d="M268 64c-16 0-26 12-26 26 12 0 26-10 26-26zM274 104c-14-6-28 0-34 12 12 6 28 2 34-12z" className="fill-primary" />
      <path d="M262 150V58" className="stroke-primary-strong" strokeWidth="4" strokeLinecap="round" />
      <circle cx="104" cy="60" r="7" className="fill-primary" />
      <circle cx="226" cy="36" r="5" className="fill-background" />
      <circle cx="244" cy="226" r="6" className="fill-primary" />
    </svg>
  );
}
