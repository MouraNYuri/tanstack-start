import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '../db/schema' // Substitua pelo caminho da sua tabela

// Schema para Inserção (Criação de Usuário)
export const createUserSchema = createInsertSchema(users, {
  // Customização e refino dos campos da tabela
  name: z
    .string({ error: 'O nome é obrigatório' })
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .toUpperCase(),

  email: z.email({ error: 'Endereço de e-mail inválido' }).trim().toLowerCase(),

  password: z
    .string({ error: 'A senha é obrigatória' })
    .min(8, 'A senha deve conter no mínimo 8 caracteres')
    .max(32, 'A senha deve ter no máximo 32 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
}).omit({
  // Omite campos gerenciados automaticamente pelo banco de dados/servidor
  publicId: true,
  createdAt: true,
  updatedAt: true,
})

// Schema para Seleção/Retorno (Resposta para o Frontend)
export const selectUserSchema = createSelectSchema(users).omit({
  id: true, // NUNCA expõe o ID primário privado
  password: true, // NUNCA expõe o hash da senha
})

// Tipos estáticos inferidos para o TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserResponse = z.infer<typeof selectUserSchema>
