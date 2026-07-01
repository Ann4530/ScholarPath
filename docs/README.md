# ScholarFinder — Bộ tài liệu nghiệp vụ

Nền tảng web tìm kiếm **học bổng du học**, **kỳ nhập học**, **cá nhân hóa theo hồ sơ user**, kèm module **tìm giáo sư hướng dẫn**, **cẩm nang chuẩn bị hồ sơ** và **bảng theo dõi trạng thái**.

## Mục lục tài liệu

| Tài liệu | Nội dung |
|---|---|
| [01 — Tài liệu nghiệp vụ (BRD)](./01-Tai-lieu-nghiep-vu-BRD.md) | Tài liệu nghiệp vụ chính: mục tiêu, personas, tính năng (E1–E13), yêu cầu chức năng/phi chức năng, luồng nghiệp vụ, mô hình dữ liệu, thuật toán cá nhân hóa, kiến trúc kỹ thuật đề xuất, pháp lý, KPI, roadmap, rủi ro. |
| [02 — Bổ sung: Phân loại · Giáo sư · Chuẩn bị · Theo dõi](./02-Bo-sung-Phan-loai-GiaoSu-ChuanBi-TheoDoi.md) | 4 module mở rộng (E14–E17): phân loại học bổng, module giáo sư/người hướng dẫn, cẩm nang chuẩn bị hồ sơ, bảng theo dõi trạng thái. |
| [03 — Kịch bản hành trình User (End-to-End)](./03-Kich-ban-nghiep-vu-Hanh-trinh-User-End-to-End.md) | **Flow hoàn chỉnh theo góc nhìn user**: 9 giai đoạn từ khai báo hồ sơ → tự chọn tiêu chí (khu vực/hạng trường/khoa/ngành/loại HB) → chọn lọc → nghiên cứu → giáo sư → checklist → viết hồ sơ (E18) → nộp → kết quả → visa/lên đường; kèm tự động hóa (E19) & mô hình dữ liệu Trường/Khoa/Ngành/Hạng/Giáo sư. |
| [04 — Hướng dẫn Deploy Vercel + giới hạn truy cập](./04-Huong-dan-Deploy-Vercel.md) | Các bước đưa web demo lên Vercel và **chặn truy cập bằng đăng nhập Google + allowlist email** (Auth.js). |

## Định hướng đã chốt
- **Thị trường:** đa khu vực (Âu – Mỹ/Canada/Anh/Úc – Á), hướng tới toàn cầu.
- **Dữ liệu:** thu thập tự động (crawl/API) + kiểm duyệt trước khi hiển thị.
- **Công nghệ (đề xuất):** Next.js + PostgreSQL + Meilisearch + crawler Python (xem §13 tài liệu 01).

## Trải nghiệm cốt lõi (end-to-end)
Tìm học bổng phù hợp → xem điều kiện & kỳ nhập học → tìm giáo sư hướng dẫn (HB nghiên cứu) → nhận checklist chuẩn bị "đọc là làm theo" → theo dõi tiến độ trên bảng trạng thái đến khi có kết quả.

## Website demo
Đã dựng bản demo chạy được (Next.js) tại thư mục [`../web`](../web) — minh họa: trang tìm kiếm + bộ lọc + Match Score, chi tiết học bổng (deadline, giáo sư, checklist), hồ sơ giáo sư + trợ lý email, và bảng theo dõi Kanban.
```bash
cd web && npm run dev   # http://localhost:3000
```
Xem [web/README.md](../web/README.md) để biết ánh xạ tính năng ↔ tài liệu.

**Bảo vệ truy cập:** site đã được chặn bằng đăng nhập Google + danh sách email cho phép (chỉ người được duyệt mới vào). Cách deploy & cấu hình: [04 — Hướng dẫn Deploy](./04-Huong-dan-Deploy-Vercel.md).

## Việc cần chốt tiếp theo
Xem §19 (tài liệu 01) và §E.5 (tài liệu 02) — chốt danh sách nguồn crawl ưu tiên & phạm vi quốc gia MVP.
