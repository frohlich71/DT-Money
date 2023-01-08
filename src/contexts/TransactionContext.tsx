import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?:string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  
  async function fetchTransactions(query?:string) {

    let response = await api.get('/findAll')

    if (query) [
      response = await api.post('/find', {
        query: query 
      })
    ]
    
    setTransactions(response.data)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function createTransaction(data:CreateTransactionInput) {
    const { description, price, category, type } = data

    const response = await api.post('/create', {
      description,
      price,
      category,
      type
    })

    console.log(response.data)
    setTransactions(state => [...state, response.data])
  }

  return (
    <TransactionContext.Provider value={
        {
          transactions, 
          fetchTransactions,
          createTransaction
        }
      }
    >
      {children}
    </TransactionContext.Provider>
  )
}