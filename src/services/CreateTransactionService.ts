import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

interface RequestArray {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category
  }: Request): Promise<Transaction> {
    const repository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const categoryModel = await categoryRepository.findOne({
      where: { title: category }
    })


    var balance = await repository.getBalance();
    if (value > balance.total && type == "outcome")
      throw new AppError("Não possível fazer uma retirada com o valor solicitado.")

    var newCategory: Category;
    if (!categoryModel) {
      newCategory = await categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
    } else {
      newCategory = categoryModel;
    }

    const transaction = await repository.create({
      title,
      value,
      type,
      category_id: newCategory.id
    })

    await repository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
