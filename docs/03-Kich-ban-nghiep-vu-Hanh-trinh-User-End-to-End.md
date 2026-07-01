# TÀI LIỆU NGHIỆP VỤ — KỊCH BẢN HÀNH TRÌNH NGƯỜI DÙNG (End-to-End)
# "Từ lúc mở web đến khi apply thành công & lên đường du học"

> Tài liệu này viết **hoàn toàn theo góc nhìn user**, mô tả **flow nghiệp vụ hoàn chỉnh** với đầy đủ: thao tác của user, phần hệ thống **tự động** làm, dữ liệu cần có, và kết quả chuyển tiếp giữa các bước.
> Bổ sung cho `01-BRD` và `02-Bổ sung`. Bổ sung 2 Epic mới: **E18 (Trợ lý viết hồ sơ)**, **E19 (Tự động hóa tìm kiếm & cập nhật)**.

---

## 0. Cách đọc & Nguyên tắc thiết kế

**Triết lý:** User **chỉ cần đi theo dòng chảy** mà hệ thống dẫn dắt. Ở mỗi bước, hệ thống luôn trả lời 3 câu:
1. **"Bây giờ tôi nên làm gì?"** (next action rõ ràng)
2. **"Tôi cần chuẩn bị gì?"** (checklist cụ thể)
3. **"Còn bao lâu nữa?"** (deadline & nhắc hạn)

**Tự động hóa xuyên suốt:** tìm kiếm theo tiêu chí đã lưu chạy nền; học bổng đang theo dõi được cập nhật tự động; cảnh báo chủ động — user **không phải tự đi kiểm tra thủ công**.

---

## 1. SƠ ĐỒ FLOW TỔNG (Master Flow)

```
        ┌──────────────────────────────────────────────────────────────────────┐
        │                     HÀNH TRÌNH DU HỌC CỦA USER                        │
        └──────────────────────────────────────────────────────────────────────┘

 GĐ0        GĐ1              GĐ2            GĐ3           GĐ4            GĐ5
 Hồ sơ  →  Tìm kiếm    →   Chọn lọc   →  Nghiên cứu  → Giáo sư    →  Lập kế
 của tôi   (tự chọn        (shortlist    học bổng      hướng dẫn     hoạch &
           tiêu chí)       reach/match)  đã chọn       (research)    checklist
                │                                                        │
                │  (Search Agent chạy nền, tự cập nhật — E19)            ▼
                │                                              GĐ6  Chuẩn bị hồ sơ
                ▼                                                   (E18: SOP/CV/LOR)
        ┌───────────────┐                                                │
        │ Bảng theo dõi │◄───────── đồng bộ trạng thái ─────────────────┤
        │  (E17) + Nhắc │                                                ▼
        │  hạn (E6/E7)  │                                       GĐ7  Nộp hồ sơ
        └───────────────┘                                                │
                ▲                                                        ▼
                └──────── cảnh báo, cập nhật ─────────  GĐ8  Sau nộp → Kết quả →
                                                        Phỏng vấn → Trúng tuyển →
                                                        Visa & lên đường 🎓
```

**Bảng tổng 9 giai đoạn**

| GĐ | Tên giai đoạn | Mục tiêu của user | Kết quả đầu ra |
|---|---|---|---|
| 0 | Hồ sơ của tôi | Khai báo nền tảng & mục tiêu | Hồ sơ để cá nhân hóa |
| 1 | Tìm kiếm (tự chọn tiêu chí) | Khoanh vùng cơ hội theo ý muốn | Danh sách trường/ngành/học bổng khớp |
| 2 | Chọn lọc (Shortlist) | So sánh & chọn mục tiêu | Shortlist phân nhóm |
| 3 | Nghiên cứu học bổng đã chọn | Hiểu yêu cầu & deadline | Quyết định "sẽ apply" |
| 4 | Giáo sư hướng dẫn | Tìm & liên hệ supervisor | GS mục tiêu + đã liên hệ |
| 5 | Lập kế hoạch & checklist | Biết cần làm gì, khi nào | To-do list + timeline |
| 6 | Chuẩn bị hồ sơ | Viết & hoàn thiện giấy tờ | Bộ hồ sơ sẵn sàng |
| 7 | Nộp hồ sơ | Nộp đúng hạn, đủ giấy tờ | Đã nộp |
| 8 | Sau nộp → Kết quả → Lên đường | Phỏng vấn, kết quả, visa | Trúng tuyển & đi du học |

