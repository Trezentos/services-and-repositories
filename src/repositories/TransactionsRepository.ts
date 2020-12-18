import Transaction from '../models/Transaction';

interface CreateAppointmentDTO {
  title: string;
  value: number;
  type: 'income' | 'outcomer';
}

interface Balance {
  income: number;
  outcomer: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = {
      income: 0,
      outcomer: 0,
      total: 0,
    };
  }

  public all() {
    return {
      transactions: this.transactions,
      balance: this.balance,
    };
  }

  public getBalance(): Balance {
    return this.balance;
  }

  public create({ title, value, type }: CreateAppointmentDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    if (transaction.type === 'income') {
      this.transactions.push(transaction);

      const newIncome = this.transactions.reduce<number>(
        (acumulator, currentValue) => {
          if (currentValue.type === 'income') {
            return acumulator + currentValue.value;
          }
          return acumulator;
        },
        0,
      );
      this.balance.total += transaction.value;
      this.balance.income = newIncome;
    } else if (transaction.type === 'outcomer') {
      if (transaction.value > this.balance.total) {
        throw new Error('Saldo insuficiente.');
      }

      this.transactions.push(transaction);
      const newOutcomer = this.transactions.reduce<number>(
        (acumulator, currentValue) => {
          if (currentValue.type === 'outcomer') {
            return acumulator + currentValue.value;
          }
          return acumulator;
        },
        0,
      );
      this.balance.total -= transaction.value;
      this.balance.outcomer = newOutcomer;
    } else {
      throw Error('Insert a valid type...');
    }

    return transaction;
  }
}

export default TransactionsRepository;
