import type { LessonPlan, ExamPlan, ExercisePlan } from "./types";

function bullets(items: string[]) {
  return items.map((i) => `- ${i}`).join("\n");
}

export function lessonPlanToMarkdown(p: LessonPlan): string {
  return `# ${p.tenBai}
**Môn:** ${p.monHoc} — **Lớp:** ${p.khoiLop} — **Thời lượng:** ${p.thoiLuong}

## I. Yêu cầu cần đạt
${bullets(p.yeuCauCanDat)}

## II. Đồ dùng dạy học
${bullets(p.doDungDayHoc)}

## III. Các hoạt động dạy học chủ yếu
${p.hoatDong
  .map(
    (hd) => `### ${hd.ten}
- **Mục tiêu:** ${hd.mucTieu}
- **Cách thực hiện:** ${hd.cachThucHien}`
  )
  .join("\n\n")}

## IV. Điều chỉnh sau bài dạy
(Giáo viên ghi nhận sau khi dạy thực tế)
`;
}

export function examToMarkdown(p: ExamPlan): string {
  const questions = p.cauHoi
    .map((c, i) => {
      const options = c.loai === "trac_nghiem" && c.luaChon ? "\n" + c.luaChon.map((o) => `  - ${o}`).join("\n") : "";
      return `${i + 1}. ${c.noiDung}${options}`;
    })
    .join("\n\n");
  const answers = p.cauHoi.map((c, i) => `${i + 1}. ${c.dapAn}`).join("\n");

  return `# ${p.tenBai}
**Môn:** ${p.monHoc} — **Lớp:** ${p.khoiLop} — **Thời gian làm bài:** ${p.thoiGianLamBai}

## Đề bài
${questions}

## Đáp án
${answers}
`;
}

export function exerciseToMarkdown(p: ExercisePlan): string {
  const items = p.baiTap.map((b, i) => `${i + 1}. ${b.noiDung}`).join("\n\n");
  const answers = p.baiTap.map((b, i) => `${i + 1}. ${b.dapAn}`).join("\n");

  return `# ${p.tenBai}
**Môn:** ${p.monHoc} — **Lớp:** ${p.khoiLop}

## Bài tập
${items}

## Đáp án
${answers}
`;
}
