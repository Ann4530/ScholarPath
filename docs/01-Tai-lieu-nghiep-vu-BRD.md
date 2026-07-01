# TÀI LIỆU NGHIỆP VỤ (BRD)
# Nền tảng Tìm kiếm Học bổng Du học — "ScholarFinder"

> **Business Requirements Document — Study Abroad Scholarship Platform**

---

## 0. Thông tin tài liệu

| Hạng mục | Nội dung |
|---|---|
| **Tên sản phẩm (tạm)** | ScholarFinder (thư mục dự án: `Find-Schoolar`) |
| **Loại tài liệu** | Tài liệu nghiệp vụ (Business Requirements Document – BRD) |
| **Phiên bản** | v1.0 (Draft) |
| **Ngày lập** | 01/07/2026 |
| **Người lập** | BA / Product Team |
| **Trạng thái** | Bản thảo để review |
| **Phạm vi phát hành** | Nội bộ (Product, Engineering, Business, Legal) |

**Lịch sử thay đổi**

| Phiên bản | Ngày | Người sửa | Mô tả thay đổi |
|---|---|---|---|
| v1.0 | 01/07/2026 | BA | Khởi tạo tài liệu, phạm vi MVP |

---

## 1. Tóm tắt điều hành (Executive Summary)

**ScholarFinder** là nền tảng web giúp học sinh – sinh viên Việt Nam (và quốc tế) **tìm kiếm, so sánh và theo dõi học bổng du học** cùng **các kỳ nhập học (intakes)** tại nhiều quốc gia (Âu – Mỹ/Canada/Anh/Úc – Á).

Điểm khác biệt cốt lõi:

1. **Cá nhân hóa (Customize):** Người dùng khai báo hồ sơ (ngành học, bậc học, GPA, chứng chỉ ngoại ngữ, ngân sách, quốc gia mong muốn…). Hệ thống dùng **bộ máy so khớp (matching engine)** để chấm điểm mức độ phù hợp và gợi ý học bổng đúng nhu cầu, thay vì bắt user tự lọc thủ công.
2. **Theo dõi kỳ nhập học & hạn chót:** Mỗi học bổng/chương trình gắn với các **kỳ nhập học** và **deadline**. Hệ thống nhắc hạn, đưa vào lịch, cảnh báo sắp hết hạn.
3. **Dữ liệu tự động:** Học bổng được **thu thập tự động (crawl/API)** từ website trường, cổng chính phủ, tổ chức tài trợ, sau đó chuẩn hóa và kiểm duyệt.

Mục tiêu MVP: ra mắt bản tìm kiếm + cá nhân hóa + nhắc hạn với dữ liệu từ 5–8 quốc gia trọng điểm, tối thiểu 500–1.000 học bổng đã chuẩn hóa.

---

## 2. Bối cảnh & Vấn đề (Context & Problem Statement)

### 2.1. Bối cảnh
- Thông tin học bổng nằm rải rác ở hàng trăm website trường, cổng chính phủ (DAAD, Chevening, MEXT, Erasmus+…), tổ chức phi lợi nhuận, và các trang tổng hợp.
- Thông tin **không đồng nhất** (định dạng, ngôn ngữ, điều kiện, deadline), **hay thay đổi**, và **dễ lỗi thời**.
- Học sinh khó tự xác định học bổng nào **phù hợp với hồ sơ** của mình.

### 2.2. Vấn đề người dùng gặp phải (Pain points)
| # | Pain point | Hệ quả |
|---|---|---|
| P1 | Thông tin phân mảnh, phải mở hàng chục tab | Mất thời gian, bỏ sót cơ hội |
| P2 | Không biết mình đủ điều kiện học bổng nào | Nộp sai chỗ, tỷ lệ trượt cao |
| P3 | Lỡ deadline nộp hồ sơ | Mất trọn một mùa tuyển sinh |
| P4 | Điều kiện mơ hồ, thuật ngữ khó (GPA scale, IELTS/TOEFL, GRE…) | Hiểu sai yêu cầu |
| P5 | Thông tin lỗi thời trên các blog cũ | Nộp theo thông tin sai |

### 2.3. Cơ hội (Opportunity)
Một nền tảng **tập trung – chuẩn hóa – cá nhân hóa – nhắc hạn** giải quyết đồng thời P1→P5, tạo giá trị rõ ràng và có nhiều hướng thương mại hóa (xem §16).

---

## 3. Mục tiêu (Goals & Objectives)

### 3.1. Mục tiêu kinh doanh (Business Goals)
- **BG1:** Trở thành công cụ tìm học bổng du học được tin dùng cho thị trường Việt Nam trong 12 tháng.
- **BG2:** Xây dựng cơ sở dữ liệu học bổng chuẩn hóa lớn & cập nhật (defensible data asset).
- **BG3:** Tạo doanh thu bền vững (freemium, quảng cáo có kiểm soát, affiliate, B2B cho trung tâm tư vấn du học).

### 3.2. Mục tiêu sản phẩm (Product Goals)
- **PG1:** Người dùng tìm được ≥ 5 học bổng phù hợp trong < 3 phút.
- **PG2:** ≥ 60% người dùng active tạo hồ sơ cá nhân hóa.
- **PG3:** Không người dùng nào lỡ deadline vì thiếu nhắc (đo qua tỷ lệ mở nhắc hạn).

### 3.3. Tiêu chí thành công (Success Metrics – tóm tắt, chi tiết ở §15)
- Số học bổng chuẩn hóa; độ tươi dữ liệu (data freshness); tỷ lệ khớp (match relevance); retention; conversion freemium.

### 3.4. Ngoài phạm vi mục tiêu (Non-Goals) — giai đoạn đầu
- Không tự động **nộp hồ sơ hộ** người dùng lên trường.
- Không tư vấn du học 1-1 chuyên sâu bằng con người (có thể là dịch vụ B2B sau).
- Không xử lý thanh toán học phí/ký túc xá.

---

## 4. Phạm vi (Scope)

### 4.1. Trong phạm vi (In-scope — MVP + Phase 2)
- Cổng tìm kiếm & bộ lọc học bổng đa tiêu chí.
- Hồ sơ người dùng & bộ máy cá nhân hóa/gợi ý.
- Trang chi tiết học bổng + chương trình + kỳ nhập học.
- Lưu / so sánh / bookmark học bổng.
- Theo dõi deadline, lịch, nhắc hạn (email + in-app; push ở Phase 2).
- Application Tracker (theo dõi tiến độ nộp — Phase 2).
- Nội dung/blog (hướng dẫn, giải thích thuật ngữ) — hỗ trợ SEO.
- Trang quản trị (Admin/CMS) để kiểm duyệt dữ liệu crawl.
- Pipeline thu thập dữ liệu tự động (crawler/API) + chuẩn hóa.