---

## 2. GIAI ĐOẠN 0 — "HỒ SƠ CỦA TÔI" (Khởi tạo)

**Mục tiêu user:** Cho hệ thống biết mình là ai để mọi gợi ý về sau đều đúng.

**User làm gì:**
- Đăng ký/đăng nhập (hoặc dùng thử guest).
- Khai báo hồ sơ (progressive — điền dần): xem chi tiết trường ở `01-BRD §7.1 FR-E1-02`.
  - Bậc học mục tiêu, ngành, quốc gia mong muốn, GPA + thang điểm, ngoại ngữ, chuẩn hóa (GRE…), kinh nghiệm, ngân sách/nhu cầu tài chính, kỳ nhập học, quốc tịch, **hướng nghiên cứu** (nếu PhD/Master research).

**Hệ thống tự động:**
- Quy đổi GPA & ngoại ngữ về thang chung.
- Tính **độ hoàn thiện hồ sơ (%)** và nhắc bổ sung phần còn thiếu để chấm khớp chính xác hơn.
- Tạo sẵn "hồ sơ nghiên cứu" (research keywords) từ hướng NC user nhập → dùng cho GĐ4.

**Đầu ra:** Hồ sơ chuẩn hóa → là đầu vào cho Match Score & Search Agent.

---

## 3. GIAI ĐOẠN 1 — TÌM KIẾM: USER TỰ CHỌN TIÊU CHÍ (trọng tâm)

**Mục tiêu user:** Tự tay khoanh vùng: "Tôi muốn học **ở đâu, trường tầm nào, khoa/ngành gì, loại học bổng nào**".

### 3.1. Bộ tiêu chí user tự chọn (Search Builder)
> User có thể chọn **nhiều tầng** — từ rộng đến hẹp. Mỗi tiêu chí đều tùy chọn; bỏ trống = không giới hạn.

| # | Tiêu chí | Cách chọn | Ghi chú |
|---|---|---|---|
| 1 | **Khu vực / Quốc gia** | Chọn khu vực (Âu/Bắc Mỹ/Á/Úc…) → quốc gia (đa chọn) | Có cờ, gợi ý theo hồ sơ |
| 2 | **Thành phố** (tùy chọn) | Sau khi chọn quốc gia | Lọc chi phí sống |
| 3 | **Hạng trường (Ranking)** | Khoảng: Top 50 / 100 / 200 / 500 / Mọi hạng; theo **QS / THE / ARWU** | Chọn nguồn xếp hạng |
| 4 | **Trường cụ thể** (tùy chọn) | Gõ tên/đa chọn | Nếu đã có trường mơ ước |
| 5 | **Khoa / Faculty** | Theo cây khoa của trường/ngành | VD: Faculty of Engineering |
| 6 | **Ngành / Chuyên ngành** | Danh mục chuẩn (ISCED/CIP), đa chọn | VD: Computer Science → AI |
| 7 | **Bậc học** | Cử nhân / Thạc sĩ (coursework/research) / Tiến sĩ / Postdoc | |
| 8 | **Loại học bổng** | Chính phủ / Trường / Tổ chức / Doanh nghiệp | (E14) |
| 9 | **Mức tài trợ** | Toàn phần / Bán phần / Chỉ học phí / Stipend | |
| 10 | **Ngôn ngữ giảng dạy** | Tiếng Anh / bản ngữ / song ngữ | |
| 11 | **Học phí** | Khoảng ngân sách / "Miễn học phí" | |
| 12 | **Chi phí sinh hoạt** | Thấp / Trung / Cao (theo thành phố) | |
| 13 | **Ngưỡng ngoại ngữ** | Lọc HB mà user **đủ điều kiện** (theo hồ sơ) | Ẩn HB quá tầm |
| 14 | **Yêu cầu chuẩn hóa** | Cần/không cần GRE·GMAT·SAT | |
| 15 | **Kỳ nhập học** | Fall/Spring/Summer + năm | |
| 16 | **Cần liên hệ giáo sư?** | Có / Không / Không quan trọng | Kích hoạt GĐ4 |
| 17 | **Hướng nghiên cứu** | Nhập keyword (research) | Cho PhD/Master research |
| 18 | **Ràng buộc sau TN** | Chấp nhận cam kết về nước? Có/Không | Lọc HB chính phủ |

