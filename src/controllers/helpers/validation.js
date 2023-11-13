import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invaldIdResponse = () =>
    badRequest({
        message: 'The provider ID is not valid.',
    })
