# ScholarFinder — Web Demo

Bản demo minh họa luồng nghiệp vụ tìm học bổng du học (xem tài liệu nghiệp vụ ở [`../docs`](../docs)).

> ⚠️ Dữ liệu học bổng, trường và giáo sư trong demo là **mẫu minh họa**, không dùng để nộp hồ sơ thật.

## Công nghệ
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. State lưu ở `localStorage` (không cần backend cho demo).

## Chạy demo
```bash
cd web
npm install     # nếu chưa cài
npm run dev     # mở http://localhost:3000
```

## Các trang & ánh xạ tính năng ↔ tài liệu nghiệp vụ

| Trang | Chức năng minh họa | Tài liệu |
|---|---|---|
| `/` — Tìm học bổng | Bộ lọc đa tiêu chí (khu vực, quốc gia, bậc học, mức tài trợ, loại HB, ngành, **hạng trường QS**, cần giáo sư), chấm **Match Score** theo hồ sơ, chỉnh hồ sơ trực tiếp | BRD §7.2–7.3 (E2, E3), 03 §3 (GĐ1) |
| `/scholarships/[id]` — Chi tiết | Quyền lợi, **điều kiện + breakdown mức phù hợp**, **timeline kỳ nhập học/deadline**, giáo sư liên quan, **checklist chuẩn bị** (tick lưu tiến độ), nguồn & độ tin cậy | BRD §7.4 (E4), 02 §A/§C, 03 §5–6 |
| `/professors/[id]` — Giáo sư | Hồ sơ đầy đủ (hướng NC, công bố, chỉ số, contact, Scholar/ORCID), **trợ lý soạn email liên hệ** (copy), học bổng liên quan | 02 §B (E15), 03 §6 (GĐ4) |
| `/board` — Bảng theo dõi | **Bảng + Kanban**, tự đổi trạng thái (dropdown / **kéo–thả**), thống kê deadline & tiến độ hồ sơ | 02 §D (E17), 03 §D |

## Cấu trúc
```
web/
├─ app/
│  ├─ page.tsx                    # Trang tìm kiếm + bộ lọc
│  ├─ scholarships/[id]/page.tsx  # Chi tiết học bổng
│  ├─ professors/[id]/page.tsx    # Hồ sơ giáo sư
│  ├─ board/page.tsx              # Bảng theo dõi
│  └─ layout.tsx                  # Layout + Provider + NavBar
├─ components/                    # NavBar, ScholarshipCard
└─ lib/                           # data.ts (dữ liệu mẫu + matchScore), store.tsx (state), ui.ts (helper)
```

## Ghi chú triển khai thật (ngoài phạm vi demo)
- Thay dữ liệu mẫu bằng **pipeline crawl/API + kiểm duyệt** (BRD §12, E11).
- Thêm backend (PostgreSQL) + tìm kiếm (Meilisearch) + auth.
- Module **E18 (trợ lý viết hồ sơ)** và **E19 (tự động hóa/alert)** hiện mới ở mức minh họa.
