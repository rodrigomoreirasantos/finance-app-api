import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { notFound, ok, serverError } from './helpers/http.js'
import { checkIfIdIsValid, invaldIdResponse } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invaldIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )
            if (!user) {
                return notFound({
                    message: 'User not found.',
                })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