### 4.2. Ngoài phạm vi (Out-of-scope — giai đoạn đầu)
- App mobile native (làm sau; MVP dùng web responsive/PWA).
- Cộng đồng/diễn đàn, chat 1-1.
- Marketplace dịch vụ (dịch thuật, SOP editing…) — cân nhắc sau.
- Tự động điền & nộp đơn lên hệ thống của trường.

### 4.3. Giả định & Ràng buộc (Assumptions & Constraints)
- **Giả định:** Nguồn dữ liệu công khai có thể thu thập hợp pháp (tuân thủ §14).
- **Ràng buộc pháp lý:** Tuân thủ Nghị định 13/2023 (bảo vệ dữ liệu cá nhân – Việt Nam), GDPR (nếu có user EU), điều khoản `robots.txt`/ToS của nguồn.
- **Ràng buộc kỹ thuật:** Dữ liệu crawl cần lớp kiểm duyệt trước khi hiển thị (tránh sai lệch/pháp lý).

---

## 5. Đối tượng người dùng (User Personas)

### Persona 1 — "Minh, học sinh lớp 12" (Ứng viên bậc Đại học)
- **Bối cảnh:** Muốn săn học bổng cử nhân ở Mỹ/Canada/Úc. GPA 8.5/10, IELTS 7.0, ngân sách hạn chế.
- **Nhu cầu:** Tìm học bổng toàn phần/bán phần, hiểu điều kiện, không lỡ deadline nộp sớm (Early Action).
- **Nỗi lo:** Thuật ngữ lạ, sợ nộp thiếu giấy tờ, sợ trễ hạn.

### Persona 2 — "Lan, sinh viên năm cuối" (Ứng viên Thạc sĩ)
- **Bối cảnh:** Muốn học Master ngành Data Science ở Đức/Hà Lan (học phí thấp) hoặc học bổng chính phủ (DAAD, Erasmus+).
- **Nhu cầu:** Lọc theo ngành, theo học bổng chính phủ, so sánh nhiều lựa chọn, theo dõi nhiều deadline song song.

### Persona 3 — "Huy, người đi làm" (Ứng viên học bổng chính phủ/PhD)
- **Bối cảnh:** 2 năm kinh nghiệm, tìm học bổng MEXT/Chevening/Australia Awards, quan tâm ràng buộc cam kết về nước.
- **Nhu cầu:** Thông tin chính xác về điều kiện, quyền lợi, nghĩa vụ; theo dõi lịch nhiều vòng (hồ sơ → phỏng vấn).

### Persona 4 — "Chị Thảo, tư vấn viên trung tâm du học" (B2B — Phase sau)
- **Bối cảnh:** Quản lý nhiều học viên, cần công cụ tra cứu nhanh & theo dõi deadline theo từng học viên.
- **Nhu cầu:** Tài khoản đội nhóm, lưu hồ sơ nhiều học viên, xuất báo cáo.

### Persona 5 — "Admin/Data Editor" (Nội bộ)
- **Nhu cầu:** Kiểm duyệt dữ liệu crawl, sửa/chuẩn hóa, gắn tag, ẩn/hiện, đánh dấu nguồn tin cậy.

---

## 6. Bản đồ tính năng (Feature Map / Epics)

| Mã | Epic | Ưu tiên | Giai đoạn |
|---|---|---|---|
| E1 | Onboarding & Hồ sơ người dùng | Cao | MVP |
| E2 | Tìm kiếm & Bộ lọc học bổng | Cao | MVP |
| E3 | Cá nhân hóa & Gợi ý (Matching Engine) | Cao | MVP |
| E4 | Chi tiết Học bổng / Chương trình / Kỳ nhập học | Cao | MVP |
| E5 | Lưu / So sánh / Bookmark | Trung | MVP |
| E6 | Deadline, Lịch & Nhắc hạn | Cao | MVP |
| E7 | Thông báo & Cảnh báo (Alerts) | Cao | MVP/Phase 2 |
| E8 | Application Tracker (theo dõi nộp hồ sơ) | Trung | Phase 2 |
| E9 | Nội dung / Blog / Từ điển thuật ngữ | Trung | MVP (SEO) |
| E10 | Quản trị & Kiểm duyệt dữ liệu (Admin/CMS) | Cao | MVP |
| E11 | Pipeline thu thập dữ liệu (Crawler/API + Chuẩn hóa) | Cao | MVP |
| E12 | Tài khoản đội nhóm B2B | Thấp | Phase 3 |
| E13 | Phân tích & Báo cáo (Analytics) | Trung | Phase 2 |
| **E14** | **Phân loại & Gắn thẻ học bổng (Taxonomy)** | Cao | MVP |
| **E15** | **Giáo sư / Người hướng dẫn (Supervisor Finder)** | Cao (research) | MVP nhẹ → Phase 2 |
| **E16** | **Cẩm nang chuẩn bị hồ sơ (Preparation Playbook)** | Cao | MVP → Phase 2 |
| **E17** | **Bảng theo dõi trạng thái (Application Board)** | Cao | MVP (thay E8) |

> 📎 **Chi tiết E14–E17** xem tài liệu bổ sung: `02-Bo-sung-Phan-loai-GiaoSu-ChuanBi-TheoDoi.md`. E17 nâng cấp & thay thế E8.

---

## 7. Yêu cầu chức năng chi tiết (Functional Requirements)

> Định dạng: mỗi tính năng gồm **User Story** + **Tiêu chí chấp nhận (Acceptance Criteria)**. Mã yêu cầu: `FR-<Epic>-<số>`.

### 7.1. E1 — Onboarding & Hồ sơ người dùng

**FR-E1-01 — Đăng ký / Đăng nhập**
- *User story:* Là người dùng, tôi muốn đăng ký/đăng nhập bằng email hoặc Google để lưu hồ sơ và học bổng đã lưu.
- *AC:*
  - Hỗ trợ đăng ký email + mật khẩu và OAuth Google.
  - Xác minh email (verification link).
  - Cho phép dùng thử **không cần đăng nhập** (guest) nhưng không lưu được hồ sơ/bookmark.
  - Quên mật khẩu qua email reset.

