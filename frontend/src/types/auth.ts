import { z } from "zod";

export const UserRegistrationSchema = z
  .object({
    name: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
    last_name: z
      .string()
      .min(2, { message: "O sobrenome deve ter no mínimo 2 caracteres." }),
    cpf: z.string().min(11, { message: "CPF inválido. Deve conter 11 dígitos." }).max(14),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    phone: z.string().min(10, { message: "O telefone deve ter no mínimo 10 dígitos." }),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type TUserRegistrationSchema = z.infer<typeof UserRegistrationSchema>;

export const UserProfileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
  last_name: z
    .string()
    .min(2, { message: "O sobrenome deve ter no mínimo 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  phone: z.string().min(10, { message: "O telefone deve ter no mínimo 10 dígitos." }),
});

export type TUserProfileSchema = z.infer<typeof UserProfileSchema>;
