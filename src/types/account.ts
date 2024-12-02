import { userInfoSchema } from "@/schemas/account.schema";
import { z } from "zod";

export type UserInfo = z.infer<typeof userInfoSchema>;
