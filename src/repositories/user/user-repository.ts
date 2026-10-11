import { db } from '#/db'
import { users } from '#/db/schema'
import type { CreateUserInput } from '#/schemas/user/users-schema'
import { eq } from 'drizzle-orm'

export class UserRepository {
  constructor(private readonly database = db) {}

  public async create(data: CreateUserInput) {
    const [newUser] = await this.database.insert(users).values(data).returning({
      publicId: users.publicId,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

    return newUser
  }

  public async findBy(where: 'email' | 'publicId', value: string) {
    return this.database.query.users.findFirst({
      where: eq(users[where], value),
    })
  }

  public async exists(email: string): Promise<boolean> {
    const result = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    return result.length > 0
  }
}

export const userRepository = new UserRepository()
