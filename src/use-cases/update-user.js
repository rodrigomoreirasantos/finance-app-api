import bcrypt from 'bcrypt'
import {
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    async execute(userId, updateParams) {
        if (updateParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()
            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateParams.email,
                )
            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateParams.email)
            }
        }

        const user = { ...updateParams }

        if (updateParams.password) {
            const hashedPassword = await bcrypt.hash(updateParams.password, 10)
            user.password = hashedPassword
        }
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updateUser
    }
}
