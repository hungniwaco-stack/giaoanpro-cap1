---
description: Quy trình chuẩn dựng và triển khai app "AI Giáo Án Pro — Cấp 1" (Tiểu học) từ đầu đến khi chạy thật trên production, dựa trên toàn bộ quy trình đã làm thành công với app Cấp 2 (THCS). Dùng skill này bất cứ khi nào người dùng nói "tạo dự án cấp 1", "làm app tiểu học", "dựng giáo án tiểu học", hoặc nhắc tới việc mở rộng AI Giáo Án Pro sang cấp Tiểu học — kể cả khi họ không gõ đúng những từ này.
---

# Tạo dự án AI Giáo Án Pro — Cấp 1 (Tiểu học)

File này là quy trình **độc lập, đầy đủ** — không phụ thuộc file skill cấp 3. Đọc hết trước khi bắt đầu, đi theo đúng thứ tự các Phase. Mỗi Phase có mục "Vì sao" giải thích lý do, không chỉ liệt kê việc phải làm — khi gặp tình huống khác thực tế mô tả, dùng phần "Vì sao" để tự quyết định thay vì bó cứng theo câu chữ.

**Dự án tham khảo (bản mẫu để copy pattern)**: `D:\Giao-An-Pro-2026\Giao-an-cap-2\` — đây là app Cấp 2 đã build, deploy, và chạy thật thành công. Hầu hết code hạ tầng (trial-guard, docx/pptx generator, thanh toán SePay, thiết kế notebook/stamp) đều copy được gần như nguyên vẹn từ đây, chỉ cần đổi phần nội dung đặc thù cấp học. Đừng viết lại từ đầu — đọc file tương ứng bên cấp 2 rồi thích nghi.

## Phase 0 — Xác nhận trước khi code (bắt buộc, đừng đoán)

Hỏi người dùng (hoặc xác nhận nếu đã biết) trước khi viết Master Prompt cho AI:

1. **Chuẩn chương trình áp dụng cho Tiểu học.** App Cấp 2 dùng Công văn 5512/BGDĐT-GDTrH — công văn này áp dụng cho THCS/THPT. Tiểu học có thể dùng khung khác (ví dụ Công văn 2345/BGDĐT-GDTH về xây dựng kế hoạch giáo dục). **Đừng copy nguyên "chuẩn 5512" sang cấp 1 mà không xác nhận** — sai chuẩn ở đây là lỗi nội dung thật, không phải lỗi kỹ thuật.
2. **Danh sách môn học lớp 1–5.** Khác nhiều so với THCS: lớp 1–2 có Tiếng Việt, Toán, Đạo đức, Tự nhiên và Xã hội, Giáo dục thể chất, Âm nhạc, Mỹ thuật, Hoạt động trải nghiệm; lớp 3–5 thêm Tin học, Công nghệ, Tiếng Anh, và Tự nhiên-Xã hội tách thành Khoa học + Lịch sử-Địa lý. Xác nhận danh sách chính xác theo khối lớp thay vì dùng chung 1 danh sách cho cả 1–5 như `MON_HOC` bên cấp 2 đang làm (cấp 2 dùng 1 danh sách chung vì lớp 6–9 tương đối đồng nhất — tiểu học thì không).
3. **Bộ sách giáo khoa** — vẫn là "Kết nối tri thức với cuộc sống" hay khác? Xác nhận, đừng giả định giống cấp 2.
4. **Tên miền phụ**: `cap1.giaoanpro.com` (đã thống nhất theo kiến trúc chung — subdomain riêng cho từng cấp dưới domain gốc `giaoanpro.com`).
5. **Tên GitHub repo**: `giaoanpro-cap1`, dưới account `hungniwaco-stack`.

## Phase 1 — Scaffold dự án

```bash
cd "D:\Giao-An-Pro-2026"
npx create-next-app@latest giao-an-cap-1 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

