export const KHOI_LOP = ["1", "2", "3", "4", "5"];

const MON_HOC_LOP_1_2 = [
  "Tiếng Việt",
  "Toán",
  "Đạo đức",
  "Tự nhiên và Xã hội",
  "Giáo dục thể chất",
  "Âm nhạc",
  "Mỹ thuật",
  "Hoạt động trải nghiệm",
];

const MON_HOC_LOP_3_5 = [
  "Tiếng Việt",
  "Toán",
  "Đạo đức",
  "Khoa học",
  "Lịch sử và Địa lý",
  "Tin học",
  "Công nghệ",
  "Tiếng Anh",
  "Giáo dục thể chất",
  "Âm nhạc",
  "Mỹ thuật",
  "Hoạt động trải nghiệm",
];

export const MON_HOC_THEO_KHOI: Record<string, string[]> = {
  "1": MON_HOC_LOP_1_2,
  "2": MON_HOC_LOP_1_2,
  "3": MON_HOC_LOP_3_5,
  "4": MON_HOC_LOP_3_5,
  "5": MON_HOC_LOP_3_5,
};

export function monHocTheoKhoi(khoiLop: string): string[] {
  return MON_HOC_THEO_KHOI[khoiLop] ?? MON_HOC_LOP_1_2;
}

// Theo Thông tư 27/2020/TT-BGDĐT: lớp 1-2 chỉ có bài kiểm tra định kỳ (viết)
// cho Toán và Tiếng Việt, các môn khác chỉ đánh giá bằng nhận xét. Lớp 3-5 có
// thêm Khoa học, Lịch sử và Địa lý, Tiếng Anh, Tin học.
const MON_KIEM_TRA_LOP_1_2 = ["Toán", "Tiếng Việt"];
const MON_KIEM_TRA_LOP_3_5 = ["Toán", "Tiếng Việt", "Khoa học", "Lịch sử và Địa lý", "Tiếng Anh", "Tin học"];

export const MON_KIEM_TRA_DINH_KY: Record<string, string[]> = {
  "1": MON_KIEM_TRA_LOP_1_2,
  "2": MON_KIEM_TRA_LOP_1_2,
  "3": MON_KIEM_TRA_LOP_3_5,
  "4": MON_KIEM_TRA_LOP_3_5,
  "5": MON_KIEM_TRA_LOP_3_5,
};

export function monCoKiemTraDinhKy(khoiLop: string): string[] {
  return MON_KIEM_TRA_DINH_KY[khoiLop] ?? MON_KIEM_TRA_LOP_1_2;
}
