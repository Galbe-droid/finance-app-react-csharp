import type { SourceTypeValue } from "../enum/SourceType";

export interface TransactionDto {
    title: string;
    description: string;
    amount: number;
    date: string;
    transactionType: number;
    source: SourceTypeValue;
    sourceName: string;
    sourceDescription: string;
}

export interface UpdateTransactionDto {
    title: string;
    description: string;
    amount: number;
    date: string;
    transactionType: number;
    source: SourceTypeValue;
    sourceName: string;
    sourceDescription: string;
}

export interface MinimalTransaction {
    id: string;
    title: string;
    amount: number;
    date: string;
    transactionType: number;
    source: SourceTypeValue;
    sourceName: string;
    categoryId: string | null;
    categoryName: string;
}

export interface ReturnTransaction{
    id: string;
    title: string;
    description: string;
    amount: number;
    date: string;
    transactionType: number;
    source: SourceTypeValue;
    sourceName: string;
    sourceDescription: string;
    categoryId: string | null;
    categoryName: string;
    createdAt: string;
}