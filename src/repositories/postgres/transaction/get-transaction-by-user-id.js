import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionByUserId {
    async execute(user_id) {
        const transaction = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [user_id],
        )
        return transaction
    }
}
