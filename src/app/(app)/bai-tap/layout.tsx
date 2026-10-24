import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo bài tập Tiểu học bằng AI — Giáo Án Pro Cấp 1",
  description: "Sinh phiếu bài tập luyện tập Tiểu học kèm đáp án, độ khó tăng dần, xuất Word và PowerPoint. Dùng thử miễn phí 3 lượt.",
  alternates: { canonical: "/bai-tap" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
