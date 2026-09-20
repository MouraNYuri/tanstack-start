import { createServerFn } from "@tanstack/react-start";
import { createUser, userExists,  } from "#/repositories/users";
import { createUserSchema, selectUserSchema, type UserResponse } from "#/schemas/users";
import type { ActionResult } from "#/types/action-result";

export const createUserFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => createUserSchema.parse(data))
  .handler(async ({ data: { email, name, password } }): Promise<ActionResult<UserResponse>> => {

    // 1. Verificação de regra de negócio
    const userAlreadyExist = await userExists(email);

    if (userAlreadyExist) {
      // Retorno imediato sem chamar o selectUserSchema
      return {
        success: false,
        error: "E-mail já cadastrado no sistema.",
        field: "email",
      };
    }

    // 2. Hash da senha
    const hashedPassword = await Bun.password.hash(password);

    // 3. Inserção no banco
    const newUser = await createUser({
      email,
      name,
      password: hashedPassword,
    });

    // 4. Retorno de sucesso (valida APENAS o usuário criado)
    return {
      success: true,
      data: selectUserSchema.parse(newUser),
    };
  });