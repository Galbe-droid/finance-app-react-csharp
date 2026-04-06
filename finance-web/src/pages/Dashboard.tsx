import { Box, Typography } from "@mui/material";
import Card from "../components/Card";
import LargeCard from "../components/LargeCard";
import { useAuth } from "../auth/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import { useCategories } from "../context/CategoryContext";
import { BarChart } from '@mui/x-charts/BarChart';
import type { MinimalTransaction, ReturnTransaction } from "../models/Transaction";
import { PieChart } from "@mui/x-charts/PieChart";
import { analytics } from "../analytics/analytics";
import { useEffect } from "react";


export default function Dashboard() {
    const { isAuthenticated } = useAuth()
    const { minTransactions, balance, income, expense} = useTransactions();
    const { categories } = useCategories();
    
    const largestProfitCategory = Math.max(...categories.map(c => c.balance ))
    const largestProfitCategoryName = categories.find((c) => c.balance === largestProfitCategory)

    useEffect(() => {
        analytics.viewDashboard();
    }  , []);

    const formatMonth = (date: Date) =>
        date.toLocaleString("pt-BR", {
          month: "short",
          year: "numeric",
    });

    const groupByMonth = (transactions: ReturnTransaction[]| MinimalTransaction[]) => {
        const map = new Map<string, number>();

        transactions.forEach((t) => {
            const date = new Date(t.date);
        
            const key = formatMonth(date);
        
            const value =
                t.transactionType === 0
                    ? t.amount
                    : -t.amount;
        
            map.set(key, (map.get(key) || 0) + value);
        });
      
        return Array.from(map.entries()).map(([month, value]) => ({
            month,
            value,
        }));
    };

    const data = groupByMonth(minTransactions);

    return(  
        
        <>     
            {!isAuthenticated && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, mt: 4, mb: 4}}>
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>Faça login para acessar o dashboard</Typography>
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>Host do server gratuito com dormencia requisições podem demorar</Typography>
                </Box>
            )}
            {isAuthenticated && (
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "90%",
                    height: "100%",
                    overflowY: "hidden", 
                    justifyContent: "evenly",               
                    m: 6,            
                }}>            


                    <Box sx={{                
                        width: "100%",
                        mb: 8,
                    }}>
                        <Typography sx={{fontSize: "48px", fontWeight: "bold", textAlign: "left", textTransform: "uppercase"}}>Dashboard</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",                
                        mb: 8,
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",  
                            width: "100%", 
                            justifyContent: "space-between",                    
                        }}>
                            <Card name="Balanço" value={balance}/>
                            <Card name="Receita" value={income}/>
                            <Card name="Gastos" value={expense}/>
                            <Card name={"Maior receita (Categoria): " + largestProfitCategoryName?.title} value={largestProfitCategory}/>
                        </Box>

                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%", 
                        justifyContent: "space-between",  
                    }}>
                        <LargeCard>
                            {categories &&(
                                <BarChart
                                    xAxis={[{ 
                                        scaleType: "band",
                                        data: categories.map((c) => c.title),
                                        categoryGapRatio: 0.3,
                                        barGapRatio: 0.1,
                                    },]}
                                    series={[
                                        { label: 'Balanço', data: categories.map((c) => c.balance),},
                                        { label: 'Receita', data: categories.map((c) => c.income), color: "#4caf50"},
                                        { label: 'Gastos', data: categories.map((c) => c.expense * -1), color: "#f44336"},
                                    ]}
                                />
                            )}
                        </LargeCard>
                        <LargeCard>
                            {minTransactions &&(
                                <BarChart
                                    xAxis={[{ 
                                        scaleType: "band",
                                        data: data.map((d) => d.month),
                                    },]}
                                    series={[
                                        { label: 'Balaço por mes', data: data.map((d) => d.value)},
                                    ]}
                                />
                            )}
                        </LargeCard>
                        <LargeCard>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                          { id: 0, value: balance, label: 'Balanço Total', color:"#4caf50" },
                                          { id: 1, value: expense, label: 'Gastos Total', color:"#f44336"},
                                        ],
                                        innerRadius: 70,
                                        outerRadius: 150,
                                        paddingAngle: 5,
                                        cornerRadius: 5,
                                    },
                                ]}
                            />
                        </LargeCard>
                    </Box>
                </Box>
            )}        
        </>
    )
}