### 3.2. Hệ thống tự động làm gì
- **Chạy tìm kiếm tức thì** trên dữ liệu đã crawl & chuẩn hóa; cập nhật số kết quả theo thời gian thực khi user chỉnh tiêu chí.
- **Chấm Match Score** (nếu đã có hồ sơ) & xếp theo mức phù hợp; hiển thị lý do khớp/lệch.
- **Gom kết quả theo 3 lớp:** Trường → Ngành/Chương trình → Học bổng (user có thể duyệt ở bất kỳ lớp nào).
- **Lưu bộ tiêu chí** thành **Search Agent** (E19) để chạy nền tự động về sau (§10).

### 3.3. Kết quả hiển thị (3 góc nhìn)
- **Theo Học bổng:** thẻ học bổng + Match% + deadline + mức tài trợ.
- **Theo Trường:** thẻ trường (hạng, quốc gia, số HB đang mở, số ngành khớp).
- **Theo Ngành/Chương trình:** chương trình khớp + trường + học bổng gắn kèm.

### 3.4. Wireframe mô tả (Trang tìm kiếm)
```
┌───────────────── BỘ LỌC (trái) ─────────────┬──── KẾT QUẢ (phải) ─────────────┐
│ Khu vực ▸ Quốc gia ▸ Thành phố               │ Xem theo: [Học bổng][Trường][Ngành]│
│ Hạng trường: (•)Top100 ( )Top200  Nguồn:QS▾  │ Sắp xếp: [Phù hợp][Deadline][Mới] │
│ Trường: [＋ thêm]   Khoa: [＋]  Ngành: [＋]   │ ┌─────────────────────────────────┐│
│ Bậc học ▾  Loại HB ▾  Mức tài trợ ▾          │ │ 🎓 DAAD EPOS – TU Munich  88% ✅ ││
│ Ngôn ngữ ▾  Học phí: [0 ─────] "Miễn HP"☑    │ │ 🇩🇪 Toàn phần · Deadline 15/10   ││
│ Cần liên hệ GS: ( )Có (•)Không (○)Bất kỳ     │ │ [Lưu] [So sánh] [Xem chi tiết]  ││
│ Hướng NC: [machine learning ✕]               │ └─────────────────────────────────┘│
│ [Lưu tiêu chí → Bật tự động 🔔]              │ … (danh sách, phân trang)         │
└──────────────────────────────────────────────┴───────────────────────────────────┘
```

**Đầu ra GĐ1:** Danh sách khớp + (tùy chọn) một **Search Agent** đã lưu.

---

## 4. GIAI ĐOẠN 2 — CHỌN LỌC & SHORTLIST

**Mục tiêu user:** So sánh và chốt danh sách mục tiêu thực sự.

**User làm gì:**
- Mở chi tiết trường/ngành/học bổng; dùng **So sánh** (2–4 mục cạnh nhau).
- Đưa vào **Shortlist**, tự phân nhóm: **Ước mơ (reach) / Vừa tầm (match) / An toàn (safe)** — hệ thống gợi ý nhóm dựa trên Match Score.

**Hệ thống tự động:**
- Bảng so sánh: mức tài trợ, điều kiện, deadline, hạng trường, học phí, Match%.
- Gợi ý cân đối shortlist (VD: "Bạn có 5 reach, 0 safe → nên thêm 1–2 lựa chọn an toàn").
- Mọi mục shortlist tự xuất hiện ở **Bảng theo dõi (E17)** trạng thái *Quan tâm*.

**Thông tin TRƯỜNG hiển thị (đầy đủ):**
- Tên, quốc gia, thành phố, **hạng (QS/THE/ARWU) + năm**, loại (công/tư), website.
- Khoa/Faculty & danh sách ngành/chương trình.
- Học phí theo bậc học, chi phí sinh hoạt ước tính, ngôn ngữ giảng dạy.
- Học bổng đang mở của trường; kỳ nhập học & deadline chung.
- Yêu cầu đầu vào chung (GPA, ngoại ngữ), tỷ lệ chấp nhận (nếu có, "ước tính").

**Thông tin NGÀNH/CHƯƠNG TRÌNH:**
- Tên chương trình, bậc, khoa, thời lượng, ngôn ngữ, học phí.
- Nội dung học (môn/định hướng), yêu cầu đầu vào riêng, hồ sơ cần.
- Học bổng áp dụng; **giáo sư/nhóm nghiên cứu thuộc ngành** (liên kết GĐ4).

