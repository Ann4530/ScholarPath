# TÀI LIỆU NGHIỆP VỤ (BỔ SUNG) — v1.1
# Module mở rộng: Phân loại Học bổng · Giáo sư/Người hướng dẫn · Cẩm nang Chuẩn bị · Bảng Theo dõi Trạng thái

> Tài liệu này **bổ sung** cho `01-Tai-lieu-nghiep-vu-BRD.md`. Các mã Epic mới tiếp nối: **E14–E17**.
> Mục tiêu chung của các module này: **user chỉ cần đọc và làm theo** — từ chọn học bổng → tìm giáo sư → chuẩn bị đủ hồ sơ → theo dõi tiến độ đến khi có kết quả.

---

## 0. Thông tin tài liệu

| Hạng mục | Nội dung |
|---|---|
| **Phiên bản** | v1.1 (Draft) |
| **Ngày lập** | 01/07/2026 |
| **Liên quan** | Mở rộng BRD v1.0 (Epics E14–E17) |
| **Trạng thái** | Bản thảo để review |

**Tóm tắt 4 module mới**

| Mã | Module | Giải quyết nhu cầu |
|---|---|---|
| **E14** | Phân loại & Gắn thẻ Học bổng (Taxonomy) | Phân loại học bổng đa chiều để lọc, so khớp và biết học bổng nào cần liên hệ giáo sư |
| **E15** | Giáo sư / Người hướng dẫn (Supervisor Finder) | Tìm & tổng hợp **toàn bộ** thông tin giáo sư phù hợp; hỗ trợ liên hệ |
| **E16** | Cẩm nang Chuẩn bị Hồ sơ (Preparation Playbook) | Danh sách + hướng dẫn + template + timeline để user làm theo từng bước |
| **E17** | Bảng Theo dõi Trạng thái (Application Board) | Bảng thống kê + Kanban để user tự chuyển trạng thái, theo dõi dễ dàng |

---

# PHẦN A — E14: PHÂN LOẠI & GẮN THẺ HỌC BỔNG (Scholarship Taxonomy)

## A.1. Mục tiêu
Xây dựng hệ **phân loại đa chiều** cho mỗi học bổng để: (1) lọc/tìm chính xác, (2) tăng chất lượng Match Score, (3) tự động nhận biết học bổng **có cần liên hệ giáo sư** hay không (liên kết E15), (4) sinh **checklist chuẩn bị** phù hợp (liên kết E16).

## A.2. Các chiều phân loại (Classification Dimensions)

| # | Chiều phân loại | Giá trị (values) | Ghi chú |
|---|---|---|---|
| D1 | **Mức tài trợ** | Toàn phần / Bán phần / Chỉ học phí / Chỉ sinh hoạt phí (stipend) / Một lần (one-time) | Quyền lợi chi tiết lưu riêng |
| D2 | **Nhà tài trợ** | Chính phủ / Trường ĐH / Tổ chức–Quỹ / Doanh nghiệp / Liên chính phủ (EU, ASEAN…) | |
| D3 | **Bậc học** | Cử nhân / Thạc sĩ (coursework) / Thạc sĩ (research) / Tiến sĩ / Sau tiến sĩ / Trao đổi / Nghề | Quyết định có cần giáo sư |
| D4 | **Tính chất xét tuyển** | Thành tích (merit) / Nhu cầu tài chính (need-based) / Nghiên cứu (research-based) / Tài năng (thể thao–nghệ thuật) / Đối tượng đặc thù (nữ, nước đang phát triển, ngành ưu tiên…) | |
| D5 | **Lĩnh vực/Ngành** | Theo danh mục chuẩn (ISCED/CIP): CNTT, Kinh tế, Y, Kỹ thuật, KHXH… + "Mọi ngành" | Đa chọn |
| D6 | **Quốc gia / Khu vực** | ISO country; nhóm khu vực (Âu, Bắc Mỹ, Á, Úc…) | |
| D7 | **Đối tượng quốc tịch** | Có nhận VN? / Danh sách quốc tịch đủ điều kiện / Nước đang phát triển… | Hard filter cho Match |
| D8 | **Yêu cầu liên hệ giáo sư** | Bắt buộc / Khuyến khích / Không cần | **Trường then chốt** kích hoạt E15 |
| D9 | **Yêu cầu đề cương nghiên cứu** | Có / Không | Kích hoạt checklist Research Proposal ở E16 |
| D10 | **Ràng buộc sau tốt nghiệp** | Cam kết về nước / Không ràng buộc / Làm việc cho nhà tài trợ | Nhiều HB chính phủ có ràng buộc |
| D11 | **Ngôn ngữ giảng dạy** | Tiếng Anh / Bản ngữ / Song ngữ | |
| D12 | **Trạng thái deadline** | Sắp mở / Đang mở / Sắp hết hạn / Đã đóng / Rolling (nộp quanh năm) | Tự cập nhật theo ngày |
| D13 | **Độ khó/cạnh tranh (ước tính)** | Cao / Trung bình / Thấp | Gợi ý, gắn nhãn "ước tính" |

