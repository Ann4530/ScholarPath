# Hướng dẫn Deploy lên Vercel + Giới hạn truy cập (đăng nhập Google)

Website đã được cấu hình **chặn toàn bộ trang**: chỉ người đăng nhập bằng **email nằm trong danh sách cho phép** mới vào được. Ai chưa đăng nhập sẽ bị chuyển về `/login`.

- Cơ chế: **Auth.js (NextAuth v5)** + đăng nhập Google + allowlist email, chặn ở `web/proxy.ts` (Next.js 16 gọi middleware là *proxy*).
- Không cần database. Phiên đăng nhập lưu bằng cookie đã ký (JWT).

> Repo đã commit sẵn (nhánh `main`). File bí mật `web/.env.local` **không** được commit — bí mật sẽ đặt trong Vercel.

---

## Tổng quan 4 bước
1. Đẩy code lên GitHub.
2. Tạo Google OAuth (Client ID/Secret).
3. Import vào Vercel + đặt biến môi trường + Root Directory = `web`.
4. Thêm domain Vercel vào Google redirect URI → xong.

---

## Bước 1 — Đẩy code lên GitHub

Bạn đã có GitHub. Tạo 1 repo trống trên GitHub (ví dụ `find-scholar`), rồi trong thư mục dự án chạy:

```bash
git remote add origin https://github.com/<tên-github>/find-scholar.git
git push -u origin main
```

> Hoặc dùng GitHub CLI: `gh repo create find-scholar --private --source . --push`

---

## Bước 2 — Tạo Google OAuth Credentials

1. Vào **Google Cloud Console** → https://console.cloud.google.com → tạo **Project** mới (vd "ScholarFinder").
2. **APIs & Services → OAuth consent screen**:
   - User type: **External** → Create.
   - Điền App name, User support email, Developer email.
   - (Nếu để chế độ **Testing**) mục **Test users** → thêm chính các email bạn muốn cho vào. *(Đây là lớp chặn thứ hai của Google; app vẫn chạy tốt ở chế độ Testing.)*
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized redirect URIs** — thêm 2 URI (điền domain Vercel sau khi có ở Bước 4, tạm thời thêm localhost trước):
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<domain-vercel-cua-ban>/api/auth/callback/google`
   - Create → **copy Client ID và Client Secret**.

---

## Bước 3 — Import vào Vercel & đặt biến môi trường

1. Vào https://vercel.com → **Add New… → Project** → chọn repo `find-scholar` vừa đẩy lên.
2. **Root Directory**: bấm *Edit* → chọn **`web`** *(vì ứng dụng Next.js nằm trong thư mục `web/`)*. Framework tự nhận là Next.js.
3. Mở **Environment Variables**, thêm 4 biến sau (áp dụng cho Production + Preview):

| Tên biến | Giá trị |
|---|---|
| `AUTH_SECRET` | Chuỗi ngẫu nhiên (xem bên dưới) |
| `ALLOWED_EMAILS` | Danh sách email được phép, cách nhau dấu phẩy. VD: `stephenvu98@gmail.com, ban@congty.com` |
| `AUTH_GOOGLE_ID` | Client ID từ Bước 2 |
| `AUTH_GOOGLE_SECRET` | Client Secret từ Bước 2 |

   - Tạo `AUTH_SECRET`: chạy `npx auth secret` (in ra 1 chuỗi), hoặc dùng chuỗi bất kỳ ≥ 32 ký tự ngẫu nhiên.
4. Bấm **Deploy**.

---

## Bước 4 — Nối domain Vercel với Google & kiểm tra

1. Sau khi deploy xong, Vercel cho bạn domain, vd `https://find-scholar.vercel.app`.
2. Quay lại **Google Cloud → Credentials → OAuth client** → thêm/chỉnh **Authorized redirect URI**:
   - `https://find-scholar.vercel.app/api/auth/callback/google`
   - (Nếu dùng domain riêng thì thêm domain đó tương tự.)
3. Mở `https://find-scholar.vercel.app`:
   - Chưa đăng nhập → tự chuyển tới `/login`.
   - Bấm **Đăng nhập với Google**:
     - Email **có** trong `ALLOWED_EMAILS` → vào được.
     - Email **không** có trong danh sách → báo "không nằm trong danh sách được phép".

> ⚠️ **Lưu ý:** Google chỉ chấp nhận đúng domain đã đăng ký redirect URI. Domain **production** ổn định (vd `find-scholar.vercel.app`) sẽ đăng nhập được. Các bản **Preview** (URL ngẫu nhiên mỗi lần) sẽ không đăng nhập Google được trừ khi bạn thêm URL đó — nên test trên domain production.

---

## Quản lý về sau

- **Thêm/bớt người được phép:** Vercel → Project → **Settings → Environment Variables** → sửa `ALLOWED_EMAILS` → **Redeploy** (Deployments → … → Redeploy).
- **Đổi khóa phiên:** đổi `AUTH_SECRET` (sẽ đăng xuất mọi người).
- **CI/CD:** mỗi lần `git push` lên `main`, Vercel tự build & deploy lại.

---

## Chạy & kiểm thử ở máy (tùy chọn)
File `web/.env.local` đã có sẵn `AUTH_SECRET` và `ALLOWED_EMAILS`. Chỉ cần điền `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` để test đăng nhập ở `http://localhost:3000`:
```bash
cd web
npm run dev
```

---

## Phương án thay thế (không dùng Google)
Nếu không muốn cấu hình Google OAuth, có thể đổi sang:
- **Một mật khẩu chung** (HTTP Basic Auth trong `proxy.ts`) — đơn giản, không cần OAuth, nhưng không biết ai truy cập.
- **Đăng nhập bằng liên kết email (magic link)** — cần dịch vụ gửi email (SMTP).

Cho tôi biết nếu bạn muốn chuyển sang một trong hai cách này.
