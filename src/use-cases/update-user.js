import bcrypt from 'bcrypt'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    async execute(userId, updateParams) {
        // Verificar se o email já esta sendo utilizado e se ele esta em uso
        if (updateParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()
            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateParams.email,
                )
            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError(updateParams.email)
            }
        }
        // Verificar se a senha esta sendo atualizada e criptografar
        const user = { ...updateParams }

        if (updateParams.password) {
            const hashedPassword = await bcrypt.hash(updateParams.password, 10)
            user.password = hashedPassword
        }

        // Chamar o Repository paa atualizar o usuário
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updateUser
    }
}
