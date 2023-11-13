import validator from 'validator'
import {
    serverError,
    badRequest,
    checkIfIdIsValid,
    invaldIdResponse,
    created,
    validateRequiredFields,
    requiredFielsIsMissingResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            // validar a requisição (campos obrigatório, tamanho de senha e email)
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok, missingField } = validateRequiredFields(
                params,
                requiredFields,
            )

            if (!ok) {
                return requiredFielsIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invaldIdResponse()
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'The type must be EARNING, EXPENSE or INVESTMENT. ',
                })
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })
            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
