import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  firstName: z
    .string()
    .min(1, "Vui lòng nhập họ")
    .max(50, "Họ không được quá 50 ký tự"),
  lastName: z
    .string()
    .min(1, "Vui lòng nhập tên")
    .max(50, "Tên không được quá 50 ký tự"),
  birthDate: z.date({
    required_error: "Vui lòng chọn ngày sinh",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Vui lòng chọn giới tính",
    invalid_type_error: "Giới tính không hợp lệ",
  }),
});