**FR-E1-02 — Khai báo hồ sơ học tập (Academic Profile)**
- *User story:* Là người dùng, tôi muốn nhập thông tin hồ sơ để hệ thống gợi ý học bổng phù hợp.
- *Trường dữ liệu hồ sơ:*
  - Bậc học mong muốn: Cử nhân / Thạc sĩ / Tiến sĩ / Sau tiến sĩ / Nghề.
  - Ngành/lĩnh vực mong muốn (đa chọn, theo danh mục chuẩn — vd ISCED/CIP).
  - Quốc gia/khu vực mong muốn (đa chọn).
  - GPA hiện tại + thang điểm (10 / 4.0 / phần trăm) → hệ thống **quy đổi**.
  - Chứng chỉ ngoại ngữ: IELTS/TOEFL/Duolingo/PTE + điểm; hoặc "chưa có".
  - Chứng chỉ chuẩn hóa: GRE/GMAT/SAT (nếu có).
  - Kinh nghiệm làm việc/nghiên cứu (số năm).
  - Ngân sách/nhu cầu tài chính: cần **toàn phần / bán phần / không giới hạn**.
  - Thời điểm dự kiến nhập học (kỳ/năm — vd Fall 2027).
  - Quốc tịch (ảnh hưởng điều kiện eligibility).
- *AC:*
  - Cho phép lưu hồ sơ **từng phần** (progressive profiling), hiển thị % hoàn thiện.
  - Quy đổi GPA & map điểm ngoại ngữ hiển thị minh bạch (giải thích cách quy đổi).
  - Có thể cập nhật hồ sơ bất kỳ lúc nào; thay đổi hồ sơ làm mới danh sách gợi ý.

**FR-E1-03 — Nhiều hồ sơ mục tiêu (Optional, Phase 2)**
- Cho phép người dùng tạo nhiều "mục tiêu" (vd: vừa xét Master Đức, vừa xét Master Canada) với tiêu chí khác nhau.

---

### 7.2. E2 — Tìm kiếm & Bộ lọc học bổng

**FR-E2-01 — Tìm kiếm từ khóa**
- *AC:*
  - Ô tìm kiếm full-text theo tên học bổng, trường, ngành, quốc gia.
  - Gợi ý tự động (autocomplete) + sửa lỗi chính tả cơ bản (typo tolerance).
  - Kết quả trả về < 500ms với dữ liệu đã index.

**FR-E2-02 — Bộ lọc đa tiêu chí (Faceted filters)**
- *Bộ lọc tối thiểu:*
  - Quốc gia / khu vực.
  - Bậc học (Cử nhân/Thạc sĩ/Tiến sĩ…).
  - Ngành/lĩnh vực.
  - Loại học bổng: Chính phủ / Trường / Tổ chức / Doanh nghiệp.
  - Mức tài trợ: Toàn phần / Bán phần / Chỉ học phí / Stipend sinh hoạt.
  - Yêu cầu ngoại ngữ (ngưỡng IELTS/TOEFL).
  - Đối tượng quốc tịch được nộp (có nhận VN không).
  - Trạng thái deadline: Đang mở / Sắp mở / Sắp hết hạn / Đã đóng.
  - Kỳ nhập học (Fall/Spring/Summer, năm).
- *AC:*
  - Lọc kết hợp nhiều điều kiện (AND), cập nhật số kết quả theo thời gian thực.
  - Sắp xếp theo: mức độ phù hợp (default cho user có hồ sơ), deadline gần nhất, mới thêm, mức tài trợ.
  - Hiển thị "bộ lọc đang áp dụng" dạng chip, xóa nhanh.
  - Lưu bộ lọc thành **Saved Search** để nhận thông báo (liên kết E7).

**FR-E2-03 — Phân trang & hiệu năng**
- *AC:* Phân trang hoặc infinite scroll; giữ trạng thái lọc khi quay lại (back button an toàn, URL phản ánh bộ lọc để chia sẻ được).

---

### 7.3. E3 — Cá nhân hóa & Gợi ý (Matching Engine) — **điểm khác biệt chính**

**FR-E3-01 — Chấm điểm phù hợp (Match Score)**
- *User story:* Là người dùng có hồ sơ, tôi muốn thấy mỗi học bổng có **điểm phù hợp (%)** với mình và **lý do**.
- *AC:*
  - Mỗi học bổng hiển thị **Match Score 0–100%** và nhãn: *Rất phù hợp / Phù hợp / Cân nhắc / Chưa đủ điều kiện*.
  - Hiển thị **lý do khớp** (vd: "Đúng ngành CNTT", "GPA đạt", "IELTS còn thiếu 0.5") — dạng checklist ✅/⚠️/❌.
  - Học bổng "Chưa đủ điều kiện" vẫn hiển thị nhưng gắn nhãn rõ + gợi ý cần cải thiện gì.
- *Logic chấm điểm (mô tả nghiệp vụ, chi tiết ở §12):* dựa trên mức khớp của: bậc học, ngành, quốc gia, GPA (đã quy đổi), ngoại ngữ, quốc tịch eligibility, nhu cầu tài chính vs mức tài trợ, thời điểm nhập học.

**FR-E3-02 — Danh sách gợi ý "Dành cho bạn" (For You)**
- *AC:*
  - Trang chủ (khi đã đăng nhập) hiển thị danh sách học bổng gợi ý xếp theo Match Score.
  - Cập nhật khi hồ sơ thay đổi hoặc có học bổng mới khớp.
  - Giải thích ngắn tại sao được gợi ý.

**FR-E3-03 — Gợi ý "gần đạt" & hành động cải thiện**
- *AC:* Với học bổng user còn thiếu 1 tiêu chí (vd IELTS), hệ thống nêu rõ "Bạn cần IELTS 6.5 (hiện 6.0)" và link nội dung hướng dẫn liên quan.

---

### 7.4. E4 — Chi tiết Học bổng / Chương trình / Kỳ nhập học

**FR-E4-01 — Trang chi tiết học bổng**
- *Thông tin hiển thị:*
  - Tên học bổng, tổ chức cấp, trường (nếu có), quốc gia.
  - Loại & mức tài trợ (chi tiết quyền lợi: học phí, sinh hoạt phí, vé máy bay, bảo hiểm…).
  - Điều kiện dự tuyển (eligibility) đã chuẩn hóa + trích nguyên văn nguồn.
  - Hồ sơ cần nộp (documents checklist).
  - **Các kỳ nhập học & deadline** liên quan.
  - Link nguồn chính thức (official source) + ngày cập nhật gần nhất + **badge độ tin cậy**.
  - Match Score cá nhân (nếu đã đăng nhập).
- *AC:*
  - Luôn hiển thị "Cập nhật lần cuối" và link nguồn gốc.
  - Nút: Lưu, So sánh, Thêm vào theo dõi deadline, Chia sẻ.
  - Cảnh báo nếu thông tin đã quá X ngày chưa được xác thực lại.

