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
  
}).omit({
  // Omite campos gerenciados automaticamente pelo banco de dados/servidor
  publicId: true,
  createdAt: true,
  updatedAt: true,
})

// Schema para Seleção/Retorno (Resposta para o Frontend)
export const selectUserSchema = createSelectSchema(users).omit({
  id: true, // NUNCA expõe o ID primário privado
})

// Tipos estáticos inferidos para o TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserResponse = z.infer<typeof selectUserSchema>