## A.3. Hệ thẻ (Tagging)
- Ngoài các chiều chuẩn, hỗ trợ **thẻ tự do** cho tình huống đặc thù: `#full-ride`, `#no-IELTS`, `#no-application-fee`, `#for-women-in-STEM`, `#DAAD`, `#MEXT`, `#Erasmus`, `#PhD-with-supervisor`…
- Thẻ do Admin gắn hoặc pipeline tự suy luận (rule-based/LLM có kiểm duyệt).

## A.4. Yêu cầu chức năng
**FR-E14-01 — Gán phân loại tự động + kiểm duyệt**
- *AC:* Pipeline (E11) tự suy ra D1–D13 từ dữ liệu crawl; Admin xác nhận/sửa trong Moderation Queue trước khi publish. Trường **D8 (cần giáo sư)** phải được xác nhận thủ công nếu độ tin cậy thấp.

**FR-E14-02 — Lọc & duyệt theo phân loại**
- *AC:* Mọi chiều D1–D13 dùng làm bộ lọc (facet) ở E2; hiển thị badge phân loại trên thẻ học bổng & trang chi tiết.

**FR-E14-03 — Liên kết phân loại → module khác**
- *AC:*
  - Nếu `D8 = Bắt buộc/Khuyến khích` → trang chi tiết hiển thị khối **"Tìm giáo sư phù hợp"** (E15).
  - Phân loại D3/D4/D9 → sinh **checklist chuẩn bị** tương ứng (E16). Ví dụ: PhD research → thêm mục *Research Proposal*, *Liên hệ giáo sư*.

---

# PHẦN B — E15: GIÁO SƯ / NGƯỜI HƯỚNG DẪN (Supervisor Finder)

## B.1. Bối cảnh nghiệp vụ
Với **học bổng nghiên cứu** (PhD, Thạc sĩ research, nhiều học bổng chính phủ như MEXT, một số DAAD, CSC…), ứng viên thường phải **tìm và liên hệ giáo sư hướng dẫn (supervisor)** *trước hoặc trong khi* nộp hồ sơ. Đây là bước khó và tốn thời gian nhất. Module này giúp user:
- Tìm giáo sư đúng hướng nghiên cứu tại các trường/chương trình liên quan học bổng.
- Xem **toàn bộ thông tin** giáo sư ở một nơi.
- Được hỗ trợ **soạn email liên hệ** và **theo dõi trạng thái liên hệ**.

## B.2. Thông tin giáo sư cần tổng hợp (Professor Profile — "tất cả thông tin")

