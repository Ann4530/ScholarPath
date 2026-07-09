// Trang trí bầu trời cho hero du học: mây mềm + trăng lưỡi liềm + tuyến bay cong tự nhiên
// (điểm đi, ghim điểm đến, contrail chuyển động) + máy bay nằm ĐÚNG trên đường bay, bay bồng bềnh.

export default function HeroSky({ id = "hs" }: { id?: string }) {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 h-full w-[70%]"
      viewBox="0 0 600 320"
      fill="none"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-trail`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8fc0ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8fc0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e6f0ff" stopOpacity="0.95" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#050a1f" floodOpacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#8cbaff" floodOpacity="0.5" />
        </filter>
        <radialGradient id={`${id}-cloud`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9dcff" stopOpacity="0.20" />
          <stop offset="1" stopColor="#c9dcff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* mây mềm */}
      <ellipse cx="150" cy="250" rx="90" ry="34" fill={`url(#${id}-cloud)`} />
      <ellipse cx="470" cy="120" rx="120" ry="42" fill={`url(#${id}-cloud)`} />

      {/* trăng lưỡi liềm — đặt trên vùng trời trống, PHÍA TRÊN tuyến bay (không chạm đường bay) */}
      <circle cx="318" cy="60" r="30" fill={`url(#${id}-cloud)`} />
      <g transform="translate(297 39) scale(1.6)" opacity="0.9">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="#f6efc9" />
      </g>

      {/* tuyến bay: nét nền mờ */}
      <path d="M26 302 C 176 290 300 252 386 170 S 520 74 590 30" stroke="#5b78c8" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
      {/* vệt contrail chuyển động */}
      <path d="M26 302 C 176 290 300 252 386 170 S 520 74 590 30" stroke={`url(#${id}-trail)`} strokeWidth="2.4" strokeDasharray="1 9" strokeLinecap="round" className="animate-dash" />

      {/* điểm khởi hành */}
      <circle cx="26" cy="302" r="9" fill="#7cb8ff" opacity="0.2" />
      <circle cx="26" cy="302" r="3.4" fill="#cfe0ff" />

      {/* ghim điểm đến */}
      <g transform="translate(590 30)" opacity="0.95">
        <circle r="11" fill="#7cb8ff" opacity="0.16" />
        <path d="M0 -9c4.4 0 7.6 3.5 7.6 7.7 0 4.7-5.1 9.1-7.6 12.5-2.5-3.4-7.6-7.8-7.6-12.5C-7.6 -5.5 -4.4 -9 0 -9Z" fill="#e6f0ff" />
        <circle cy="-1.3" r="2.9" fill="#243a86" />
      </g>

      {/* máy bay: tâm đặt trên đường cong (≈ t·0.2 của đoạn 2), bồng bềnh nhẹ */}
      <g filter={`url(#${id}-glow)`}>
        <g transform="translate(432 128)">
          <animateTransform attributeName="transform" type="translate" additive="sum"
            values="0 0; 6 -6; 0 0" dur="6s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          <g transform="translate(-33 -33) scale(2.75) rotate(-3 12 12)">
            <path
              d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
              fill="#eef4ff"
              stroke="#c9dcff"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
