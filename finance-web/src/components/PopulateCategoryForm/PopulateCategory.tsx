import { Dialog, Box, Typography, DialogActions, Button, DialogContent, DialogTitle } from "@mui/material";
import type { ReturnTransaction, UpdateTransactionDto } from "../../models/Transaction";
import { useTransactions } from "../../context/TransactionContext";
import { TransactionType } from "../../enum/TransactionType";
import { SourceType } from "../../enum/SourceType";

type Props = {
    open: boolean,
    onClose: () => void,
    selectedCategory: string | null,
};

export default function PopulateCategory({open, onClose, selectedCategory}: Props){
    const {transactions, updateTransaction} = useTransactions();
 
    const toggleTransaction = async(t:ReturnTransaction) => {        
        const updated = {
            ...t,
            categoryId:
            t.categoryId === selectedCategory
            ? null
            : selectedCategory
        }

        const updateMap: UpdateTransactionDto = updated;        
        await updateTransaction(t.id, updateMap);
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Selecionar Transações</DialogTitle>

            <DialogContent>
                <Typography sx={{pb: 2}}>Clique nas transações, transações em verde são da categoria selecionada</Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {transactions.map((t) => {
                    const isSelected = t.categoryId === selectedCategory;
                
                    return (
                      <Box
                        key={t.id}
                        onClick={() => toggleTransaction(t)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? "success.light"
                            : "grey.900",
                          color: isSelected ? "black" : "white",
                          transition: "0.2s",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? "success.main"
                              : "grey.800",
                          },
                        }}
                      >
                        <Typography sx={{textAlign: "center"}}>{t.title} | 
                            {t.transactionType === TransactionType.Ganho ? <> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}</> : <> R$: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount *-1)}</>} |  
                            {t.source === SourceType.Outro ?  <> Other: {t.sourceName}</> : <> {t.sourceName}</>} | 
                            {t.categoryName === "" ? <> N/A</> : <> {t.categoryName}</>}</Typography>
                      </Box>
                    );
                  })}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained" color="secondary">Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}