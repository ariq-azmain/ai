// Action AI — Bolt icon (square logo)
export const ActionIcon = ({ size = 40, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 40 45"
    className={className}
  >
    <defs>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#D6B4FF" />
        <stop offset="45%"  stopColor="#AC6AFF" />
        <stop offset="100%" stopColor="#5E17EB" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="url(#boltGrad)" d="M25 4L8 24h10l-2 16 17-22h-11L25 4z" />
    </g>
  </svg>
);

// Action AI — Full wordmark (bolt + "Action" text)
export const ActionWordmark = ({ width = 160, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={Math.round(width * 45 / 220)}
    viewBox="0 0 220 45"
    className={className}
  >
    <defs>
      <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#D6B4FF" />
        <stop offset="45%"  stopColor="#AC6AFF" />
        <stop offset="100%" stopColor="#5E17EB" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="url(#wordGrad)" d="M25 4L8 24h10l-2 16 17-22h-11L25 4z" />
      <g fill="#FFF" transform="translate(55, 12)">
        <path d="M0 20L7.5 0h5.2L20.2 20h-4.8l-1.8-5.2H6.4L4.6 20H0zm9.2-8.5l1.6-4.8 1.6 4.8H9.2z" />
        <path d="M32.5 20.4c-4.8 0-7.8-3.2-7.8-7.2s3-7.2 7.8-7.2c3.2 0 5.2 1.5 6.2 3.2l-3.8 2.2c-.6-.8-1.4-1.4-2.4-1.4-2.2 0-3.5 1.6-3.5 3.2s1.3 3.2 3.5 3.2c1 0 1.8-.6 2.4-1.4l3.8 2.2c-1 1.7-3 3.2-6.2 3.2z" />
        <path d="M44 6.5h4v2.5h2.5v3.5H48V16c0 1 .5 1.5 1.5 1.5h1V20h-2.5c-2.5 0-4-1.5-4-4.5V12.5h-2v-3.5h2V6.5z" />
        <path d="M58 6.5h4.2V20H58V6.5zm0-5.5h4.2v3.5H58V1z" />
        <path d="M78 20.4c-4.5 0-7.5-3.2-7.5-7.2s3-7.2 7.5-7.2 7.5 3.2 7.5 7.2-3 7.2-7.5 7.2zm0-3.8c2.2 0 3.2-1.6 3.2-3.4s-1-3.4-3.2-3.4-3.2 1.6-3.2 3.4 1 3.4 3.2 3.4z" />
        <path d="M93.5 6.5v2.2c1-1.8 2.8-2.6 4.8-2.6 3.2 0 5.8 2 5.8 5.8V20h-4.2v-7.2c0-1.8-.8-2.5-2.2-2.5s-2.5.8-3.2 2.2V20h-4.2V6.5h3.2z" />
      </g>
    </g>
  </svg>
);
