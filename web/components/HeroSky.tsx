// Bầu trời hero du học = THANH TIẾN ĐỘ hành trình.
// Đường bay đi từ điểm khởi hành (dưới-trái) tới ghim điểm đến (trên-phải);
// máy bay đứng ở vị trí = % công việc du học đã hoàn thành:
//  - đoạn SAU lưng máy bay (đã đi): nét sáng
//  - đoạn TRƯỚC (còn lại): nét mờ, đứt
// Đuôi ghim điểm đến nằm đúng cuối line. Không có mặt trăng.

type Pt = { x: number; y: number };
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const f1 = (n: number) => Math.round(n * 10) / 10;

export default function HeroSky({ id = "hs", progress = 35, showPct = false }: { id?: string; progress?: number; showPct?: boolean }) {
  const t = Math.max(0.05, Math.min(0.93, (progress || 0) / 100));
  // 1 đường cong Bézier dạng chữ S: bắt đầu lệch phải (tránh bị nội dung bên trái che),
  // phẳng ở đầu → dốc ở giữa → thoải về đích.
  const P0: Pt = { x: 205, y: 300 };
  const P1: Pt = { x: 350, y: 302 };
  const P2: Pt = { x: 372, y: 80 };
  const P3: Pt = { x: 558, y: 48 };
  // De Casteljau: tách đường tại t (vị trí máy bay)
  const A = lerp(P0, P1, t), B = lerp(P1, P2, t), C = lerp(P2, P3, t);
  const D = lerp(A, B, t), E = lerp(B, C, t), F = lerp(D, E, t); // F = điểm máy bay
  const done = `M${f1(P0.x)} ${f1(P0.y)} C ${f1(A.x)} ${f1(A.y)} ${f1(D.x)} ${f1(D.y)} ${f1(F.x)} ${f1(F.y)}`;
  const rest = `M${f1(F.x)} ${f1(F.y)} C ${f1(E.x)} ${f1(E.y)} ${f1(C.x)} ${f1(C.y)} ${f1(P3.x)} ${f1(P3.y)}`;
  const ang = Math.round((Math.atan2(F.y - D.y, F.x - D.x) * 180) / Math.PI + 45);
  const pct = Math.round(progress || 0);

  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 h-full w-[72%]"
      viewBox="0 0 600 320"
      fill="none"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-done`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8fc0ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#eaf2ff" stopOpacity="0.95" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#050a1f" floodOpacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#8cbaff" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* vài vì sao nhỏ (không mây, không trăng) */}
      <circle cx="150" cy="70" r="1.8" fill="#fff" opacity="0.7" />
      <circle cx="360" cy="60" r="1.5" fill="#cfe0ff" opacity="0.75" />
      <circle cx="300" cy="200" r="1.5" fill="#fff" opacity="0.55" />

      {/* đoạn CÒN LẠI (chưa đi) — mờ, đứt */}
      <path d={rest} stroke="#8098d4" strokeOpacity="0.42" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />
      {/* đoạn ĐÃ ĐI — sáng */}
      <path d={done} stroke={`url(#${id}-done)`} strokeWidth="2.6" strokeDasharray="1 8" strokeLinecap="round" />

      {/* điểm khởi hành */}
      <circle cx={P0.x} cy={P0.y} r="8.5" fill="#7cb8ff" opacity="0.2" />
      <circle cx={P0.x} cy={P0.y} r="3.4" fill="#cfe0ff" />

      {/* ghim điểm đến — đuôi (tip) nằm đúng cuối line tại P3 */}
      <g transform={`translate(${P3.x} ${P3.y})`}>
        <path d="M0 0 C -5 -9 -10 -13 -10 -20 A 10 10 0 1 1 10 -20 C 10 -13 5 -9 0 0 Z" fill="#e6f0ff" stroke="#b9d2f7" strokeWidth="1" />
        <circle cx="0" cy="-20" r="3.6" fill="#243a86" />
      </g>

      {/* nhãn % tiến độ (đặt trên máy bay) — chỉ hiện khi có ngữ cảnh tiến độ */}
      {showPct && (
        <g transform={`translate(${f1(F.x)} ${f1(F.y - 42)})`}>
          <rect x="-21" y="-13" width="42" height="22" rx="11" fill="#0b1533" opacity="0.85" stroke="#5a78c8" strokeWidth="1" strokeOpacity="0.6" />
          <text x="0" y="3" textAnchor="middle" fontSize="12" fontWeight="800" fill="#eaf2ff" fontFamily="inherit">{pct}%</text>
        </g>
      )}

      {/* máy bay tại vị trí % — xoay theo hướng bay, bồng bềnh nhẹ */}
      <g filter={`url(#${id}-glow)`} transform={`translate(${f1(F.x)} ${f1(F.y)})`}>
        <g transform={`rotate(${ang})`}>
          <animateTransform attributeName="transform" type="translate" additive="sum"
            values="0 0; 0 -5; 0 0" dur="6s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          <g transform="translate(-32.4 -32.4) scale(2.7)">
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
