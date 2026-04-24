type Props = {
  size?: number;
  className?: string;
  title?: string;
};

export function BeanLogo({ size = 48, className, title = "Bean There logo" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id="bean-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7d4426" />
          <stop offset="60%" stopColor="#4d2615" />
          <stop offset="100%" stopColor="#30170d" />
        </linearGradient>
        <linearGradient id="bean-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="32" rx="22" ry="28" fill="url(#bean-body)" />
      <ellipse cx="26" cy="22" rx="10" ry="14" fill="url(#bean-highlight)" opacity="0.6" />
      <path
        d="M32 6 C 28 20, 28 44, 32 58"
        stroke="#1c1510"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M32 6 C 34 20, 34 44, 32 58"
        stroke="#e8c77d"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}