| Nhóm | Trường thông tin |
|---|---|
| **Định danh** | Họ tên, chức danh (Prof./Assoc. Prof./Dr.), ảnh (nếu công khai) |
| **Đơn vị** | Trường, khoa/bộ môn, phòng thí nghiệm/nhóm nghiên cứu, quốc gia, thành phố |
| **Hướng nghiên cứu** | Lĩnh vực, chủ đề/keyword nghiên cứu, tóm tắt hướng NC |
| **Liên hệ** | Email công khai, trang web cá nhân/lab, form liên hệ |
| **Hồ sơ học thuật** | Google Scholar, ORCID, ResearchGate, Semantic Scholar, OpenAlex, LinkedIn |
| **Chỉ số** | Số công bố, trích dẫn, h-index, i10-index (ghi rõ "nguồn & thời điểm") |
| **Công bố tiêu biểu** | 5–10 bài gần đây/nổi bật (tiêu đề, năm, tạp chí/hội nghị, DOI, link) |
| **Dự án/Đề tài** | Đề tài đang thực hiện, nguồn tài trợ (nếu công khai) |
| **Giảng dạy** | Môn giảng dạy (nếu có) |
| **Tuyển nghiên cứu sinh** | Tình trạng nhận NCS/postdoc (nếu công bố) — gắn nhãn *"Đang tuyển / Không rõ"* |
| **Liên kết học bổng** | Học bổng/chương trình mà giáo sư này thuộc về (liên kết E14/E4) |
| **Nguồn & cập nhật** | Link nguồn gốc từng thông tin + `last_verified_at` |

> ⚠️ **Chỉ tổng hợp thông tin nghề nghiệp công khai.** Email cá nhân chỉ lấy từ trang chính thức của trường/lab. Tôn trọng yêu cầu gỡ thông tin (opt-out) — xem B.7.

## B.3. Yêu cầu chức năng

**FR-E15-01 — Tìm kiếm giáo sư**
- *User story:* Là ứng viên nghiên cứu, tôi muốn tìm giáo sư theo hướng nghiên cứu/trường/quốc gia để chọn người liên hệ.
- *AC:* Tìm theo keyword nghiên cứu, tên, trường, quốc gia, lĩnh vực; lọc theo "đang tuyển NCS (nếu biết)", "gắn với học bổng X".

**FR-E15-02 — Hồ sơ giáo sư (Professor Profile Page)**
- *AC:* Hiển thị đầy đủ B.2; mỗi thông tin có **link nguồn**; nút mở Google Scholar/ORCID/web lab; cảnh báo nếu dữ liệu cũ.

**FR-E15-03 — Gợi ý giáo sư phù hợp hồ sơ user (Professor Match)**
- *User story:* Dựa trên **hướng nghiên cứu/ngành** trong hồ sơ user, gợi ý giáo sư phù hợp.
- *AC:* Chấm độ liên quan giữa keyword nghiên cứu của user và của giáo sư (dựa trên lĩnh vực + chủ đề công bố); hiển thị lý do gợi ý ("Cùng chủ đề: Machine Learning, Computer Vision"). Xếp theo độ liên quan.

**FR-E15-04 — Liên kết Giáo sư ↔ Học bổng/Chương trình/Trường**
- *AC:* Từ trang học bổng research (D8≠Không cần) → khối "Giáo sư tiềm năng tại các trường liên quan"; ngược lại từ trang giáo sư → "Học bổng có thể áp dụng".

**FR-E15-05 — Trợ lý liên hệ giáo sư (Outreach Helper)**
- *User story:* Tôi muốn được hỗ trợ viết email liên hệ giáo sư đúng chuẩn.
- *AC:*
  - Cung cấp **mẫu email** (cold email) theo cấu trúc chuẩn (xem B.5), tự điền tên GS/hướng NC/tên user.
  - Checklist trước khi gửi (đã đọc 1–2 bài của GS chưa, đã nêu vì sao phù hợp chưa, đính kèm CV chưa…).
  - **Không gửi hộ hàng loạt.** Chỉ hỗ trợ soạn; user tự gửi từ email cá nhân (tránh spam — B.7).
  - Gợi ý cá nhân hóa: nhắc user tham chiếu 1 công bố cụ thể của GS.

