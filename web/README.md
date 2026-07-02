# ScholarFinder — Web Demo

Bản demo minh họa luồng nghiệp vụ tìm học bổng du học (xem tài liệu nghiệp vụ ở [`../docs`](../docs)).

> ⚠️ Dữ liệu học bổng, trường và giáo sư trong demo là **mẫu minh họa**, không dùng để nộp hồ sơ thật.

## Công nghệ
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Auth.js (đăng nhập Google) · i18next (đa ngôn ngữ VI/EN). State lưu ở `localStorage` (không cần backend cho demo).

## Đa ngôn ngữ (i18n)
Toàn bộ UI hỗ trợ **Tiếng Việt + English** (i18next + react-i18next, pattern tham khảo project `plucky`):
- `lib/i18n/languages.ts` — danh sách ngôn ngữ (một nguồn duy nhất); `lib/i18n/locales/{vi,en}.json` — file dịch.
- Ưu tiên: lựa chọn đã lưu (`localStorage`) > ngôn ngữ trình duyệt > mặc định VI. Đổi ngôn ngữ bằng bộ chọn 🇻🇳/🇬🇧 trên NavBar.
- Thêm ngôn ngữ mới: thêm entry vào `languages.ts` + file `locales/<code>.json` + đăng ký resource trong `lib/i18n/index.ts`.
- Lưu ý: **dữ liệu mẫu** (tên học bổng, quyền lợi, mô tả, loại mốc deadline…) vẫn là tiếng Việt — sản phẩm thật sẽ bản địa hóa ở tầng dữ liệu (pipeline crawl).

## Bảo vệ truy cập
Toàn site bị chặn bởi `proxy.ts` (Next 16 gọi middleware là *proxy*): chưa đăng nhập → chuyển về `/login`. Chỉ email trong `ALLOWED_EMAILS` mới vào được. Cần các biến môi trường: `AUTH_SECRET`, `ALLOWED_EMAILS`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (xem `.env.local`). Hướng dẫn deploy + tạo Google OAuth: [../docs/04-Huong-dan-Deploy-Vercel.md](../docs/04-Huong-dan-Deploy-Vercel.md).

## Chạy demo
```bash
cd web
npm install     # nếu chưa cài
npm run dev     # mở http://localhost:3000
```

## Các trang & ánh xạ tính năng ↔ tài liệu nghiệp vụ