**FR-E4-02 — Mô hình Kỳ nhập học (Intakes) & Deadline**
- *Nghiệp vụ:* Một chương trình/học bổng có thể có **nhiều kỳ nhập học** (vd Fall 2027, Spring 2028), mỗi kỳ có các mốc: mở đơn, hạn nộp sớm (early), hạn nộp thường (regular), hạn học bổng, kết quả, nhập học.
- *AC:*
  - Hiển thị timeline các mốc theo từng kỳ.
  - Phân biệt rõ **deadline học bổng** vs **deadline nhập học chương trình** (nhiều user nhầm lẫn).
  - Hỗ trợ chênh lệch múi giờ (hiển thị theo giờ VN + giờ gốc).

**FR-E4-03 — So sánh học bổng**
- *AC:* Chọn 2–4 học bổng → bảng so sánh cạnh nhau (tài trợ, điều kiện, deadline, quốc gia, Match Score).

---

### 7.5. E5 — Lưu / So sánh / Bookmark

**FR-E5-01 — Lưu học bổng**
- *AC:* Lưu vào "Học bổng của tôi"; phân nhóm bằng nhãn/trạng thái (Quan tâm / Sẽ nộp / Đã nộp). Yêu cầu đăng nhập.

**FR-E5-02 — Danh sách yêu thích & ghi chú**
- *AC:* Cho phép ghi chú cá nhân trên từng học bổng đã lưu.

---

### 7.6. E6 — Deadline, Lịch & Nhắc hạn

**FR-E6-01 — Theo dõi deadline**
- *AC:*
  - Thêm học bổng vào danh sách theo dõi → các mốc deadline xuất hiện trong "Lịch của tôi".
  - Xem dạng danh sách + dạng lịch (calendar) theo tháng.
  - Sắp xếp theo mốc gần nhất; đánh dấu "còn N ngày".

**FR-E6-02 — Nhắc hạn (Reminders)**
- *AC:*
  - Nhắc trước deadline theo mốc cấu hình được (vd trước 30/14/7/1 ngày).
  - Kênh: email (MVP) + in-app; push notification (Phase 2).
  - Xuất lịch: export .ics / đồng bộ Google Calendar (Phase 2).

---

### 7.7. E7 — Thông báo & Cảnh báo (Alerts)

**FR-E7-01 — Saved Search Alerts**
- *AC:* Khi có học bổng mới khớp bộ lọc/hồ sơ đã lưu → gửi thông báo (email digest hằng tuần + in-app tức thời tùy cấu hình).

**FR-E7-02 — Cảnh báo thay đổi dữ liệu**
- *AC:* Nếu học bổng đã lưu thay đổi deadline hoặc bị đóng → cảnh báo người dùng đang theo dõi.

**FR-E7-03 — Quản lý tùy chọn thông báo**
- *AC:* Trang cài đặt cho phép bật/tắt từng loại thông báo & tần suất; tuân thủ opt-out (chống spam).

---

### 7.8. E8 — Application Tracker (Phase 2)

**FR-E8-01 — Theo dõi tiến độ nộp hồ sơ**
- *AC:*
  - Mỗi học bổng "Sẽ nộp" có checklist hồ sơ (SOP, LOR, bảng điểm, chứng chỉ…).
  - Trạng thái: Chưa bắt đầu → Đang chuẩn bị → Đã nộp → Phỏng vấn → Kết quả.
  - Nhắc theo từng đầu việc con.

---

### 7.9. E9 — Nội dung / Blog / Từ điển thuật ngữ

**FR-E9-01 — Bài viết & hướng dẫn (SEO)**
- *AC:* CMS đăng bài (hướng dẫn viết SOP, giải thích IELTS vs TOEFL, so sánh học bổng chính phủ…). Tối ưu SEO (meta, sitemap, structured data).

**FR-E9-02 — Từ điển thuật ngữ (Glossary tooltips)**
- *AC:* Thuật ngữ (GPA, stipend, tuition waiver…) có tooltip giải thích ngay trong trang chi tiết.

---

### 7.10. E10 — Quản trị & Kiểm duyệt dữ liệu (Admin/CMS)

**FR-E10-01 — Hàng đợi kiểm duyệt (Moderation Queue)**
- *AC:*
  - Dữ liệu crawl mới/đã thay đổi vào hàng đợi "Chờ duyệt".
  - Admin xem bản gốc (raw) + bản chuẩn hóa (parsed) cạnh nhau, sửa, duyệt/từ chối.
  - Chỉ dữ liệu **đã duyệt** mới public.

**FR-E10-02 — Quản lý học bổng thủ công**
- *AC:* Thêm/sửa/xóa học bổng thủ công; gắn tag; đặt độ tin cậy nguồn; đặt lịch review lại.

**FR-E10-03 — Quản lý nguồn (Sources)**
- *AC:* Danh sách nguồn crawl, tần suất, trạng thái, lịch sử lỗi; bật/tắt nguồn.

**FR-E10-04 — Phân quyền (RBAC)**
- *AC:* Vai trò: Super Admin / Editor / Viewer. Ghi log thao tác (audit log).

---

### 7.11. E11 — Pipeline thu thập dữ liệu (Crawler/API + Chuẩn hóa)

**FR-E11-01 — Thu thập dữ liệu**
- *AC:*
  - Trình thu thập theo lịch (scheduler) cho từng nguồn.
  - Ưu tiên **API chính thức** khi có; fallback sang crawl HTML.
  - Tôn trọng `robots.txt`, rate limit, và điều khoản sử dụng (xem §14).

**FR-E11-02 — Trích xuất & chuẩn hóa (Parsing & Normalization)**
- *AC:*
  - Trích các trường: tên, tổ chức, quốc gia, bậc học, ngành, mức tài trợ, điều kiện, deadline, kỳ nhập học, link nguồn.
  - Chuẩn hóa: quốc gia (ISO), ngành (danh mục chuẩn), tiền tệ, ngày (ISO 8601, kèm múi giờ), điểm ngoại ngữ.
  - Có thể dùng LLM hỗ trợ bóc tách trường từ văn bản phi cấu trúc (kèm bước kiểm duyệt).

**FR-E11-03 — Chống trùng & phát hiện thay đổi**
- *AC:*
  - Khử trùng lặp (dedupe) học bổng từ nhiều nguồn (fuzzy matching theo tên + tổ chức + quốc gia).
  - Phát hiện thay đổi (deadline mới, đóng đơn) → cập nhật + kích hoạt cảnh báo (E7-02).

