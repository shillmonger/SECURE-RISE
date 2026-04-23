import { ObjectId } from 'mongodb';

export interface CryptoAddress {
  id: string;
  crypto: {
    name: string;
    symbol: string;
    icon: string;
  };
  address: string;
}

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  accountBalance: number;
  welcomeBonus: number;
  totalProfits: number;
  totalWithdrawal: number;
  totalDeposit: number;
  role: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  profileImage?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  cryptoAddresses?: CryptoAddress[];
}

export const createDefaultUser = (userData: {
  username: string;
  email: string;
  password: string;
}): Omit<User, '_id' | 'createdAt' | 'updatedAt'> => {
  return {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    accountBalance: 20, // Welcome bonus
    welcomeBonus: 20,
    totalProfits: 0,
    totalWithdrawal: 0,
    totalDeposit: 0,
    role: ['user'],
    isActive: true,
  };
};