**Đầu ra GĐ2:** Shortlist phân nhóm (reach/match/safe) trong Bảng theo dõi.

---

## 5. GIAI ĐOẠN 3 — NGHIÊN CỨU HỌC BỔNG ĐÃ CHỌN

**Mục tiêu user:** Với mỗi học bổng "sẽ apply", hiểu **chính xác** cần gì.

**User thấy gì (trang chi tiết học bổng — đầy đủ):**
- Tổ chức cấp, trường, quốc gia, **loại & mức tài trợ + quyền lợi chi tiết** (học phí, sinh hoạt, vé máy bay, bảo hiểm…).
- **Điều kiện dự tuyển (eligibility)** đã chuẩn hóa + trích nguyên văn nguồn + link chính thức + ngày cập nhật + badge độ tin cậy.
- **Hồ sơ cần nộp** (documents checklist thô).
- **Kỳ nhập học & các mốc deadline** (mở đơn, early, regular, deadline học bổng, kết quả, nhập học) — theo giờ VN + giờ gốc.
- **Có cần liên hệ giáo sư không** (D8) → nếu có, nút "Tìm giáo sư phù hợp".
- **Ràng buộc sau tốt nghiệp** (nếu có).
- Match% cá nhân + breakdown ✅/⚠️/❌.

**Hệ thống tự động:**
- So khớp điều kiện học bổng với hồ sơ user → nêu rõ **"bạn còn thiếu gì"** (VD: IELTS 6.0 → cần 6.5).
- Khi user bấm **"Tôi sẽ apply"** → chuyển trạng thái sang *Đang nghiên cứu/Chuẩn bị* ở Bảng theo dõi và **kích hoạt GĐ4–6** (tạo checklist, gợi ý giáo sư, dựng timeline).

**Đầu ra GĐ3:** Quyết định "sẽ apply" → mở khóa các bước chuẩn bị.

---

## 6. GIAI ĐOẠN 4 — GIÁO SƯ HƯỚNG DẪN (cho học bổng nghiên cứu)

> Chi tiết đầy đủ ở `02-Bổ sung §B (E15)`. Đây là mô tả **theo flow user**.

**Mục tiêu user:** Tìm đúng giáo sư, xem hết thông tin, liên hệ chuyên nghiệp, theo dõi phản hồi.

**Bước 4.1 — Tìm giáo sư phù hợp**
- User bấm "Tìm giáo sư" từ học bổng/chương trình, hoặc tìm theo **hướng nghiên cứu**.
- Hệ thống **tự gợi ý** giáo sư khớp hướng NC của user tại các trường liên quan; hiển thị lý do ("Cùng chủ đề: Computer Vision, Medical Imaging").