**FR-E15-06 — Theo dõi trạng thái liên hệ giáo sư**
- *AC:* Với mỗi giáo sư đã lưu: trạng thái *Chưa liên hệ → Đã gửi email → Đã phản hồi → Đồng ý hướng dẫn → Từ chối/Không phản hồi*; ghi ngày gửi, ngày follow-up, ghi chú. **Đồng bộ với Bảng theo dõi E17.**

**FR-E15-07 — Lưu & so sánh giáo sư**
- *AC:* Lưu danh sách "Giáo sư mục tiêu"; so sánh 2–4 GS (hướng NC, chỉ số, trường, học bổng liên quan, tình trạng tuyển).

## B.4. Mô hình dữ liệu (bổ sung)

**Professor**
- `id`, `full_name`, `title`, `photo_url?`, `institution_id`, `department`, `lab_name?`, `country`, `city?`
- `research_fields[]`, `research_keywords[]`, `research_summary?`
- `email_public?`, `personal_site?`, `lab_site?`
- `profiles` (JSON: google_scholar, orcid, researchgate, semantic_scholar, openalex, linkedin)
- `metrics` (JSON: publications_count, citations, h_index, i10, source, as_of_date)
- `recruiting_status` (recruiting / unknown / not_recruiting), `recruiting_source?`
- `source_ids[]`, `trust_score`, `last_verified_at`, `status` (published/hidden), `opt_out` (bool)

**Publication** (tối giản, tham chiếu)
- `id`, `professor_id`, `title`, `year`, `venue`, `doi?`, `url?`, `citation_count?`

**ProfessorScholarshipLink** — n–n giữa Professor và Scholarship/Program/Institution.

**UserProfessorTracking**
- `id`, `user_id`, `professor_id`, `contact_status`, `email_sent_at?`, `followup_at?`, `note`, `linked_scholarship_id?`

## B.5. Mẫu email liên hệ giáo sư (khung template — dùng cho E15-05)
```
Chủ đề: Prospective PhD applicant interested in your research on [chủ đề]

Kính gửi Prof. [Họ tên],

Em là [Tên], [học vấn/nền tảng ngắn gọn]. Em đặc biệt quan tâm tới hướng
nghiên cứu [chủ đề cụ thể] của thầy/cô, đặc biệt bài "[tên 1 công bố]" ([năm]).

Em dự định ứng tuyển [bậc học] tại [trường] cho kỳ [intake], sử dụng học bổng
[tên học bổng]. Nền tảng của em phù hợp vì [1–2 lý do: kỹ năng, dự án, điểm số].

Em xin đính kèm CV và [research proposal tóm tắt/bảng điểm]. Không biết thầy/cô
có nhận nghiên cứu sinh cho kỳ tới không ạ? Em rất mong có cơ hội trao đổi thêm.

Trân trọng cảm ơn,
[Tên] — [email] — [link hồ sơ/CV]
```
*Nguyên tắc: ngắn gọn, cá nhân hóa, tham chiếu công bố cụ thể, đính kèm CV, một câu hỏi rõ ràng.*

## B.6. Nguồn dữ liệu giáo sư (Data Sources)
| Nguồn | Loại | Ưu tiên | Ghi chú pháp lý/kỹ thuật |
|---|---|---|---|
| **OpenAlex** (API mở) | API | Cao | Miễn phí, dữ liệu tác giả/công bố/đơn vị — nguồn chính khuyến nghị |
| **Semantic Scholar** (API) | API | Cao | Miễn phí, hồ sơ tác giả & bài báo |
| **ORCID** (API công khai) | API | Cao | Hồ sơ nhà nghiên cứu do chính họ công khai |
| **Crossref** | API | Trung | DOI/metadata công bố |
| **Trang khoa/giảng viên của trường** | Crawl HTML | Trung | Lấy email công khai, hướng NC, lab; tôn trọng robots.txt |
| **Google Scholar** | Web | Thấp/Tránh | **Không có API chính thức, ToS hạn chế scraping** → chỉ để link ra ngoài, không tự crawl hàng loạt |
| **ResearchGate / LinkedIn** | Web | Tránh crawl | ToS hạn chế → chỉ lưu link do user/Admin thêm |

