import { PostgresDeleteUserRepository } from '../repositories/postgres/delete-user.js'

export class DeleteUserUseCase {
    async execute(userId) {
        const postgresDeleteUserRepository = new PostgresDeleteUserRepository()
        const deleteUser = postgresDeleteUserRepository.execute(userId)
        return deleteUser
    }
}
