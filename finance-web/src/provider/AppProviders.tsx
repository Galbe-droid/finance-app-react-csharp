/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthProvider } from "../auth/AuthContext";
import { CategoryProvider } from "../context/CategoryContext";
import { TransactionProvider } from "../context/TransactionContext";

export function AppProviders({children}: any){
    return(
        <AuthProvider>
            <CategoryProvider>
                <TransactionProvider>
                    {children}
                </TransactionProvider>
            </CategoryProvider>
        </AuthProvider>
    )
}