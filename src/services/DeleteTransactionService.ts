import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({
    id
  }: Request): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);
    const transaction = await repository.findOne({
      where: { id }
    })

    if (!transaction)
      throw new AppError("Transação não foi encontrada.")

    await repository.remove(transaction);
  }
}

export default DeleteTransactionService;
