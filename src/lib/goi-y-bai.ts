// ponytail: chỉ phủ Toán + Tiếng Việt lớp 1-2 (nhóm giáo viên dùng nhiều
// nhất) — thêm môn/khối khác khi có nhu cầu thực tế, không cần phủ hết ngay.
const GOI_Y_BAI: Record<string, string[]> = {
  "1|Toán": [
    "Các số đến 10",
    "Phép cộng trong phạm vi 10",
    "Phép trừ trong phạm vi 10",
    "Các số đến 20",
    "Phép cộng, phép trừ trong phạm vi 20",
    "Các số đến 100",
    "Đo độ dài",
    "Xem đồng hồ",
  ],
  "1|Tiếng Việt": [
    "Làm quen với chữ cái",
    "Âm và chữ ghi âm",
    "Vần và tiếng có vần",
    "Kể chuyện theo tranh",
    "Tập viết chữ hoa",
  ],
  "2|Toán": [
    "Phép cộng, phép trừ trong phạm vi 100",
    "Phép nhân",
    "Phép chia",
    "Các số đến 1000",
    "Đo độ dài, đo khối lượng",
  ],
  "2|Tiếng Việt": [
    "Mở rộng vốn từ",
    "Luyện tập câu kể",
    "Tập làm văn kể chuyện",
    "Đọc hiểu văn bản",
  ],
};

export function goiYBai(khoiLop: string, monHoc: string): string[] {
  return GOI_Y_BAI[`${khoiLop}|${monHoc}`] ?? [];
}
