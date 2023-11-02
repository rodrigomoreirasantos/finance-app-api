import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }
    async execute(userId, updateParams) {
        if (updateParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(updateParams.email)
            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateParams.email)
            }
        }

        const user = { ...updateParams }

        if (updateParams.password) {
            const hashedPassword = await bcrypt.hash(updateParams.password, 10)
            user.password = hashedPassword
        }
        const updateUser = await this.updateUserRepository.execute(userId, user)

        return updateUser
    }
}
