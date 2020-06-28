import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    var transactions = await this.find();
    const income = transactions
      .filter(transaction => transaction.type == "income")
      .reduce((total, transaction) => Number(transaction.value) + Number(total), 0);

    const outcome = transactions
      .filter(transaction => transaction.type == "outcome")
      .reduce((total, transaction) => Number(transaction.value) + Number(total), 0);

    return {
      income: Number(income),
      outcome: Number(outcome),
      total: (income - outcome)
    }
  }
}

export default TransactionsRepository;