**FR-E11-04 — Truy vết nguồn & độ tin cậy**
- *AC:* Mỗi trường dữ liệu lưu nguồn gốc + thời điểm crawl; tính điểm tin cậy (nguồn chính thức > trang tổng hợp).

---

## 8. Yêu cầu phi chức năng (Non-Functional Requirements)

| Mã | Nhóm | Yêu cầu |
|---|---|---|
| NFR-01 | Hiệu năng | Trang tìm kiếm phản hồi < 1s (p95); truy vấn lọc < 500ms trên dữ liệu đã index. |
| NFR-02 | Khả năng mở rộng | Chịu được ≥ 100k học bổng và ≥ 100k người dùng; kiến trúc cho phép scale ngang. |
| NFR-03 | Sẵn sàng | Uptime mục tiêu 99.5%; pipeline crawl lỗi 1 nguồn không ảnh hưởng toàn hệ thống. |
| NFR-04 | Bảo mật | Mã hóa mật khẩu (bcrypt/argon2), HTTPS bắt buộc, chống OWASP Top 10, rate limit API. |
| NFR-05 | Bảo mật dữ liệu cá nhân | Tuân thủ ND 13/2023 & GDPR: đồng ý rõ ràng, quyền xem/xóa dữ liệu, tối thiểu hóa dữ liệu. |
| NFR-06 | Khả dụng (Usability) | Responsive (mobile-first), đạt tối thiểu WCAG 2.1 AA cho phần cốt lõi. |
| NFR-07 | Đa ngôn ngữ (i18n) | Kiến trúc sẵn sàng đa ngôn ngữ; MVP: Tiếng Việt + Tiếng Anh. |
| NFR-08 | SEO | SSR/SSG cho trang public; sitemap, structured data (schema.org). |
| NFR-09 | Khả năng bảo trì | Code chuẩn hóa, có test, CI/CD, tài liệu API. |
| NFR-10 | Độ chính xác dữ liệu | Chỉ hiển thị dữ liệu đã duyệt; hiển thị ngày cập nhật & nguồn; cảnh báo dữ liệu cũ. |
| NFR-11 | Khả năng quan sát (Observability) | Logging, monitoring, alerting cho pipeline & web. |
| NFR-12 | Sao lưu & Khôi phục | Backup DB định kỳ; RPO ≤ 24h, RTO ≤ 4h. |

---

## 9. Luồng nghiệp vụ chính (Business Flows / User Journeys)

> Sơ đồ mô tả bằng văn bản; khi triển khai sẽ dựng thành flowchart (BPMN/Mermaid).

### 9.1. Luồng "Người dùng mới tìm học bổng phù hợp"
```
[Truy cập trang chủ]
   → [Dùng thử tìm kiếm (guest)]  hoặc  [Đăng ký/Đăng nhập]
   → [Khai báo hồ sơ nhanh: bậc học, ngành, quốc gia, GPA, ngoại ngữ, ngân sách]
   → [Hệ thống chấm Match Score & hiển thị "Dành cho bạn"]
   → [User lọc thêm / mở chi tiết học bổng]
   → [Xem điều kiện + kỳ nhập học + deadline + nguồn]
   → [Lưu học bổng + Thêm vào theo dõi deadline]
   → [Bật nhắc hạn]
   → (Sau này) [Nhận email nhắc trước deadline]
```

### 9.2. Luồng "Theo dõi & không lỡ deadline"
```
[Học bổng đã lưu] → [Thêm vào Lịch của tôi]
   → [Hệ thống tính các mốc + còn N ngày]
   → [Đến mốc nhắc (T-30/14/7/1)] → [Gửi email + in-app]
   → [User mở → cập nhật trạng thái nộp (Application Tracker)]
```

### 9.3. Luồng dữ liệu (Data Pipeline) — nội bộ
```
[Scheduler kích hoạt nguồn]
   → [Crawler/API lấy dữ liệu thô]
   → [Parser + Normalizer (chuẩn hóa trường)]
   → [Dedupe & Change Detection]
   → [Ghi vào bảng staging + đưa vào Moderation Queue]
   → [Admin duyệt/sửa]
   → [Publish sang bảng production + reindex search]
   → [Kích hoạt Alerts nếu có thay đổi ảnh hưởng user đang theo dõi]
```

### 9.4. Luồng kiểm duyệt (Moderation)
```
[Item chờ duyệt] → [Admin xem raw vs parsed]
   → nếu đạt → [Approve → Publish]
   → nếu sai → [Sửa trường → Approve]  hoặc  [Reject + ghi lý do]
   → [Ghi audit log]
```

---

## 10. Mô hình dữ liệu (Data Model — mức khái niệm)

> Mô tả các thực thể chính & quan hệ. Chi tiết kỹ thuật (kiểu dữ liệu, index) sẽ ở tài liệu thiết kế DB riêng.

### 10.1. Các thực thể chính (Entities)

**User**
- `id`, `email`, `password_hash`/`oauth`, `role`, `created_at`, `email_verified`, `locale`, `notification_settings`.

**Profile** (1–1 hoặc 1–n với User nếu đa mục tiêu)
- `id`, `user_id`, `target_level` (Cử nhân/Thạc sĩ/…), `fields[]` (ngành), `countries[]`, `gpa_value`, `gpa_scale`, `gpa_normalized`, `language_tests[]` (loại, điểm), `standardized_tests[]`, `work_experience_years`, `funding_need` (full/partial/any), `intended_intake`, `nationality`.

**Scholarship** (thực thể trung tâm)
- `id`, `title`, `provider_id`, `country`, `region`, `type` (Government/University/Org/Corporate), `funding_level` (Full/Partial/TuitionOnly/Stipend), `benefits` (JSON: tuition, living, travel, insurance…), `eligibility` (chuẩn hóa: min_gpa, min_language, allowed_nationalities[], levels[], fields[]…), `documents_required[]`, `official_url`, `source_id`, `trust_score`, `status` (draft/published/closed), `last_verified_at`, `created_at`, `updated_at`.

**Provider / Institution**
- `id`, `name`, `type` (University/Government/Foundation/Company), `country`, `website`, `logo`.

**Program** (chương trình học liên quan — tùy chọn)
- `id`, `institution_id`, `name`, `level`, `field`, `language_of_instruction`, `tuition_fee`, `duration`.

**Intake** (kỳ nhập học)
- `id`, `program_id`/`scholarship_id`, `term` (Fall/Spring/Summer), `year`, `timezone`.

**Deadline** (thuộc Intake hoặc Scholarship)
- `id`, `intake_id`/`scholarship_id`, `type` (open/early/regular/scholarship/result/enrollment), `datetime_utc`, `note`.

