import { UserNotFoundError } from '../../errors/user.js'
import {
    userNotFoundResponse,
    serverError,
    requiredFielsIsMissingResponse,
    checkIfIdIsValid,
    invaldIdResponse,
    ok,
} from '../helpers'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFielsIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invaldIdResponse()
            }

            const transaction = this.getTransactionByUserIdUseCase.execute({
                userId,
            })

            return ok(transaction)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
