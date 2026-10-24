import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trò chuyện AI hỏi đáp chuyên môn Tiểu học — Giáo Án Pro Cấp 1",
  description: "Hỏi nhanh AI về khái niệm, gợi ý hoạt động dạy học hoặc góp ý nội dung đang soạn dành cho giáo viên Tiểu học. Dùng thử miễn phí 3 lượt.",
  alternates: { canonical: "/chat" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
