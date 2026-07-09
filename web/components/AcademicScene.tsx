// Minh họa học thuật cho hero trang Giáo sư: mũ tốt nghiệp đặt trên sách mở + ống nghiệm (lab)
// — gợi hình ảnh người hướng dẫn & nghiên cứu. Vẽ dạng line + fill mờ theo tông xanh/trắng.

export default function AcademicScene({ id = "as", className = "" }: { id?: string; className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute right-2 top-1/2 h-[150%] max-h-[300px] -translate-y-1/2 ${className}`}
      viewBox="0 0 340 300"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.52" cy="0.46" r="0.55">
          <stop offset="0" stopColor="#7cb8ff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#7cb8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f7ff" />
          <stop offset="1" stopColor="#bcd3ff" />
        </linearGradient>
      </defs>

      <circle cx="176" cy="140" r="126" fill={`url(#${id}-glow)`} />

      {/* sao lấp lánh */}
      <circle cx="60" cy="70" r="2" fill="#fff" opacity="0.8" />
      <circle cx="300" cy="90" r="1.6" fill="#cfe0ff" opacity="0.8" />
      <circle cx="280" cy="220" r="1.8" fill="#fff" opacity="0.7" />

      {/* sách mở */}
      <g stroke="#cfe0ff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M58 210 C 98 194 140 194 168 210 C 196 194 238 194 278 210 L 278 256 C 238 240 196 240 168 256 C 140 240 98 240 58 256 Z" fill="#243a86" fillOpacity="0.42" />
        <path d="M168 210 L168 256" />
        <path d="M78 214 C 108 204 138 205 158 214" strokeOpacity="0.45" fill="none" />
        <path d="M178 214 C 198 205 228 204 258 214" strokeOpacity="0.45" fill="none" />
      </g>

      {/* mũ tốt nghiệp đặt trên sách */}
      <g transform="translate(168 150)">
        {/* thân mũ */}
        <path d="M-28 22 L-28 40 C -28 50 28 50 28 40 L28 22 L0 33 Z" fill="#dbe9ff" stroke="#aecaf5" strokeWidth="2" strokeLinejoin="round" />
        {/* bảng mũ */}
        <path d="M0 -10 L60 14 L0 38 L-60 14 Z" fill={`url(#${id}-cap)`} stroke="#aecaf5" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="0" cy="14" r="4" fill="#243a86" />
        {/* dây tua */}
        <path d="M0 14 L40 20 L40 52" stroke="#ffd27a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="56" r="5" fill="#ffd27a" />
      </g>

      {/* ống nghiệm (lab) */}
      <g transform="translate(266 148)">
        <path d="M-6 -34 L-6 -14 L-24 20 C -27 27 -22 34 -14 34 L14 34 C 22 34 27 27 24 20 L6 -14 L6 -34 Z" fill="#243a86" fillOpacity="0.5" stroke="#cfe0ff" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M-17 8 L17 8 L24 20 C 27 27 22 34 14 34 L-14 34 C -22 34 -27 27 -24 20 Z" fill="#7cb8ff" fillOpacity="0.5" />
        <line x1="-10" y1="-34" x2="10" y2="-34" stroke="#cfe0ff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="-4" cy="16" r="2.6" fill="#eaf2ff" opacity="0.9" />
        <circle cx="6" cy="24" r="2" fill="#eaf2ff" opacity="0.85" />
        <circle cx="2" cy="10" r="1.6" fill="#eaf2ff" opacity="0.8" />
      </g>
    </svg>
  );
}
