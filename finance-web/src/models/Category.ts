import type { CategoryType } from "../enum/CategoryType";

export interface CategoryDto {
    title: string;
    description: string;
}

export interface ReturnCategory {
    id: string;
    title: string;
    description: string;
    totalAmount: number;
    balance: number;
    income: number;
    expense: number;
    categoryType: CategoryType;
    createdAt: string;
}

export interface MinimalCategory {
    id: string;
    title: string;
    totalAmount: number;
    balance: number;
    categoryType: CategoryType;
    transactionsCount: number;
}