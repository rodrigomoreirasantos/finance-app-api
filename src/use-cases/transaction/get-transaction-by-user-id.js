import { userNotFoundResponse } from '../../controllers/helpers'

export class GetTransactionByUserIdUseCase {
    constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.user_id)

        if (!user) {
            return userNotFoundResponse()
        }

        const transactions = await this.getTransactionByUserIdRepository(
            params.user_id,
        )

        return transactions
    }
}
