import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invaldIdResponse = () =>
    badRequest({
        message: 'The provider ID is not valid.',
    })

export const checkIfIsString = (value) => typeof value == 'string'

export const requiredFielsIsMissingResponse = (field) => {
    return badRequest({
        message: `The field ${field} is required.`,
    })
}

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], {
                ignore_whitespace: true,
            })
        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }

    return {
        missingField: undefined,
        ok: true,
    }
}
