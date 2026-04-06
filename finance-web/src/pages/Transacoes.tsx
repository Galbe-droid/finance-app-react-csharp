import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useTransactions } from "../context/TransactionContext";
import { mapFormatDate } from "../mapper/mapper";
import { TransactionType } from "../enum/TransactionType";
import { useState } from "react";
import TransactionForm from "../components/TransactionFormModal/TransactionForm";
import type { ReturnTransaction } from "../models/Transaction";

export default function Transacoes() {
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ReturnTransaction | null>(null);
    const {transactions} = useTransactions();

    return(
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
                <Typography sx={{fontSize: "48px", fontWeight: "bold", textAlign: "left", textTransform: "uppercase"}}>Transações</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent:"right",
            }}>
                <Button onClick={() => setOpen(true)}><Typography sx={{fontSize: "18px", fontWeight: "Bold"}}>Adicionar</Typography></Button>
                <TransactionForm open={open} onClose={() => setOpen(false)} oldTransaction={null}/>
            </Box>
            <Box sx={{
                Width: "100%",
                height: "100%",
                border: "4px solid",
            }}>
                <List>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        width: "100%",   
                        textAlign: "center",
                        borderBottom: "2px solid", 
                    }}>
                        <Typography>Nome</Typography>
                        <Typography>Valor</Typography>
                        <Typography>Tipo</Typography>
                        <Typography>Data</Typography>
                    </Box>
                    {transactions?.map((t) => (
                        <ListItem key={t.id} sx={{
                            borderBottom: "1px solid", 
                        }}>
                            <Box 
                                onClick={() => setSelectedTransaction(t)}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                    width: "100%",
                                    gap: 2,
                                    p:0,
                                    m:0,
                                    "&:hover": { backgroundColor: "action.hover", borderRadius: 1,},
                                }
                            }>
                                <Typography>{t.title}</Typography>
                                <Typography sx={{textAlign:"right", color: t.transactionType === TransactionType.Ganho ? "success.main" : "error.main"}}>
                                    {t.transactionType === TransactionType.Ganho ? '+' : '-'}
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                                </Typography>
                                <Typography sx={{textAlign:"center"}}>{t.source != 0 ? t.sourceName : `(Other)` + t.sourceName}</Typography>
                                <Typography sx={{textAlign:"center"}}>{mapFormatDate(t.date)}</Typography>
                            </Box>
                        </ListItem>
                    ))}            
                    <TransactionForm open={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} oldTransaction={selectedTransaction}/>        
                </List>
            </Box>
        </Box>
    )
}