> Chiến lược: dựng hồ sơ giáo sư chủ yếu từ **OpenAlex + Semantic Scholar + ORCID + trang trường** (hợp pháp, có API), rồi **link ra** Google Scholar/ResearchGate thay vì cào dữ liệu.

## B.7. Pháp lý & Đạo đức (Professor data — QUAN TRỌNG)
- **Dữ liệu cá nhân:** Thông tin giáo sư là dữ liệu cá nhân → tuân thủ ND13/2023 & GDPR. Chỉ dùng **thông tin nghề nghiệp công khai**, mục đích chính đáng (kết nối học thuật).
- **Chống spam/quấy rối:** Nền tảng **không gửi email hàng loạt thay user**; chỉ hỗ trợ soạn thư cá nhân hóa. Có hướng dẫn "liên hệ có trách nhiệm".
- **Quyền gỡ (opt-out):** Giáo sư có thể yêu cầu ẩn/gỡ hồ sơ (`opt_out`); có kênh liên hệ & quy trình xử lý nhanh.
- **Minh bạch nguồn:** Mọi trường thông tin gắn nguồn + ngày cập nhật; email chỉ hiển thị nếu được công khai chính thức.
- **Không dùng cho mục đích khác** (marketing, bán dữ liệu).

---

# PHẦN C — E16: CẨM NANG CHUẨN BỊ HỒ SƠ (Application Preparation Playbook)

## C.1. Mục tiêu
Với mỗi học bổng user chọn, hệ thống sinh **danh sách việc cần chuẩn bị đầy đủ + hướng dẫn + template + mốc thời gian**, cá nhân hóa theo hồ sơ user và phân loại học bổng (E14). Tinh thần: **"đọc là làm theo được"**.

## C.2. Danh mục hồ sơ tổng (Master Document Checklist)
> Hệ thống chọn lọc mục phù hợp theo phân loại học bổng/bậc học; dưới đây là danh mục đầy đủ.

| # | Tài liệu | Áp dụng khi | Ghi chú/độ khó |
|---|---|---|---|
| 1 | **CV/Résumé học thuật** | Luôn | Có template theo bậc học |
| 2 | **SOP / Statement of Purpose / Personal Statement** | Luôn | Quan trọng nhất; có dàn ý mẫu |
| 3 | **Motivation Letter** | Nhiều HB châu Âu | Khác SOP đôi chút |
| 4 | **Research Proposal / Đề cương nghiên cứu** | D9 = Có (research/PhD) | Khó; có cấu trúc mẫu |
| 5 | **Thư giới thiệu (LOR)** | Luôn (2–3 thư) | Cần xin sớm từ giảng viên/sếp |
| 6 | **Bảng điểm (Transcript)** | Luôn | Bản chính thức + dịch thuật công chứng |
| 7 | **Bằng/Giấy chứng nhận tốt nghiệp** | Luôn (hoặc giấy dự kiến TN) | Dịch công chứng |
| 8 | **Chứng chỉ ngoại ngữ (IELTS/TOEFL…)** | Hầu hết | Kiểm tra hạn 2 năm |
| 9 | **Điểm chuẩn hóa (GRE/GMAT/SAT)** | Tùy trường/ngành | |
| 10 | **Hộ chiếu** | Luôn | Còn hạn đủ dài |
| 11 | **Chứng minh tài chính** | Một số HB bán phần/visa | |
| 12 | **Portfolio / Writing sample** | Ngành nghệ thuật/nghiên cứu | |
| 13 | **Đơn đăng ký (Application form)** | Luôn | Điền theo cổng của trường/HB |
| 14 | **Lệ phí nộp hồ sơ** | Tùy | Một số miễn phí |
| 15 | **Giấy tờ đặc thù** | Theo nước/HB | VD: **APS** (Đức/Trung), thư đề cử, giấy khám sức khỏe |

## C.3. Yêu cầu chức năng

