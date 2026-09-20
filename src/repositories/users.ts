import { db } from "#/db";
import { users } from "#/db/schema";
import type { CreateUserInput } from "#/schemas/users";
import { eq } from "drizzle-orm";

export async function createUser(data: CreateUserInput) {
    const [newUser] = await db
        .insert(users)
        .values(data)
        .returning({
            publicId: users.publicId,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        });

    return newUser
}

export async function findUserByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) })
}

export async function userExists(email: string) {
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return result.length > 0
}