| Trang | Chức năng minh họa | Tài liệu |
|---|---|---|
| `/start` — Bắt đầu (wizard) | **Tối ưu lựa chọn từng bước**: bậc học → ngành → điểm đến → học lực (quy đổi GPA thang 10→4, IELTS, GRE) → tài chính → ưu tiên (QS, giáo sư, kỳ nhập học) → xem trước số học bổng khớp; kết thúc tự thiết lập bộ lọc | BRD §7.1 (E1), 03 §3 (GĐ1) |
| `/` — Tìm học bổng | **Bộ lọc ngang dạng dropdown** (bấm mới xổ: khu vực, quốc gia, bậc học, ngành, mức tài trợ, loại HB, **trạng thái deadline**, **kỳ nhập học**) + **sidebar lọc nâng cao** (QS, ngưỡng IELTS, GRE, giáo sư, ngôn ngữ, tags), chips bộ lọc đang áp dụng, **URL phản ánh bộ lọc** (chia sẻ được), Match Score theo hồ sơ | BRD §7.2–7.3 (E2, E3), 03 §3 (GĐ1) |
| `/scholarships/[id]` — Chi tiết | Quyền lợi, **điều kiện + breakdown mức phù hợp**, **timeline kỳ nhập học/deadline**, giáo sư liên quan, **checklist chuẩn bị** (tick lưu tiến độ), **ghi chú cá nhân**, nguồn & độ tin cậy | BRD §7.4 (E4), 02 §A/§C, 03 §5–6 |
| `/scholarships/[id]/documents` — Trợ lý viết hồ sơ (E18) | Tự soạn **bản nháp tài liệu nộp** (CV, SOP/Motivation, Research Proposal, thư giới thiệu, 4 luận Chevening, Study Plan…) tùy giấy tờ học bổng yêu cầu — **cá nhân hóa** theo hồ sơ + giáo sư, sửa trực tiếp (lưu localStorage), **sao chép/tải .txt** để nộp, nối với cố vấn viết luận | BRD §7.x (E18), 03 §7 |
| `/compare` — So sánh | Chọn 2–4 học bổng (nút ⇄ trên thẻ) → **bảng so sánh cạnh nhau** (match, tài trợ, GPA/IELTS tối thiểu, deadline, QS…), đánh dấu tiêu chí "dễ nhất" | BRD §7.4 (FR-E4-03) |
| `/professors` — Danh sách giáo sư | Tìm theo tên/từ khóa nghiên cứu, lọc theo hướng NC / quốc gia / tình trạng tuyển, ưu tiên giáo sư đang tuyển NCS | 02 §B (E15) |
| `/professors/[id]` — Giáo sư | Hồ sơ đầy đủ (hướng NC, công bố, chỉ số, contact, Scholar/ORCID), **trợ lý soạn email liên hệ** (copy), học bổng liên quan | 02 §B (E15), 03 §6 (GĐ4) |
| `/board` — Bảng theo dõi | **Bảng + Kanban**, tự đổi trạng thái (dropdown / **kéo–thả**), **ghi chú cá nhân** từng học bổng, thống kê deadline & tiến độ hồ sơ | 02 §D (E17), 03 §D |
| `/profile` — Trang cá nhân (hub) | 4 tab: **Tổng quan** (thống kê: đang theo dõi/đã nộp/deadline gần/match TB, funnel theo giai đoạn, theo mức tài trợ & khu vực, deadline sắp tới), **Hồ sơ học tập** (đầy đủ: tên, quốc tịch, kỳ nhập học, kinh nghiệm… + % hoàn thiện), **Danh sách của tôi** (nhóm theo giai đoạn/mức tài trợ/khu vực/loại), **Hỗ trợ** (cố vấn phù hợp hồ sơ + kênh hỗ trợ) | BRD §7.1 (E1), §15 (E13) |

## Cấu trúc
```
web/
├─ app/
│  ├─ page.tsx                    # Trang tìm kiếm + bộ lọc (ngang + dọc, URL sync)
│  ├─ start/page.tsx              # Wizard "Bắt đầu" — tối ưu lựa chọn từng bước
│  ├─ compare/page.tsx            # So sánh 2–4 học bổng cạnh nhau
│  ├─ scholarships/[id]/page.tsx  # Chi tiết học bổng
│  ├─ professors/page.tsx         # Danh sách + bộ lọc giáo sư
│  ├─ professors/[id]/page.tsx    # Hồ sơ giáo sư
│  ├─ board/page.tsx              # Bảng theo dõi
│  ├─ profile/page.tsx            # Trang cá nhân (hub): thống kê + hồ sơ + danh sách + hỗ trợ
│  └─ layout.tsx                  # Layout + Provider + NavBar + CompareBar
├─ components/                    # NavBar, ScholarshipCard, FilterDropdown, CompareBar
└─ lib/                           # data.ts (dữ liệu mẫu + matchScore + helpers), store.tsx (state), ui.ts (helper)
```

## Ghi chú triển khai thật (ngoài phạm vi demo)
- Thay dữ liệu mẫu bằng **pipeline crawl/API + kiểm duyệt** (BRD §12, E11).
- Thêm backend (PostgreSQL) + tìm kiếm (Meilisearch) + auth.
- **E18 (trợ lý viết hồ sơ)** hiện dùng template có luật; bản thật có thể nâng lên LLM (Claude) để sinh & góp ý nội dung theo hồ sơ thực. **E19 (tự động hóa/alert)** vẫn ở mức minh họa.
