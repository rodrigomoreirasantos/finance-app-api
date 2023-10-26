import { DeleteUserUseCase } from '../use-cases/delete-user'
import {
    checkIfIdIsValid,
    invaldIdResponse,
    serverError,
    ok,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const idIsValid = checkIfIdIsValid(userId)
            if (!idIsValid) {
                return invaldIdResponse()
            }
            const deleteUserUseCase = new DeleteUserUseCase()
            const deleteUser = await deleteUserUseCase.execute(userId)
            return ok(deleteUser)
        } catch (error) {
            console.log(error)
            return serverError
        }
    }
}
