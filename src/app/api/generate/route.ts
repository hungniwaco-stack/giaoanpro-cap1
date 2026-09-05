import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";
import { checkTrial, consumeTrial } from "@/lib/trial-guard";
import { addHistoryEntry } from "@/lib/history-store";
import { ai, GEMINI_MODEL } from "@/lib/gemini";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    tenBai: { type: Type.STRING },
    monHoc: { type: Type.STRING },
    khoiLop: { type: Type.STRING },
    thoiLuong: { type: Type.STRING },
    yeuCauCanDat: { type: Type.ARRAY, items: { type: Type.STRING } },
    doDungDayHoc: { type: Type.ARRAY, items: { type: Type.STRING } },
    hoatDong: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ten: { type: Type.STRING },
          mucTieu: { type: Type.STRING },
          cachThucHien: { type: Type.STRING },
        },
        required: ["ten", "mucTieu", "cachThucHien"],
      },
    },
  },
  required: ["tenBai", "monHoc", "khoiLop", "thoiLuong", "yeuCauCanDat", "doDungDayHoc", "hoatDong"],
};

function buildPrompt(monHoc: string, khoiLop: string, tenBai: string, trichDoanSgk?: string) {
  const sgkBlock = trichDoanSgk
    ? `\nDưới đây là trích đoạn gốc từ sách giáo khoa cho đúng bài này — hãy bám sát nội dung, ví dụ, số liệu trong trích đoạn này thay vì tự suy diễn:\n"""\n${trichDoanSgk}\n"""\n`
    : "";

  return `Bạn là một chuyên gia sư phạm Tiểu học Việt Nam, dày dạn kinh nghiệm soạn Kế hoạch bài dạy theo Công văn 2345/BGDĐT-GDTH (Phụ lục 3), bám sát chương trình GDPT 2018 và bộ sách "Kết nối tri thức với cuộc sống". Ngôn ngữ và hoạt động phải phù hợp lứa tuổi học sinh lớp ${khoiLop} (6-11 tuổi) — câu ngắn, hình ảnh trực quan, trò chơi, ít lý thuyết trừu tượng.

Hãy soạn một kế hoạch bài dạy chi tiết cho:
- Môn học/Hoạt động giáo dục: ${monHoc}
- Khối lớp: ${khoiLop}
- Tên bài: ${tenBai}
${sgkBlock}
Yêu cầu về nội dung (đúng cấu trúc Phụ lục 3 CV 2345, KHÔNG dùng cấu trúc Mục tiêu Kiến thức/Năng lực/Phẩm chất kiểu THCS):
- "yeuCauCanDat": 3-5 gạch đầu dòng, mỗi gạch nêu rõ học sinh làm được gì / vận dụng được gì vào thực tế / hình thành phẩm chất-năng lực gì — viết theo động từ hành động, đo lường được, phù hợp học sinh tiểu học.
- "doDungDayHoc": liệt kê ngắn gọn, thực tế (SGK, tranh ảnh, đồ dùng học tập, phiếu bài tập, máy chiếu nếu cần...).
- "hoatDong": đúng 4 hoạt động theo khung 2345, đặt tên lần lượt là "Hoạt động 1: Mở đầu", "Hoạt động 2: Hình thành kiến thức mới", "Hoạt động 3: Luyện tập, thực hành", "Hoạt động 4: Vận dụng, trải nghiệm". Mỗi hoạt động có "mucTieu" (ngắn gọn) và "cachThucHien" (các bước giáo viên tổ chức, có thể đánh số bước, ngôn ngữ đơn giản dễ theo dõi trên lớp).

Chỉ trả về JSON đúng theo schema đã cho, không thêm markdown, không thêm giải thích.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Server chưa cấu hình GEMINI_API_KEY" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const trial = await checkTrial(ip, "giao-an");
  if (!trial.allowed) {
    return NextResponse.json({ error: "trial_exhausted" }, { status: 402 });
  }

  const { monHoc, khoiLop, tenBai, trichDoanSgk } = await req.json();
  if (!monHoc || !khoiLop || !tenBai) {
    return NextResponse.json({ error: "Thiếu môn học, khối lớp hoặc tên bài" }, { status: 400 });
  }
  if ([monHoc, khoiLop, tenBai].some((v) => typeof v !== "string" || v.length > 200)) {
    return NextResponse.json({ error: "Nội dung nhập vào quá dài" }, { status: 400 });
  }
  if (trichDoanSgk !== undefined && (typeof trichDoanSgk !== "string" || trichDoanSgk.length > 4000)) {
    return NextResponse.json({ error: "Trích đoạn SGK quá dài" }, { status: 400 });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(monHoc, khoiLop, tenBai, trichDoanSgk),
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini không trả về nội dung");

    await consumeTrial(trial.uid, trial.ip, "giao-an");
    // Trust our own inputs over whatever the model echoed back in the JSON —
    // it sometimes "corrects" these to match its own reading of the topic.
    const result = { ...JSON.parse(text), tenBai, monHoc, khoiLop };
    await addHistoryEntry(trial.uid, "giao-an", tenBai, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Gemini generate error:", err);
    return NextResponse.json({ error: "Không thể tạo giáo án lúc này, vui lòng thử lại" }, { status: 502 });
  }
}