**SavedScholarship / Tracking**
- `id`, `user_id`, `scholarship_id`, `status` (interested/will_apply/applied…), `note`, `created_at`.

**SavedSearch / Alert**
- `id`, `user_id`, `filters` (JSON), `frequency`, `channel`, `last_run_at`.

**Reminder**
- `id`, `user_id`, `deadline_id`, `offset_days`, `channel`, `sent_at`.

**Source** (nguồn crawl)
- `id`, `name`, `base_url`, `type` (api/html), `crawl_frequency`, `robots_ok`, `status`, `last_crawled_at`, `trust_level`.

**RawRecord / StagingRecord** (dữ liệu thô trước duyệt)
- `id`, `source_id`, `raw_payload`, `parsed_payload`, `dedupe_key`, `moderation_status`, `diff_from_current`.

**Field / Country / Term (danh mục chuẩn — reference tables)**
- Chuẩn hóa ngành (ISCED/CIP), quốc gia (ISO 3166), kỳ học.

**AuditLog**
- `id`, `actor_id`, `action`, `entity`, `entity_id`, `timestamp`, `detail`.

### 10.2. Quan hệ chính (tóm tắt)
```
User 1─1 Profile
User 1─n SavedScholarship n─1 Scholarship
User 1─n SavedSearch
User 1─n Reminder n─1 Deadline
Scholarship n─1 Provider
Scholarship 1─n Intake 1─n Deadline
Program n─1 Institution; Program 1─n Intake
Scholarship n─1 Source
Source 1─n RawRecord
```

---

## 11. Cơ chế cá nhân hóa / Thuật toán so khớp (Matching Logic)

> Mô tả nghiệp vụ của **Match Score** để đội kỹ thuật hiện thực hóa. Đây là logic dựa trên luật (rule-based) cho MVP; có thể nâng cấp ML ở giai đoạn sau.

### 11.1. Nguyên tắc
- Match Score = tổng trọng số các tiêu chí khớp, quy về thang **0–100%**.
- Có **tiêu chí loại trừ cứng (hard filter)** — nếu vi phạm thì gắn "Chưa đủ điều kiện" (không loại khỏi danh sách nhưng hạ điểm & gắn nhãn).

### 11.2. Tiêu chí & trọng số (đề xuất — có thể tinh chỉnh)
| Tiêu chí | Kiểu | Trọng số gợi ý | Ghi chú |
|---|---|---|---|
| Quốc tịch được phép nộp | Hard | Loại trừ nếu VN không nằm trong danh sách | Quan trọng nhất |
| Bậc học khớp | Hard/Soft | 20% | Sai bậc học → điểm rất thấp |
| Ngành/lĩnh vực khớp | Soft | 20% | Khớp chính xác > liên quan |
| Quốc gia mong muốn | Soft | 15% | |
| GPA đạt ngưỡng (đã quy đổi) | Soft/Hard | 15% | Gần đạt → cảnh báo, không loại |
| Ngoại ngữ đạt ngưỡng | Soft/Hard | 15% | Thiếu → "gần đạt" + gợi ý |
| Nhu cầu tài chính vs mức tài trợ | Soft | 10% | Cần full mà chỉ partial → giảm điểm |
| Thời điểm nhập học phù hợp/deadline còn hiệu lực | Soft | 5% | Đã đóng đơn → hạ mạnh |

### 11.3. Quy đổi & xử lý dữ liệu thiếu
- **GPA:** quy đổi các thang (10, 4.0, %) về thang chung để so sánh.
- **Ngoại ngữ:** bảng quy đổi tương đối IELTS ↔ TOEFL ↔ Duolingo (hiển thị "ước tính").
- **Dữ liệu hồ sơ thiếu:** không loại trừ; coi là "chưa xác định" và giảm độ chắc chắn của Match Score (hiển thị "cần bổ sung X để chấm chính xác hơn").

### 11.4. Giải thích kết quả (Explainability)
- Mỗi Match Score kèm **breakdown**: tiêu chí nào ✅ đạt / ⚠️ gần đạt / ❌ chưa đạt, để người dùng tin tưởng và biết cách cải thiện.

---

## 12. Chiến lược nguồn dữ liệu & Thu thập (Data Acquisition)

### 12.1. Phân loại nguồn
| Loại nguồn | Ví dụ | Ưu tiên |
|---|---|---|
| Cổng học bổng chính phủ | DAAD (Đức), Chevening (Anh), MEXT (Nhật), Erasmus+ (EU), Australia Awards, Vied (VN) | Cao — tin cậy nhất |
| Website trường đại học | Trang "Scholarships/Funding" của từng trường | Cao |
| Tổ chức/Quỹ tài trợ | Fulbright, các foundation | Trung |
| Cổng tổng hợp / API bên thứ ba | Nếu có API hợp pháp | Trung — cần kiểm chứng |
| Nhập thủ công (Admin) | Bổ sung nguồn khó crawl | Luôn có |

### 12.2. Nguyên tắc thu thập
1. **Ưu tiên API chính thức**; chỉ crawl HTML khi không có API.
2. **Tôn trọng `robots.txt`** và điều khoản sử dụng của từng site.
3. **Rate limiting & lịch hợp lý** để không gây tải cho nguồn.
4. **Chỉ thu thập dữ liệu công khai, không có tường đăng nhập/bản quyền hạn chế.**
5. **Lưu vết nguồn** (source URL + timestamp) cho mọi bản ghi.
6. **Con người kiểm duyệt** trước khi publish (không tự động public 100%).

### 12.3. Chuẩn hóa & chất lượng
- Pipeline chuẩn hóa (§7.11) + danh mục chuẩn (§10) + dedupe + change detection.
- Vòng đời "review lại": mỗi học bổng có `last_verified_at`; hệ thống nhắc admin xác thực lại các bản ghi cũ quá ngưỡng (vd > 60 ngày) hoặc gần deadline.

> ⚠️ **Lưu ý pháp lý quan trọng:** Xem §14. Việc crawl phải được rà soát pháp lý theo từng nguồn; ưu tiên hợp tác/API chính thức để giảm rủi ro.

---

## 13. Kiến trúc kỹ thuật đề xuất (Recommended Technical Architecture)

> Vì bạn **chưa chốt công nghệ**, đây là đề xuất tối ưu cho một sản phẩm cần SEO tốt, tìm kiếm nhanh, và pipeline dữ liệu.

