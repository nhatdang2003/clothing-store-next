import * as z from "zod";

export const userInfoSchema = z.object({
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  birthDate: z.date({
    required_error: "Vui lòng chọn ngày sinh",
  }),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
});
