import { bigint, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    // ID Privado (Primary Key interna para JOINs e relacionamentos no banco)
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

    // ID Público (Exposto em URLs, APIs e no Frontend)
    publicId: uuid('public_id').defaultRandom().unique().notNull(),

    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    password: text('password').notNull(),

    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // Índice para garantir buscas ultra rápidas por ID público na API
    index('users_public_id_idx').on(table.publicId),
  ]
)