**FR-E16-01 — Checklist chuẩn bị cá nhân hóa**
- *User story:* Với học bổng đã lưu, tôi muốn thấy đúng những gì **tôi** cần chuẩn bị.
- *AC:*
  - Sinh checklist từ: yêu cầu học bổng (E4) + phân loại (E14) + hồ sơ user (đã có IELTS chưa, đã có bằng chưa…).
  - Mỗi mục: mô tả, "vì sao cần", hướng dẫn ngắn, **link template/bài viết** (E9), thời gian ước tính, trạng thái (Chưa làm/Đang làm/Xong).
  - Đánh dấu mục **user đã có sẵn** (từ hồ sơ) là hoàn thành.

**FR-E16-02 — Timeline ngược từ deadline (Backward Planner)**
- *AC:* Từ deadline học bổng (E6), sinh lịch gợi ý các mốc: *T-6 tháng: chọn trường & giáo sư · T-4: thi ngoại ngữ, liên hệ GS · T-3: viết SOP, xin LOR · T-2: hoàn thiện & dịch công chứng · T-1: rà soát & nộp*. Mốc đẩy vào Lịch (E6) & Bảng theo dõi (E17).

**FR-E16-03 — Kho template & hướng dẫn**
- *AC:* Thư viện mẫu: CV, SOP (theo ngành/bậc), Motivation Letter, Research Proposal, email xin LOR, email liên hệ GS. Kèm bài hướng dẫn & lỗi thường gặp (E9). Cho phép tải mẫu.

**FR-E16-04 — Ghi chú theo nước/học bổng đặc thù**
- *AC:* Hiển thị lưu ý riêng (VD: Đức cần APS & dịch công chứng; Nhật MEXT cần liên hệ GS & có 2 đường Đại sứ quán/Đại học; Mỹ cần GRE tùy trường…). Nội dung do Admin biên tập (E10).

**FR-E16-05 — Tiến độ hồ sơ (%)**
- *AC:* Tính % hoàn thành checklist mỗi học bổng; hiển thị ở Bảng theo dõi (E17).

## C.4. Mô hình dữ liệu (bổ sung)
- **DocumentTemplate**: `id, type, level?, field?, title, description, file_url, guide_article_id?`
- **PreparationItem** (checklist chuẩn theo loại HB): `id, scholarship_id?/rule, doc_type, required(bool), guide, est_time`
- **UserPreparationTask**: `id, user_id, scholarship_id, doc_type, status, note, updated_at` (trạng thái riêng của user).

---

# PHẦN D — E17: BẢNG THEO DÕI TRẠNG THÁI (Application Status Board)

## D.1. Mục tiêu
Một **bảng thống kê trung tâm** để user tự **chuyển trạng thái** và theo dõi toàn bộ hành trình ứng tuyển — từ quan tâm → liên hệ giáo sư → chuẩn bị → nộp → phỏng vấn → kết quả. Kết hợp **2 chế độ xem**: Bảng (table) & Kanban.

## D.2. Định nghĩa pipeline trạng thái (mặc định, cho phép tùy chỉnh)

| Thứ tự | Trạng thái | Ý nghĩa |
|---|---|---|
| 1 | **Quan tâm** (Interested) | Đã lưu, đang cân nhắc |
| 2 | **Đang nghiên cứu** (Researching) | Đọc kỹ điều kiện, tìm trường/ngành |
| 3 | **Liên hệ giáo sư** (Contacting Prof.) | Áp dụng cho HB research (đồng bộ E15) |
| 4 | **Chuẩn bị hồ sơ** (Preparing) | Đang làm checklist (đồng bộ E16) |
| 5 | **Đã nộp** (Submitted) | Đã nộp đơn |
| 6 | **Phỏng vấn** (Interview) | Vào vòng phỏng vấn |
| 7 | **Kết quả** (Result) | Trúng tuyển / Từ chối / Danh sách chờ / Đã rút |

