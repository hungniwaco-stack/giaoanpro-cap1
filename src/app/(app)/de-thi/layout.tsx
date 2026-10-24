import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thiết kế đề thi Tiểu học bằng AI — Giáo Án Pro Cấp 1",
  description: "Ra đề kiểm tra Tiểu học trộn trắc nghiệm và tự luận, kèm đáp án, xuất Word và PowerPoint. Dùng thử miễn phí 3 lượt.",
  alternates: { canonical: "/de-thi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