Nếu tên thư mục chứa dấu/khoảng trắng và `create-next-app` báo lỗi đặt tên package — scaffold vào thư mục tạm tên hợp lệ rồi `mv`/`cp -r` nội dung sang, đúng như đã làm với cấp 2. Thư mục `D:\Giao-An-Pro-2026\Giao-an-cap-1` là thư mục anh em (sibling) của `Giao-an-cap-2`, **không phải** thư mục con bên trong nó.

**Sửa ngay 1 bug đã biết trước khi làm gì khác**: `src/app/globals.css` mặc định của `create-next-app` có block:
```css
:root { --background: #ffffff; --foreground: #171717; }
body { background: var(--background); color: var(--foreground); ... }
```
Rule `body { background: ... }` này nằm ngoài Tailwind layer nên **đè cả class `bg-*` sau này**, làm nền tối/màu thương hiệu không lên được (đã xảy ra thật ở cấp 2, mất công debug). Xoá block này ngay từ đầu, thay bằng token màu trong `@theme` giống cấp 2.

## Phase 2 — Cài dependencies

```bash
npm install zustand docx pptxgenjs framer-motion @google/genai @upstash/redis resend
```

(Tailwind đã có sẵn từ scaffold.) `npm audit` có thể báo lỗi `image-size` qua `pptxgenjs` — đã xác nhận vô hại ở cấp 2 vì module đó bị loại khỏi bundle trình duyệt qua field `browser` trong package.json của pptxgenjs, không cần xử lý gì thêm.

## Phase 3 — Xây code (copy pattern từ cấp 2, đổi phần nội dung)

Đọc và thích nghi từng file dưới đây từ `Giao-an-cap-2\src\`:

**Giữ gần như nguyên vẹn** (hạ tầng dùng chung logic, không phụ thuộc cấp học):
- `lib/redis.ts`, `lib/trial-guard.ts` (đổi tên biến nếu muốn nhưng logic device-cap 3/mã, IP-cap giữ nguyên)
- `lib/plans.ts` (giá có thể giữ nguyên hoặc điều chỉnh — hỏi người dùng)
- `lib/orders.ts`, `lib/email.ts` (đổi tên sản phẩm trong email template)
- `lib/docx-generator.ts`, `lib/pptx-generator.ts` (cấu trúc bảng biểu 5512 — **chỉ giữ nếu Phase 0 xác nhận tiểu học vẫn dùng khung tương tự**, nếu dùng Công văn 2345 thì cấu trúc mục/bảng sẽ khác, cần viết lại phần này)
- `components/Sidebar.tsx` (đã có drawer responsive cho mobile — **giữ nguyên cơ chế này, đây là fix cho 1 bug launch-blocking đã xảy ra thật**, đừng bỏ qua bước responsive rồi thêm sau)
- `components/ActivationModal.tsx`, `components/StampSeal.tsx`, `components/EmptyResult.tsx`, `components/ResultPanel.tsx`
- `store/useAppStore.ts`, `store/useHistoryStore.ts`, `store/useProfileStore.ts`
- `app/globals.css` (token màu — xem "Bản sắc thiết kế" bên dưới)
- `app/api/activate/route.ts`, `app/api/orders/`, `app/api/webhook/sepay/route.ts` (auth header là `Apikey <key>`, **không phải** `Bearer` — đây là lỗi thật đã xảy ra, xác nhận lại bằng cách đọc màn hình cấu hình webhook thật trong dashboard SePay lúc tạo webhook mới, đừng giả định giống nhớ lại)

**Phải viết lại theo Phase 0**:
- `lib/types.ts` — `LessonPlan`/`ExamPlan`/`ExercisePlan` có thể cần field khác (ví dụ tiểu học ít khi có "đề kiểm tra" hình thức như THCS)
- Master Prompt trong `api/generate/route.ts` (và `de-thi`, `bai-tap`) — đúng chuẩn chương trình + đúng khối lớp 1–5
- `KHOI_LOP` = `["1","2","3","4","5"]`, `MON_HOC` — theo đúng Phase 0 mục 2 (cân nhắc danh sách môn học đổi theo khối lớp thay vì cố định)
- Route thanh toán `/nang-cap` — đổi text "chuẩn 5512" nếu chuẩn khác

**Bản sắc thiết kế**: giữ đúng hệ màu/font đã dùng (`paper #FAF6EC`, `ink #20291F`, `pine #1B6B4C`, `seal #C23B3B`, Literata + Be Vietnam Pro, mô-típ vở học sinh + con dấu đỏ) để 3 app (cấp 1/2/3) nhận diện cùng 1 thương hiệu — trừ khi người dùng chủ động muốn phân biệt màu theo cấp học (có thể hỏi, đừng tự quyết định đổi màu).

