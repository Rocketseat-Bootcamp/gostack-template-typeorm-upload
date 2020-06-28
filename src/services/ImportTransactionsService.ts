import csvParse from 'csv-parse';
import fs, { promises } from 'fs';
import path from 'path';
import csv from 'csvtojson';


import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({
    filename
  }: Request): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, filename);
    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);
    const transactions: Transaction[] = [];

    for (const item of csvJson) {
      const { title, type, value, category } = item;
      const transaction = await createTransactionService.execute({
        title,
        type,
        value: parseFloat(value),
        category
      });

      transactions.push(transaction);
    }

    return transactions;

  }
}

export default ImportTransactionsService;