> User có thể **kéo–thả** (Kanban) hoặc đổi qua **dropdown** (Table). Cho phép ẩn/bớt cột trạng thái không dùng.

## D.3. Chế độ xem Bảng (Table view) — các cột
| Cột | Nội dung | Tương tác |
|---|---|---|
| Học bổng | Tên + logo nhà tài trợ | Link chi tiết |
| Quốc gia / Loại | Cờ + loại (Chính phủ/Trường…) | Lọc |
| **Match %** | Điểm phù hợp (E3) | Sắp xếp |
| **Deadline** | Ngày + "còn N ngày" (màu cảnh báo) | Sắp xếp |
| Giáo sư | Tên GS đang liên hệ + trạng thái liên hệ | Link hồ sơ GS (E15) |
| **% Hồ sơ** | Tiến độ checklist (E16) | Thanh tiến độ |
| **Trạng thái** | Dropdown pipeline (D.2) | **Đổi trực tiếp** |
| Hành động tiếp theo | Việc/mốc kế tiếp | Nhắc (E6) |
| Ghi chú | Ghi chú tự do | Sửa nhanh |

- Hỗ trợ **sắp xếp, lọc, tìm** trong bảng; chọn nhiều dòng để thao tác hàng loạt (đổi trạng thái, xóa).

## D.4. Bảng thống kê (Dashboard/Summary)
- **Thẻ số liệu:** tổng số HB đang theo dõi; số theo từng trạng thái; số **deadline trong 7/30 ngày**; số HB "sắp hết hạn mà hồ sơ < 100%".
- **Cảnh báo ưu tiên:** danh sách "cần làm gấp" (deadline gần + hồ sơ chưa xong).
- **Tỷ lệ kết quả:** đã nộp / trúng tuyển / chờ (khi có dữ liệu).

## D.5. Yêu cầu chức năng
**FR-E17-01 — Xem Bảng & Kanban, tự đổi trạng thái**
- *AC:* Chuyển đổi 2 chế độ; kéo–thả giữa cột Kanban = đổi trạng thái; dropdown trong Table = đổi trạng thái; lưu tức thì; có undo.

**FR-E17-02 — Đồng bộ dữ liệu liên module**
- *AC:*
  - "% Hồ sơ" lấy từ checklist E16; "Trạng thái GS" lấy từ E15; "Deadline/còn N ngày" từ E6; "Match %" từ E3.
  - Đổi trạng thái ở E15/E16 phản ánh vào Bảng và ngược lại (nguồn sự thật thống nhất).

**FR-E17-03 — Nhắc & việc kế tiếp**
- *AC:* Mỗi dòng gợi ý "hành động tiếp theo" dựa trên trạng thái + deadline; tạo nhắc (E6/E7).

**FR-E17-04 — Bộ lọc & nhóm**
- *AC:* Lọc theo trạng thái/quốc gia/loại/deadline; nhóm theo trạng thái hoặc theo kỳ nhập học.

**FR-E17-05 — Xuất dữ liệu**
- *AC:* Xuất bảng ra CSV/Excel; (Phase 2) đồng bộ lịch .ics/Google Calendar.

**FR-E17-06 — Tùy biến pipeline (Phase 2)**
- *AC:* User đổi tên/thêm/bớt cột trạng thái; đặt màu; đặt trạng thái mặc định.

## D.6. Mô hình dữ liệu (bổ sung)
- Mở rộng **SavedScholarship/Tracking** (BRD §10) thành bản ghi trạng thái đầy đủ:
  `id, user_id, scholarship_id, stage (pipeline), preparation_progress(%), linked_professor_id?, next_action, next_action_due?, note, updated_at, result?`
- **StageHistory** (tùy chọn): log mỗi lần đổi trạng thái (`from, to, at`) để thống kê thời gian mỗi giai đoạn.