## Phase 4 — Kiểm thử local

```bash
npx tsc --noEmit
npm run build
```

Sau đó bật dev server (`preview_start` với launch.json trỏ port riêng, ví dụ 3002 để không đụng cấp 2 nếu chạy song song) và **test thật trong browser** — điền form, bấm sinh nội dung, kiểm tra không lỗi console, kiểm tra mobile 375px không vỡ layout. Đừng chỉ tin build sạch — cấp 2 đã có nhiều bug (hydration mismatch, sidebar mobile vỡ) mà `tsc`/`next build` không bắt được.

## Phase 5 — Đẩy lên GitHub

```bash
git branch -M main
git add -A
git status --short   # rà lại trước khi commit, chắc chắn .env.local không lọt vào
git commit -m "..."
gh repo create giaoanpro-cap1 --public -y
git remote add origin https://github.com/hungniwaco-stack/giaoanpro-cap1.git
git push -u origin main
```

Trước khi push: xác nhận `.gitignore` có `.env*`, và rà `git diff --cached` tìm pattern secret (`AIza`, `re_`, v.v.) — đã làm bước này ở cấp 2, không có ngoại lệ.

## Phase 6 — Deploy Vercel

Vào [vercel.com/new](https://vercel.com/new) (org "Hung's projects", slug `hungs-projects-fdde2488`), import repo `giaoanpro-cap1`, deploy lần đầu (sẽ lỗi vì chưa có biến môi trường — bình thường, xử lý ở Phase 8-9).

## Phase 7 — Domain & DNS

1. Trong Vercel project → Settings → Domains → Add → gõ `cap1.giaoanpro.com`.
2. Vercel hiện giá trị DNS cần thêm — **luôn đọc giá trị THẬT lúc đó**, đừng dùng lại giá trị CNAME đã ghi nhớ từ lần cấp 2 (Vercel cấp CNAME target riêng theo từng domain, dạng `<hash>.vercel-dns-XXX.com`, không phải giá trị chung `cname.vercel-dns.com`).
3. Vào Hostinger (hPanel → Domains → `giaoanpro.com` → DNS/Nameservers → Manage DNS records) → thêm bản ghi `CNAME cap1 → <giá trị vừa đọc>`.
4. Đợi vài phút tới vài giờ để DNS lan truyền, thử lại `https://cap1.giaoanpro.com`.

## Phase 8 — Hạ tầng bên ngoài (bắt buộc tạo MỚI, không dùng chung với cấp 2)

Mỗi app cấp học cần bộ tài nguyên **riêng** — không tái sử dụng key/webhook/database của cấp 2, để cô lập sự cố và dễ theo dõi chi phí/lưu lượng theo từng sản phẩm.

**Upstash Redis** (console.upstash.com, đã đăng nhập sẵn từ lúc làm cấp 2):
- Create Database → tên `giaoanpro-cap1` → Region **Singapore (ap-southeast-1)** (gần Việt Nam nhất, đã dùng cho cấp 2) → Plan **Free**
- Vào tab Details → copy `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN` (bấm nút copy trên trang, dán thẳng vào Vercel bằng Ctrl+V — **đừng đọc secret ra dạng text qua công cụ JS**, giá trị dạng base64 sẽ bị chặn hiển thị; so khớp bằng cách hiện (icon mắt) rồi chụp màn hình phóng to để đối chiếu, không đọc qua text).

**SePay** (my.sepay.vn, tài khoản đã có sẵn bank account ACB `201482319` — kiểm tra lại đúng tài khoản trước khi chọn, tài khoản này còn dùng chung với vài dự án khác không liên quan):
- Tích hợp Webhook → Thêm webhook → tên `Giáo Án Pro Cấp 1`, URL `https://cap1.giaoanpro.com/api/webhook/sepay`, Loại giao dịch = Tiền vào, Định dạng = JSON
- Tài khoản ngân hàng → Tuỳ chọn → chỉ chọn đúng tài khoản ACB đang dùng cho các webhook khác, bật "Dùng để xác thực thanh toán"
- Bảo mật → chọn **API Key** (không phải HMAC-SHA256, code hiện tại chỉ hỗ trợ API Key) → tự sinh 1 chuỗi ngẫu nhiên mạnh làm key (ví dụ `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), dán vào — **lưu ý header SePay gửi là `Authorization: Apikey <key>`, sửa route webhook nếu để nhầm `Bearer`**
- Cảnh báo → bật cảnh báo lỗi liên tiếp (tuỳ chọn nhưng nên bật)

**Resend** (resend.com, đã đăng nhập sẵn):
- API Keys → Create API Key → tên `giaoanpro-cap1` → Permission **Sending access** (không phải Full access — nguyên tắc least privilege, đã áp dụng ở cấp 2) → copy giá trị ngay lúc hiện (chỉ hiện 1 lần)

## Phase 9 — Điền biến môi trường & Redeploy

Vercel project → Settings → Environment Variables → Add, áp dụng cho cả 3 môi trường (Production, Preview, Development):

```
GEMINI_API_KEY=<key thật>
ACTIVATION_CODES=<mã:gói, ví dụ DEMO1234:1M>
UPSTASH_REDIS_REST_URL=<từ Phase 8>
UPSTASH_REDIS_REST_TOKEN=<từ Phase 8>
SEPAY_WEBHOOK_API_KEY=<từ Phase 8>
SEPAY_ACCOUNT_NUMBER=201482319
SEPAY_BANK_CODE=ACB
SEPAY_BANK_NAME=ACB
SEPAY_ACCOUNT_NAME=NGUYEN HUU HUNG
RESEND_API_KEY=<từ Phase 8>
RESEND_FROM=Giáo Án Pro <onboarding@resend.dev>
```

Sau khi thêm đủ, bấm **Redeploy** (không tự áp dụng cho bản đã deploy — bắt buộc phải deploy lại).

## Phase 10 — Xác minh production (bắt buộc, đừng dừng ở "deploy thành công")

1. Mở `https://cap1.giaoanpro.com`, điền form, bấm sinh nội dung thật.
2. Nếu lỗi: vào Vercel → Logs, đọc message thật thay vì đoán — lần cấp 2 lỗi đầu tiên chỉ là Gemini tạm quá tải (503), không phải bug hạ tầng; thử lại là được.
3. Xác nhận sau khi sinh thành công: bộ đếm lượt dùng thử giảm đúng (chứng tỏ Redis hoạt động), file Word/PPT tải được, con dấu hiện lên.
4. Test luôn `/nang-cap` (thanh toán) nếu có thể — ít nhất xác nhận trang tạo đơn hàng không lỗi 500.

## Việc KHÔNG nên làm (bài học từ cấp 2)

- Đừng để state (lượt dùng thử, mã kích hoạt) sống trong RAM server nếu deploy Vercel — serverless không có RAM dùng chung giữa các request, phải dùng Redis từ đầu.
- Đừng trừ lượt dùng thử trước khi biết Gemini gọi thành công — trừ SAU khi có kết quả, để lỗi tạm thời của Gemini không làm khách mất oan lượt.
- Đừng để mã kích hoạt dùng lại vô hạn lần — giới hạn số thiết bị/mã ngay từ đầu (đã có sẵn trong `trial-guard.ts` copy từ cấp 2, đừng bỏ qua khi thích nghi code).
- Đừng bỏ qua responsive mobile cho sidebar — đối tượng khách hàng chính xem qua điện thoại.