### 13.1. Khuyến nghị stack (Recommended)
| Lớp | Đề xuất | Lý do |
|---|---|---|
| **Frontend/Web** | **Next.js (React) + TypeScript + Tailwind CSS** | SSR/SSG cho SEO (rất quan trọng với web tìm kiếm), hệ sinh thái lớn, dễ tuyển người. |
| **Backend/API** | Next.js API routes (MVP) hoặc **NestJS (Node)** tách riêng khi scale | Khởi đầu nhanh, tách dịch vụ khi lớn. |
| **CSDL chính** | **PostgreSQL** | Quan hệ chặt (học bổng, kỳ, deadline), JSONB linh hoạt cho benefits/eligibility. |
| **Tìm kiếm** | **Meilisearch/Typesense** (MVP) hoặc Elasticsearch (scale) | Full-text nhanh, typo tolerance, faceted search. |
| **Hàng đợi/Job** | Redis + BullMQ (hoặc Celery nếu crawler bằng Python) | Lịch crawl, gửi email, reindex. |
| **Crawler** | **Python (Scrapy/Playwright)** hoặc Node (Playwright) | Playwright xử lý trang động; Scrapy mạnh cho crawl quy mô. |
| **Bóc tách phi cấu trúc** | LLM (có kiểm duyệt) | Trích trường từ mô tả tự do; luôn có bước người duyệt. |
| **Email/Thông báo** | Dịch vụ email giao dịch (SendGrid/Resend) + web push | Nhắc hạn, digest. |
| **Xác thực** | Auth.js / Clerk / tự xây JWT | Email + Google OAuth. |
| **Hạ tầng** | Vercel (web) + Railway/Render/VPS (API, DB, crawler) hoặc 1 cloud (AWS/GCP) | Tùy ngân sách; container hóa (Docker). |
| **CI/CD & Giám sát** | GitHub Actions + Sentry + Uptime monitor | Chất lượng & observability. |

### 13.2. Sơ đồ khối (mô tả)
```
[Người dùng] ── HTTPS ──> [Next.js Web (SSR/SSG)]
                               │
                               ├── API ──> [PostgreSQL]  (dữ liệu chính)
                               ├── Search ──> [Meilisearch] (index học bổng)
                               └── Jobs ──> [Redis + Worker] ──> [Email/Push]

[Scheduler] ──> [Crawler (Python/Playwright)] ──> [Staging DB]
                               │
                          [Parser + Normalizer + Dedupe]
                               │
                          [Moderation Queue (Admin UI)]
                               │
                     approve ──> [PostgreSQL prod] ──> [Reindex Search] ──> [Trigger Alerts]
```

### 13.3. Phương án đơn giản hơn (nếu muốn nhẹ/nhanh/ngân sách thấp)
- **React (Vite) + Tailwind** cho SPA + **Supabase** (PostgreSQL + Auth + Storage) làm backend, cron chạy crawler serverless.
- Đánh đổi: SEO kém hơn Next.js (SPA), nhưng nhanh dựng MVP.

### 13.4. Phương án demo tối giản
- HTML/CSS/JS thuần + dữ liệu JSON tĩnh — chỉ để trình diễn UI, **không** dùng cho sản phẩm thật.

> 💡 **Khuyến nghị của tôi:** Chọn **Next.js + PostgreSQL + Meilisearch + crawler Python**. Đây là lựa chọn cân bằng giữa SEO, tốc độ tìm kiếm và khả năng mở rộng cho đúng bài toán này.

---

## 14. Pháp lý & Tuân thủ (Legal & Compliance)

> Phần này bắt buộc rà soát cùng bộ phận pháp lý trước khi vận hành.

### 14.1. Thu thập dữ liệu (Crawling)
- Tôn trọng `robots.txt` và **điều khoản sử dụng (ToS)** của từng nguồn; một số site cấm crawl.
- Ưu tiên **API/hợp tác chính thức**; với nguồn nhạy cảm, xin phép hoặc dùng thỏa thuận.
- Chỉ thu thập **dữ liệu công khai**; không vượt tường đăng nhập, không thu thập dữ liệu có bản quyền hạn chế.
- Ghi rõ **nguồn & link gốc** trên mọi trang chi tiết (vừa minh bạch, vừa tôn trọng nguồn).
- Rate limit hợp lý, tránh gây tải/ảnh hưởng dịch vụ nguồn.

### 14.2. Dữ liệu cá nhân người dùng
- **Việt Nam:** tuân thủ **Nghị định 13/2023/NĐ-CP** về bảo vệ dữ liệu cá nhân (đồng ý, mục đích, quyền của chủ thể dữ liệu).
- **EU (nếu có user):** GDPR — cơ sở pháp lý xử lý, quyền truy cập/xóa (right to erasure), DPA.
- Tối thiểu hóa dữ liệu; mã hóa; chính sách lưu trữ & xóa rõ ràng.

### 14.3. Nội dung & trách nhiệm
- Hiển thị **disclaimer**: thông tin mang tính tham khảo, người dùng cần **xác minh tại nguồn chính thức** trước khi nộp.
- Không đảm bảo kết quả trúng tuyển; miễn trừ trách nhiệm với sai lệch dữ liệu ngoài kiểm soát (kèm cơ chế cập nhật & báo lỗi).

### 14.4. Tài liệu pháp lý cần có
- Điều khoản sử dụng (Terms of Service), Chính sách bảo mật (Privacy Policy), Chính sách cookie, cơ chế báo lỗi/gỡ nội dung theo yêu cầu nguồn.

---

## 15. Chỉ số thành công (KPIs / Metrics)

### 15.1. Dữ liệu (Data)
- Số học bổng đã chuẩn hóa & published.
- **Độ tươi (freshness):** % bản ghi được xác thực trong 30/60 ngày.
- Tỷ lệ dữ liệu lỗi bị người dùng báo cáo.

### 15.2. Tương tác (Engagement)
- % người dùng tạo hồ sơ; % hoàn thiện hồ sơ.
- Số học bổng lưu / theo dõi trung bình mỗi user.
- CTR từ danh sách gợi ý → chi tiết → nút "tới nguồn".

### 15.3. Giá trị cốt lõi (Core value)
- **Match relevance:** % học bổng gợi ý được user lưu/mở (proxy cho độ phù hợp).
- **Tỷ lệ mở nhắc hạn** & % người dùng cập nhật trạng thái "đã nộp".

### 15.4. Kinh doanh (Business)
- Retention (D7/D30), MAU/WAU.
- Conversion sang gói trả phí (nếu freemium); doanh thu affiliate/B2B.

---

## 16. Mô hình kinh doanh (Monetization — tham khảo)