## D.7. Bố cục mô tả (wireframe — text)
```
┌───────────────────────────────────────────────────────────────────────┐
│  BẢNG THEO DÕI CỦA TÔI            [ Bảng | Kanban ]      [Xuất CSV]     │
├───────────────────────────────────────────────────────────────────────┤
│  [Đang theo dõi: 12]  [Sắp hết hạn ≤7 ngày: 3]  [Hồ sơ <100% & gấp: 2] │
├───────────────────────────────────────────────────────────────────────┤
│ Học bổng        │Nước│Match│Deadline   │ Giáo sư     │%HS │ Trạng thái ▼│
│ DAAD EPOS       │ 🇩🇪 │ 88% │ 15/10 (còn│ Prof. Müller│ 60%│ Chuẩn bị    │
│                 │    │     │  →đỏ 6d)  │  (đã phản  │    │             │
│ MEXT (Đại học)  │ 🇯🇵 │ 82% │ 30/05     │  Prof. Sato │ 30%│ Liên hệ GS  │
│ Chevening       │ 🇬🇧 │ 75% │ 05/11     │     —       │ 10%│ Quan tâm    │
└───────────────────────────────────────────────────────────────────────┘
```

---

# PHẦN E — CẬP NHẬT LIÊN QUAN (tới BRD v1.0)

## E.1. Bổ sung Feature Map (thêm vào §6 BRD)
| Mã | Epic | Ưu tiên | Giai đoạn |
|---|---|---|---|
| E14 | Phân loại & Gắn thẻ học bổng | Cao | MVP |
| E15 | Giáo sư / Người hướng dẫn | Cao (research) | MVP nhẹ → Phase 2 đầy đủ |
| E16 | Cẩm nang chuẩn bị hồ sơ | Cao | MVP (checklist) → Phase 2 (template đầy đủ) |
| E17 | Bảng theo dõi trạng thái | Cao | MVP (thay cho E8 cơ bản) |

> **Lưu ý:** E17 **nâng cấp & thay thế** E8 (Application Tracker) trong BRD — gộp theo dõi hồ sơ + trạng thái + thống kê vào một bảng thống nhất.

## E.2. Bổ sung nguồn dữ liệu (thêm vào §12/§13 BRD)
- Thêm nhóm nguồn **học thuật**: OpenAlex, Semantic Scholar, ORCID, Crossref (cho E15).
- Kiến trúc: thêm dịch vụ **ingest hồ sơ giáo sư** song song với pipeline học bổng; liên kết Professor ↔ Scholarship/Institution.

## E.3. Bổ sung pháp lý (thêm vào §14 BRD)
- Xử lý **dữ liệu cá nhân của giáo sư** (B.7): chỉ thông tin nghề nghiệp công khai, cơ chế opt-out, chống spam, không bán/lạm dụng dữ liệu.

## E.4. Cập nhật Roadmap (điều chỉnh §17 BRD)
- **MVP:** thêm E14 (phân loại) + E16 (checklist cơ bản) + E17 (bảng theo dõi) + E15 mức cơ bản (hồ sơ GS từ OpenAlex/ORCID + link ngoài + theo dõi liên hệ).
- **Phase 2:** E15 đầy đủ (Professor Match, Outreach Helper, so sánh GS) + E16 kho template đầy đủ + E17 tùy biến pipeline & xuất lịch.

## E.5. Câu hỏi cần chốt (thêm vào §19 BRD)
1. Ưu tiên **bậc học nào** trước cho module giáo sư (PhD/Master research trước)?
2. Có cần **cảnh báo đạo đức liên hệ** & giới hạn tần suất để tránh user spam giáo sư không?
3. Mức độ tự động của checklist chuẩn bị: chuẩn theo loại HB (nhanh) hay chi tiết đến từng trường (tốn công biên tập)?
4. Bảng theo dõi: giữ pipeline mặc định D.2 hay cho tùy biến ngay từ MVP?

---

*— Hết tài liệu bổ sung v1.1. Kết hợp với BRD v1.0 tạo thành bộ tài liệu nghiệp vụ hoàn chỉnh. Vui lòng review phần E.5 để chốt, sau đó tôi có thể dựng khung website demo minh họa 4 module này. —*