**Bước 4.2 — Xem hồ sơ giáo sư (đầy đủ thông tin)**
- Định danh, chức danh, trường/khoa/**lab**, quốc gia.
- **Hướng nghiên cứu & keyword**, tóm tắt hướng NC.
- **Liên hệ:** email công khai, web cá nhân/lab, form.
- **Hồ sơ học thuật:** Google Scholar, ORCID, Semantic Scholar, OpenAlex, ResearchGate, LinkedIn.
- **Chỉ số:** số công bố, trích dẫn, h-index (kèm nguồn & thời điểm).
- **Công bố tiêu biểu** (5–10 bài gần đây, có DOI/link).
- **Dự án/đề tài**, **môn giảng dạy**, **tình trạng tuyển NCS** ("Đang tuyển/Không rõ").
- **Học bổng/chương trình** áp dụng được với giáo sư này.
- Mỗi thông tin có **link nguồn + ngày cập nhật**.

**Bước 4.3 — Liên hệ (Outreach Helper)**
- Hệ thống cung cấp **mẫu email** cá nhân hóa (tự điền tên GS, hướng NC, tên user) — khung ở `02 §B.5`.
- **Checklist trước khi gửi** (đã đọc 1–2 bài của GS? đã nêu lý do phù hợp? đính kèm CV?).
- User gửi từ email cá nhân (hệ thống **không gửi hàng loạt** — chống spam, `02 §B.7`).

**Bước 4.4 — Theo dõi liên hệ**
- Trạng thái: *Chưa liên hệ → Đã gửi → Đã phản hồi → Đồng ý hướng dẫn → Từ chối/Không phản hồi*.
- Nhắc **follow-up** nếu sau N ngày chưa phản hồi.
- Đồng bộ vào **Bảng theo dõi (E17)** cột "Giáo sư".

**Hệ thống tự động:** cập nhật **công bố mới** của giáo sư đang theo dõi; cảnh báo nếu GS đổi trường/đóng tuyển (nếu nguồn công khai).

**Đầu ra GĐ4:** Danh sách giáo sư mục tiêu + trạng thái liên hệ.

---

## 7. GIAI ĐOẠN 5 — LẬP KẾ HOẠCH & DANH SÁCH CẦN THỰC HIỆN

> Chi tiết ở `02-Bổ sung §C (E16)`. Mô tả theo flow user.

**Mục tiêu user:** Biết **chính xác cần làm gì, theo thứ tự nào, hạn khi nào**.

**Hệ thống tự động (khi user chọn "sẽ apply"):**
- **Sinh checklist cá nhân hóa** cho học bổng đó = (yêu cầu HB) + (phân loại E14) + (những gì user đã có trong hồ sơ). Mỗi mục: mô tả, "vì sao cần", hướng dẫn, **link template**, thời gian ước tính, trạng thái.
  - Ví dụ checklist tự sinh (PhD research, Đức):
    - ☐ CV học thuật *(có template)*
    - ☐ SOP/Research Statement
    - ☐ **Research Proposal** *(vì D9=Có)*
    - ☐ **Liên hệ giáo sư** *(vì D8=Bắt buộc → GĐ4)*
    - ☐ 2 Thư giới thiệu (LOR)
    - ☐ Bảng điểm (dịch công chứng)
    - ☐ Bằng/giấy TN dự kiến
    - ☐ IELTS *(user đã có 7.0 → ✅ tự đánh dấu)*
    - ☐ **APS** *(lưu ý riêng cho Đức)*
    - ☐ Đơn đăng ký + (lệ phí nếu có)
- **Timeline ngược từ deadline (Backward Planner):** tự tính các mốc T-6/T-4/T-3/T-2/T-1 tháng và đẩy vào **Lịch (E6)** + Bảng theo dõi.
- **To-do list tổng**: gộp mọi việc của mọi học bổng đang theo đuổi, sắp theo hạn.

**User làm gì:** xem việc, tự đổi trạng thái từng mục, thêm ghi chú, đặt mức nhắc.

**Đầu ra GĐ5:** To-do list + timeline cho từng học bổng, hiển thị % hoàn thành.

---

## 8. GIAI ĐOẠN 6 — CHUẨN BỊ HỒ SƠ (E18: Trợ lý viết hồ sơ)

**Mục tiêu user:** Viết & hoàn thiện được các giấy tờ khó (SOP, CV, LOR, Research Proposal) — có công cụ hỗ trợ.

### 8.1. E18 — Trợ lý viết hồ sơ (Writing Assistant)

**FR-E18-01 — Trình soạn SOP / Personal Statement**
- *AC:* Dàn ý mẫu theo ngành/bậc; câu hỏi gợi mở để user cung cấp chất liệu (thành tích, động lực, mục tiêu); **AI hỗ trợ viết bản nháp** từ chất liệu đó; kiểm tra độ dài theo yêu cầu HB; gợi ý chỉnh giọng văn; **đối chiếu yêu cầu học bổng** (đã nêu đủ ý trường muốn chưa).

**FR-E18-02 — Trình dựng CV học thuật**
- *AC:* Template academic CV; tự điền từ hồ sơ (học vấn, công bố, kinh nghiệm); xuất PDF.

**FR-E18-03 — Thư giới thiệu (LOR) — quy trình khép kín**
- *AC:*
  - User chọn người giới thiệu (giảng viên/sếp), nhập email.
  - Hệ thống gửi **lời mời** + **brag sheet** (tóm tắt thành tích user để người viết tham khảo) + hạn.
  - **Nhắc tự động** người giới thiệu; theo dõi trạng thái (Đã mời → Đang viết → Đã nộp).
  - Có **gợi ý dàn ý thư** cho người giới thiệu tham khảo (kèm lưu ý: nội dung phải do người giới thiệu tự chịu trách nhiệm — đạo đức học thuật, §8.2).

**FR-E18-04 — Research Proposal & Motivation Letter**
- *AC:* Cấu trúc mẫu (bối cảnh, câu hỏi NC, phương pháp, kế hoạch, tài liệu tham khảo); **gợi ý tham chiếu công bố của giáo sư mục tiêu** (từ GĐ4); kiểm tra khớp hướng NC của GS.

**FR-E18-05 — Kiểm tra & hoàn thiện**
- *AC:* Đếm từ/độ dài theo yêu cầu; nhắc tránh đạo văn (khuyến nghị công cụ kiểm tra); checklist "đã cá nhân hóa theo từng trường chưa" (tránh nộp SOP dùng chung).

### 8.2. Đạo đức & minh bạch (AI writing)
- AI **hỗ trợ**, không "viết hộ toàn bộ": nội dung phải phản ánh **trải nghiệm thật** của user; cảnh báo rủi ro nếu nộp bài AI nguyên bản (nhiều trường kiểm tra tính xác thực).
- Với LOR: hệ thống **không giả mạo** người giới thiệu; chỉ hỗ trợ quy trình mời & nhắc; nội dung do người giới thiệu quyết định.

**User làm gì:** dùng công cụ để soạn → tự chỉnh sửa → đánh dấu từng giấy tờ "Xong" → % hồ sơ tăng.

**Đầu ra GĐ6:** Bộ hồ sơ hoàn chỉnh cho từng học bổng (đạt 100% checklist).

---

## 9. GIAI ĐOẠN 7 — NỘP HỒ SƠ & GIAI ĐOẠN 8 — SAU NỘP → KẾT QUẢ → LÊN ĐƯỜNG

### 9.1. GĐ7 — Nộp hồ sơ
**Mục tiêu user:** Nộp **đúng hạn, đủ giấy tờ, đúng cổng**.

**Hệ thống tự động:**
- Trước hạn: kiểm tra checklist đã 100% chưa; cảnh báo nếu còn thiếu.
- Cung cấp **link cổng nộp chính thức** + hướng dẫn nộp (nếu đã biên tập).
- Nhắc "còn N ngày" theo mốc T-30/14/7/3/1 (E6/E7).

**User làm gì:** nộp trên cổng của trường/học bổng → về hệ thống đổi trạng thái sang **"Đã nộp"**, đính kèm mã xác nhận/ảnh chụp (lưu trữ cá nhân).

### 9.2. GĐ8 — Sau nộp
**Các trạng thái tiếp theo (Bảng theo dõi E17):**
- **Phỏng vấn:** hệ thống lưu lịch phỏng vấn, nhắc hạn, gợi ý bộ câu hỏi thường gặp (nội dung E9).
- **Kết quả:** *Trúng tuyển / Danh sách chờ / Từ chối / Rút*.
- **Sau trúng tuyển — "Lên đường":** checklist hậu trúng tuyển:
  - Chấp nhận offer (accept), đặt cọc (nếu có).
  - **Thư mời nhập học (CoE/Admission letter)** → hồ sơ **visa** (checklist visa theo nước).
  - Chứng minh tài chính, bảo hiểm, khám sức khỏe.
  - Đặt vé, tìm nhà ở/ký túc xá, mở tài khoản ngân hàng.
  - Mốc nhập học & định hướng (orientation).

**Hệ thống tự động:** sinh checklist visa & pre-departure theo quốc gia trúng tuyển; nhắc các mốc.

**Đầu ra:** 🎓 **Apply thành công → hoàn tất thủ tục → lên đường du học.**

---

## 10. TỰ ĐỘNG HÓA XUYÊN SUỐT (E19 — Automation Engine)

> Đây là phần hiện thực hóa yêu cầu **"tự động hóa quá trình tìm kiếm theo yêu cầu, tự động cập nhật các học bổng follow"**.

### 10.1. FR-E19-01 — Search Agent (Trợ lý tìm kiếm tự động)
- *User story:* Tôi lưu bộ tiêu chí (GĐ1) và muốn **hệ thống tự tìm giúp** học bổng/trường/ngành mới khớp, không phải vào tìm lại.
- *AC:*
  - Mỗi bộ tiêu chí đã lưu = 1 **Agent** chạy nền theo lịch (VD hằng ngày/tuần).
  - Khi có mục **mới khớp** → thông báo (in-app + email digest) + tự thêm vào mục "Gợi ý mới".
  - User bật/tắt từng Agent, đặt tần suất, xem lịch sử phát hiện.

### 10.2. FR-E19-02 — Tự động cập nhật học bổng đang theo dõi (Follow → Auto-update)
- *User story:* Học bổng tôi đang follow thay đổi (deadline mới, đóng đơn, mở kỳ mới, đổi điều kiện) — tôi muốn được cập nhật ngay.
- *AC:*
  - Pipeline (E11) phát hiện thay đổi trên các bản ghi user đang theo dõi.
  - Tự **cập nhật dữ liệu** + gắn nhãn "Vừa cập nhật" + **cảnh báo** user (đặc biệt: dời/đóng deadline).
  - Ghi **lịch sử thay đổi** để user biết đã đổi gì.

### 10.3. FR-E19-03 — Cập nhật hồ sơ giáo sư đang theo dõi
- *AC:* Định kỳ đồng bộ công bố mới/chỉ số/tình trạng tuyển của giáo sư user đã lưu (nguồn OpenAlex/ORCID…); thông báo nếu có thay đổi đáng chú ý.

### 10.4. FR-E19-04 — Cảnh báo thông minh (Smart Alerts)
- *AC:* Tổng hợp & ưu tiên cảnh báo: **deadline sắp hết hạn** (T-30/14/7/3/1), **hồ sơ chưa xong mà sắp hạn**, **giáo sư đã phản hồi**, **học bổng mới khớp**, **thay đổi điều kiện**. Kênh: in-app, email (MVP), push (Phase 2). Cho phép cấu hình & opt-out.

### 10.5. FR-E19-05 — Bảng điều khiển "Hôm nay cần làm gì"
- *AC:* Trang chủ (đã đăng nhập) hiển thị **"Việc hôm nay"**: deadline gần, việc kế tiếp mỗi học bổng, giáo sư cần follow-up, gợi ý mới từ Search Agent — để user chỉ cần mở lên là biết phải làm gì.

---

## 11. MÔ HÌNH DỮ LIỆU MỞ RỘNG (Trường · Khoa · Ngành · Hạng · Giáo sư · Hướng NC)

> Bổ sung/để chi tiết hơn `01-BRD §10`. Đây là các thực thể để "nhớ đầy đủ thông tin về trường, ngành, giáo sư, hướng nghiên cứu".

**Institution (Trường)**
- `id, name, aliases[], type(public/private), country, city, website, logo`
- `rankings[]` → tham chiếu **Ranking**
- `intro, campus_info, tuition_summary, living_cost_estimate, languages[]`

**Ranking (Hạng trường)**
- `id, institution_id, source(QS/THE/ARWU), year, world_rank, subject_rank?, subject?`
- *(Lưu ý bản quyền dữ liệu xếp hạng — §12.)*

**Faculty (Khoa)**
- `id, institution_id, name, website`

**Program (Chương trình/Ngành)**
- `id, institution_id, faculty_id, name, level, field(chuẩn ISCED/CIP), language, duration, tuition_fee, entry_requirements(JSON), documents_required[], intakes[]`

**ResearchArea (Hướng nghiên cứu)**
- `id, name, keywords[], parent_field` — dùng để nối user ↔ giáo sư ↔ chương trình.

**Professor** — xem `02 §B.4` (gắn `institution_id`, `faculty_id?`, `research_fields[]`, `profiles`, `metrics`, `recruiting_status`, nguồn…).

**Scholarship** — xem `01 §10` + phân loại `02 §A` (gắn `institution_id?`, `program_ids[]`, `requires_supervisor(D8)`, `requires_proposal(D9)`).

**Quan hệ chính (bổ sung):**
```
Institution 1─n Faculty 1─n Program 1─n Intake 1─n Deadline
Institution 1─n Ranking
Institution/Program n─n Scholarship
Program/Institution n─n Professor  (qua ResearchArea)
User(Profile.research_keywords) ─match─ Professor.research_keywords
User 1─n SavedSearch(=Search Agent)  1─n phát hiện (matches)
User 1─n Tracking(=Bảng E17) n─1 Scholarship  (kèm linked_professor, %prep, stage)
```

---

## 12. NGUỒN DỮ LIỆU & TỰ ĐỘNG HÓA THU THẬP (bổ sung)

| Nhóm dữ liệu | Nguồn | Ghi chú |
|---|---|---|
| Học bổng | Cổng chính phủ, web trường, tổ chức (xem `01 §12`) | Ưu tiên API/nguồn chính thức |
| Trường/Khoa/Ngành | Web trường, cổng dữ liệu giáo dục mở | Chuẩn hóa ngành ISCED/CIP |
| **Hạng trường** | QS / THE / ARWU | ⚠️ **Bản quyền**: cần kiểm tra điều khoản/licensing khi hiển thị số hạng; hoặc dùng nguồn mở & ghi nguồn |
| Giáo sư/Công bố | **OpenAlex, Semantic Scholar, ORCID, Crossref** + web khoa | Hợp pháp, có API (xem `02 §B.6–B.7`) |

**Nguyên tắc tự động hóa:** tôn trọng `robots.txt`/ToS, rate limit, ưu tiên API; **kiểm duyệt trước khi hiển thị**; lưu vết nguồn + ngày cập nhật; review lại định kỳ (data freshness).

---

## 13. MA TRẬN TRẠNG THÁI TỔNG (State Machine của một "hồ sơ ứng tuyển")

```
Quan tâm ─▶ Đang nghiên cứu ─▶ (Liên hệ GS)* ─▶ Chuẩn bị hồ sơ ─▶ Đã nộp ─▶ Phỏng vấn ─▶ Kết quả
   │              │                  │                  │             │           │          ├─ Trúng tuyển ─▶ Visa/Pre-departure ─▶ 🎓 Lên đường
   │              │                  │                  │             │           │          ├─ Danh sách chờ
   └──────── có thể Bỏ/Rút ở bất kỳ bước nào ───────────┴─────────────┴───────────┘          ├─ Từ chối
        (*) chỉ áp dụng học bổng nghiên cứu (D8 ≠ Không cần)                                   └─ Rút
```
- Mỗi lần đổi trạng thái được ghi log (StageHistory) để thống kê thời gian & tỷ lệ chuyển đổi.
- Trạng thái đồng bộ 2 chiều giữa GĐ4 (GS), GĐ5–6 (checklist/%), và Bảng theo dõi E17.

---

## 14. CẬP NHẬT EPIC & ROADMAP (liên quan)

**Epic mới**
| Mã | Epic | Ưu tiên | Giai đoạn |
|---|---|---|---|
| **E18** | Trợ lý viết hồ sơ (SOP/CV/LOR/Proposal) | Cao | MVP (template) → Phase 2 (AI assist đầy đủ) |
| **E19** | Tự động hóa tìm kiếm & cập nhật (Search Agent, Auto-update, Smart Alerts) | Cao | MVP (cơ bản) → Phase 2 (đầy đủ) |

**Điều chỉnh Roadmap:**
- **MVP:** GĐ0–3 + GĐ5 (checklist) + E17 (bảng theo dõi) + E19 cơ bản (lưu tiêu chí + alert deadline/HB mới) + E15 mức cơ bản. E18 ở mức **template tải về**.
- **Phase 2:** GĐ4 đầy đủ (Professor Match + Outreach), E18 AI assist & quy trình LOR khép kín, E19 đầy đủ (agent chạy nền + auto-update + smart alerts), GĐ8 pre-departure/visa.

---

## 15. TÓM TẮT: 1 CÂU CHO MỖI GIAI ĐOẠN (để user luôn biết mình ở đâu)

1. **Hồ sơ của tôi** — "Cho tôi biết bạn là ai."
2. **Tìm kiếm** — "Chọn khu vực, hạng trường, khoa, ngành, loại học bổng — tôi lọc giúp."
3. **Chọn lọc** — "So sánh và chốt danh sách mục tiêu."
4. **Nghiên cứu học bổng** — "Đây là tất cả yêu cầu & hạn nộp."
5. **Giáo sư** — "Đây là giáo sư phù hợp và cách liên hệ."
6. **Kế hoạch** — "Đây là danh sách việc cần làm và khi nào."
7. **Chuẩn bị hồ sơ** — "Tôi giúp bạn viết SOP, CV, xin thư giới thiệu."
8. **Nộp & theo dõi** — "Tôi nhắc hạn, bạn chỉ việc nộp đúng lúc."
9. **Kết quả & lên đường** — "Trúng tuyển rồi — đây là thủ tục visa & chuẩn bị đi."

---

*— Hết tài liệu 03 (v1.0). Bộ tài liệu nghiệp vụ nay gồm: 01 (BRD tổng), 02 (Phân loại/Giáo sư/Chuẩn bị/Theo dõi), 03 (Hành trình end-to-end). Sẵn sàng cho bước dựng website demo minh họa toàn bộ flow. —*
