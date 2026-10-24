import type { Metadata } from "next";
import { Literata, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import RefCapture from "@/components/RefCapture";
import { PLAN_PRICE_VND } from "@/lib/plans";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["vietnamese", "latin"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

// ponytail: đổi sang domain thật khi deploy, cần cho OG image tuyệt đối + sitemap.
const SITE_URL = "https://cap1.giaoanpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI Giáo Án Pro — Soạn giáo án Tiểu học chuẩn 2345 bằng AI",
  description:
    "Tạo giáo án Tiểu học chuẩn Công văn 2345, sách Kết nối tri thức, xuất thẳng file Word chỉ trong vài giây. Dùng thử miễn phí 3 lượt mỗi chức năng.",
  keywords: ["giáo án AI", "soạn giáo án", "công văn 2345", "giáo án tiểu học", "kết nối tri thức"],
  openGraph: {
    title: "AI Giáo Án Pro — Tiểu học",
    description: "Soạn giáo án Tiểu học chuẩn 2345 bằng AI, xuất thẳng file Word.",
    locale: "vi_VN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const prices = Object.values(PLAN_PRICE_VND);

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Giáo Án Pro — Cấp 1",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "vi",
  url: SITE_URL,
  description: metadata.description,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "VND",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
  },
  provider: { "@type": "Organization", name: "Giáo Án Pro", url: "https://www.giaoanpro.com" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${literata.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
        <RefCapture />
        {children}
      </body>
    </html>
  );
}
