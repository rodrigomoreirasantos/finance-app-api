import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badRequest, created, serverError } from './helper.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            // validar a requisição (campos obrigatório, tamanho de senha e email)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing params: ${field}` })
                }
            }

            // validação de tamanho de senha
            const passwordIsValid = params.password.length < 6
            if (passwordIsValid) {
                return badRequest({
                    message: 'Password must be least 6 characters',
                })
            }

            const emailIsValid = validator.isEmail(params.email)
            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid e-mail. Please provide valid one',
                })
            }

            // Chamar o use case
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)

            // Retornar a resposta para o usuário (status code)
            return created(createdUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
