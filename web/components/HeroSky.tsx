// Trang trí bầu trời cho các hero nền tối: trăng lưỡi liềm + tuyến bay cong tự nhiên
// (điểm khởi hành, ghim điểm đến, vệt contrail chuyển động) + máy bay du lịch thanh thoát
// bay bồng bềnh dọc tuyến. Dùng chung; đặt bên trong khối hero (relative overflow-hidden).

export default function HeroSky({ id = "hs" }: { id?: string }) {
  return (
    <>
      {/* Trăng lưỡi liềm */}
      <div className="pointer-events-none absolute right-11 top-8 text-[#f6efc9] opacity-90 drop-shadow-[0_0_18px_rgba(246,239,201,0.55)]">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" /></svg>
      </div>

      {/* Tuyến bay cong mượt + điểm khởi hành + ghim điểm đến + máy bay */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-[68%]"
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
        </defs>

        {/* tuyến bay: nét nền mờ */}
        <path d="M26 300 C 176 288 300 250 386 168 S 524 58 592 20" stroke="#5b78c8" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
        {/* vệt contrail chuyển động */}
        <path d="M26 300 C 176 288 300 250 386 168 S 524 58 592 20" stroke={`url(#${id}-trail)`} strokeWidth="2.4" strokeDasharray="1 9" strokeLinecap="round" className="animate-dash" />

        {/* điểm khởi hành (thành phố xuất phát) */}
        <circle cx="26" cy="300" r="9" fill="#7cb8ff" opacity="0.2" />
        <circle cx="26" cy="300" r="3.4" fill="#cfe0ff" />

        {/* ghim điểm đến */}
        <g transform="translate(592 20)" opacity="0.95">
          <circle r="11" fill="#7cb8ff" opacity="0.16" />
          <path d="M0 -9c4.4 0 7.6 3.5 7.6 7.7 0 4.7-5.1 9.1-7.6 12.5-2.5-3.4-7.6-7.8-7.6-12.5C-7.6 -5.5 -4.4 -9 0 -9Z" fill="#e6f0ff" />
          <circle cy="-1.3" r="2.9" fill="#243a86" />
        </g>

        {/* máy bay bồng bềnh dọc tuyến */}
        <g filter={`url(#${id}-glow)`}>
          <g transform="translate(468 118)">
            <animateTransform attributeName="transform" type="translate" additive="sum"
              values="0 0; 7 -6; 0 0" dur="6s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            <g transform="translate(-36 -36) scale(3) rotate(-4 12 12)">
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
    </>
  );
}
