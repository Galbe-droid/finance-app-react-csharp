import { useEffect, useState } from "react";
import type { ReturnTransaction, UpdateTransactionDto } from "../../models/Transaction";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, type SelectChangeEvent } from "@mui/material";
import { TransactionType } from "../../enum/TransactionType";
import { SourceType, type SourceTypeValue } from "../../enum/SourceType";
import { useTransactions } from "../../context/TransactionContext";

type Props = {
    open: boolean,
    onClose: () => void,
    oldTransaction: ReturnTransaction | null,
};

export default function TransactionForm({open, onClose, oldTransaction}: Props){
    const [transactionForm, setTransactionForm] = useState<UpdateTransactionDto>(
        !oldTransaction ?{
            title: "",
            description: "",
            amount: 0,
            date: '',
            transactionType: 0,
            source: 0,
            sourceName: '',
            sourceDescription: '',
            categoryId: null,
            categoryName: "",
        }:{
            title: oldTransaction.title,
            description: oldTransaction.description,
            amount: oldTransaction.amount,
            date: oldTransaction.date,
            transactionType: oldTransaction.transactionType,
            source: oldTransaction.source,
            sourceName: oldTransaction.sourceName,
            sourceDescription: oldTransaction.sourceDescription,
            categoryId: oldTransaction === null ? null : oldTransaction.categoryId,
            categoryName: oldTransaction.categoryName,
        }   
    );
    const [errors, setErrors] = useState({
        title:'',
        description:'',
        sourceName:'',
        sourceDescription:'',
        date:''
    })
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const { createTransaction, updateTransaction, deleteTransaction } = useTransactions();

    useEffect(() => {
        if (oldTransaction) {
            setTransactionForm(oldTransaction);
        } else {
          setTransactionForm({
            title: "",
            description: "",
            amount: 0,
            date: '',
            transactionType: 0,
            source: 0,
            sourceName: '',
            sourceDescription: '',
            categoryId: null,
            categoryName: ""
        })
    }}, [oldTransaction]);

    const validade = () => {
        const newErrors = {
            title:'',
            description:'',
            sourceName:'',
            sourceDescription:'',
            date:''
        }

        if(!transactionForm.title){
            newErrors.title = "Nome e Obrigatorio";
        } else if(transactionForm.title.length < 3){
            newErrors.title = "Titulo deve ter mais de 3 letras";
        } else if(transactionForm.title.length > 31){
            newErrors.title = "Titulo deve no maximo 30 letras";
        }

        if(transactionForm.description.length > 101){
            newErrors.description = "Descrição deve ter no maximo 100 caracteres"
        }

        if(transactionForm.sourceName.length > 31){
            newErrors.sourceName = "Nome da Fonte deve ter no maximo vinte caracteres";
        }

        if(transactionForm.sourceDescription.length > 101){
            newErrors.sourceDescription = "Descrição da fonte deve ter no maximo 100 caracteres"
        }       

        if(!transactionForm.date){
            newErrors.date = "Data necessaria"
        }
        
        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const formAdjustiment = () => {
        const dataToSend = new Date(transactionForm.date)
        transactionForm.transactionType = transactionForm.amount >= 0 ? TransactionType.Ganho : TransactionType.Perda
        transactionForm.amount *= transactionForm.amount >= 0 ? 1 : -1
        transactionForm.date = dataToSend.toISOString();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransactionForm((prev) => ({ ...prev, [name]: value  }));
        setErrors((prev) => ({...prev, [name]: ""}));
    }

    const handleSelectChange = (e: SelectChangeEvent<SourceTypeValue>) => {
        const value = e.target.value as SourceTypeValue;
        setTransactionForm(prev => ({
            ...prev,
            source: value,
    }));
};

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{            
            if(!validade()) return;
            formAdjustiment();
            if(!oldTransaction){
                createTransaction(transactionForm)
                onClose();
            }else{
                updateTransaction(oldTransaction.id, transactionForm)
                onClose();
            };            
        }catch{
            setMainError("Ocorreu um erro ao tentar criar a transação. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            {!oldTransaction? 
                <DialogTitle sx={{ fontWeight: 'bold'}}>Criar Transação</DialogTitle>
                :
                <DialogTitle sx={{ fontWeight: 'bold'}}>Atualizar Transação</DialogTitle>
            }            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap:2
                }}>
                    <TextField label="Nome" name="title" value={transactionForm.title} error={!!errors.title} helperText={errors.title} onChange={handleInputChange}/>
                    <TextField label="Descrição" aria-label="minimum height" minRows={3} name="description" value={transactionForm.description} error={!!errors.description} helperText={errors.description} onChange={handleInputChange}/>
                    <TextField label="Valor" type="number" name="amount" value={transactionForm.amount} onChange={handleInputChange}/>
                    <TextField label="Data" type="date" name="date" value={transactionForm.date} error={!!errors.date} helperText={errors.date} onChange={handleInputChange} InputLabelProps={{ shrink: true }}/>
                    <Select name="source" id="source" value={transactionForm.source} onChange={handleSelectChange}>
                        {Object.entries(SourceType).map(([Key, value]) => (
                            <MenuItem key={Key} value={value}>
                                {Key}
                            </MenuItem>
                        ))}
                    </Select>
                    {transactionForm.source === SourceType.Outro ? 
                        <>                            
                            <TextField label="Fonte" name="sourceName" value={transactionForm.sourceName} placeholder="" error={!!errors.sourceName} helperText={errors.sourceName} onChange={handleInputChange}/>
                            <TextField label="Fonte - Descrição" aria-label="minimum height" minRows={2} name="sourceDescription" value={transactionForm.sourceDescription} error={!!errors.sourceDescription} helperText={errors.sourceDescription} onChange={handleInputChange}/>
                        </>
                        :
                        <>
                        </>
                    }

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        {oldTransaction ? <Button type="button" onClick={() => {if (!confirm("Tem certeza que deseja essa transação?")) return;
                                                                                    deleteTransaction(oldTransaction.id);
                                                                                    onClose()}} variant="contained" color="secondary">
                                                                                        Deletar
                                        </Button> : <></>}
                        <Button variant="contained" color="primary" type="submit" disabled={!transactionForm.title || !transactionForm.amount || !transactionForm.date}>
                            Entrar
                        </Button>
                    </DialogActions>
                    {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
                    {loading && <p>Carregando...</p>}
                </DialogContent>
            </form>
        </Dialog>
    )
}