| Mô hình | Mô tả | Giai đoạn |
|---|---|---|
| **Freemium** | Miễn phí tìm kiếm cơ bản; trả phí cho: gợi ý nâng cao, alert không giới hạn, application tracker, so sánh sâu, xuất lịch. | Phase 2 |
| **Affiliate/Referral** | Giới thiệu khóa luyện IELTS, dịch thuật, bảo hiểm du học, mở tài khoản ngân hàng du học. | Phase 2 |
| **B2B cho trung tâm tư vấn du học** | Gói đội nhóm: quản lý nhiều học viên, báo cáo, thương hiệu riêng. | Phase 3 |
| **Quảng cáo có kiểm soát** | Vị trí "Học bổng nổi bật/Trường đối tác" gắn nhãn rõ ràng. | Phase 2/3 |
| **Dữ liệu/Insights (ẩn danh, hợp pháp)** | Báo cáo xu hướng học bổng cho đối tác giáo dục. | Phase 3 |

> Nguyên tắc: **giữ trải nghiệm cốt lõi miễn phí & trung thực**; kiếm tiền ở lớp giá trị gia tăng, không đánh đổi độ tin cậy.

---

## 17. Lộ trình phát triển (Roadmap / Phân kỳ)

### 17.1. MVP (Giai đoạn 1) — ~2–3 tháng
- E1 Onboarding & Hồ sơ; E2 Tìm kiếm & Lọc; E3 Match Score cơ bản (rule-based); E4 Chi tiết + Intake/Deadline; E5 Lưu; E6 Nhắc hạn (email); E10 Admin/Moderation cơ bản; E11 Pipeline cho 5–8 nguồn trọng điểm.
- Dữ liệu: 500–1.000 học bổng chuẩn hóa từ các nước ưu tiên.
- Web responsive, i18n VN/EN, SEO cơ bản.

### 17.2. Phase 2 — ~2–3 tháng tiếp
- E7 Alerts/Saved Search; E8 Application Tracker; push notification; export .ics/Google Calendar; E9 Blog/SEO mở rộng; E13 Analytics; bắt đầu Freemium.

### 17.3. Phase 3 — mở rộng
- E12 B2B đội nhóm; nâng cấp matching bằng ML; PWA/app mobile; mở rộng nguồn & quốc gia; hợp tác API chính thức với trường/tổ chức.

### 17.4. Cột mốc & tiêu chí ra mắt (Launch criteria — MVP)
- ≥ 500 học bổng đã duyệt; luồng 9.1 & 9.2 hoạt động end-to-end; nhắc hạn gửi đúng; Admin duyệt được dữ liệu; đạt NFR-01/04/05/10.

---

## 18. Rủi ro & Giảm thiểu (Risks & Mitigations)

| # | Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|---|
| R1 | Nguồn chặn crawl / thay đổi cấu trúc HTML | Mất/dữ liệu sai | Ưu tiên API; giám sát pipeline; parser linh hoạt; nhập thủ công dự phòng |
| R2 | Vấn đề pháp lý về crawl/ToS | Rủi ro pháp lý | Rà soát pháp lý theo nguồn; ưu tiên hợp tác chính thức; disclaimer & gỡ theo yêu cầu |
| R3 | Dữ liệu lỗi thời gây user nộp sai | Mất niềm tin | Hiển thị nguồn + ngày cập nhật; review lại định kỳ; cơ chế báo lỗi |
| R4 | Match Score không chính xác | Giảm giá trị cốt lõi | Explainability; thu feedback; tinh chỉnh trọng số; A/B test |
| R5 | Chi phí hạ tầng/crawl tăng | Đội chi phí | Bắt đầu nguồn trọng điểm; cache; scale dần |
| R6 | Bảo mật dữ liệu cá nhân | Pháp lý & uy tín | Tuân thủ ND13/GDPR; kiểm thử bảo mật; tối thiểu hóa dữ liệu |
| R7 | Cạnh tranh với trang tổng hợp lớn | Khó thu hút | Khác biệt bằng cá nhân hóa + nhắc hạn + dữ liệu tươi + tiếng Việt |

---

## 19. Câu hỏi mở & Việc cần chốt (Open Questions)

1. **Danh sách nguồn ưu tiên cụ thể** cho MVP (chốt 5–8 nguồn nào trước)?
2. Phạm vi quốc gia MVP: nên bắt đầu hẹp (vd Đức, Nhật, Hàn, Úc, Canada) rồi mở rộng?
3. Ngân sách & timeline mong muốn → ảnh hưởng chọn stack (Next.js đầy đủ vs Supabase nhẹ).
4. Có sẵn đội kỹ thuật/định hướng ngôn ngữ lập trình quen thuộc không?
5. Định hướng thương hiệu & tên miền (ScholarFinder hay tên khác)?
6. Có nhu cầu B2B (trung tâm du học) sớm không → ảnh hưởng thiết kế tài khoản.

---

## 20. Phụ lục — Từ điển thuật ngữ (Glossary)

| Thuật ngữ | Giải thích |
|---|---|
| **Học bổng toàn phần (Full scholarship)** | Chi trả toàn bộ: học phí + sinh hoạt phí (đôi khi cả vé máy bay, bảo hiểm). |
| **Học bổng bán phần (Partial)** | Chỉ hỗ trợ một phần (thường là học phí hoặc một phần học phí). |
| **Tuition waiver** | Miễn/giảm học phí (không nhất thiết có sinh hoạt phí). |
| **Stipend** | Trợ cấp sinh hoạt định kỳ cho người nhận học bổng. |
| **Intake / Kỳ nhập học** | Đợt tuyển sinh nhập học (vd Fall, Spring, Summer) của một năm học. |
| **Deadline (early/regular)** | Hạn nộp sớm / hạn nộp thường; học bổng có thể có deadline riêng khác deadline chương trình. |
| **Eligibility** | Điều kiện dự tuyển (GPA, ngoại ngữ, quốc tịch, ngành, bậc học…). |
| **Match Score** | Điểm phù hợp giữa hồ sơ người dùng và học bổng (0–100%). |
| **Saved Search / Alert** | Bộ lọc đã lưu để nhận thông báo khi có học bổng mới khớp. |
| **Crawling / Parsing / Normalization** | Thu thập / bóc tách / chuẩn hóa dữ liệu về định dạng thống nhất. |
| **Dedupe** | Khử trùng lặp bản ghi từ nhiều nguồn. |
| **RBAC** | Phân quyền theo vai trò. |

---

*— Hết tài liệu v1.0. Vui lòng review và cho phản hồi ở §19 để tôi cập nhật, đồng thời quyết định bước dựng website tiếp theo. —*
