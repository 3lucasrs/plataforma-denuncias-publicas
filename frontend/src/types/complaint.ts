import { categoryValues } from "@/lib/constants";
import { z } from "zod";

export const ComplaintSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter no mínimo 5 caracteres." }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter no mínimo 10 caracteres." }),
  category: z.enum(categoryValues as [string, ...string[]], {
    errorMap: () => ({ message: "Por favor, selecione uma categoria válida." }),
  }),
  neighborhood: z.string().min(3, { message: "O bairro é obrigatório." }),
  address: z.string().min(5, { message: "O endereço é obrigatório." }),
  complement: z.string().optional(),
});

export type TComplaintSchema = z.infer<typeof ComplaintSchema>;
