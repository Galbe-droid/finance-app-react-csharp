import { Box, Button, Collapse, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useState } from "react";
import { useCategories } from "../context/CategoryContext";
import { useTransactions } from "../context/TransactionContext";
import { mapFormatDate } from "../mapper/mapper";
import { TransactionType } from "../enum/TransactionType";
import { CategoryType } from "../enum/CategoryType";
import CategoryForm from "../components/CategoryFormModel/CategoryForm";
import type { ReturnCategory } from "../models/Category";
import PopulateCategory from "../components/PopulateCategoryForm/PopulateCategory";

export default function Categorias(){
    const [open, setOpen] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [updateCategory, setUpdateCategory] = useState<ReturnCategory | null>(null);
    const [populateCategory, setPopulateCategory] = useState<string | null>(null);

    const {minCategories, getById} = useCategories();
    const {transactions} = useTransactions(); 

    const getReturnCategory = async(id:string): Promise<ReturnCategory> => {
        return await getById(id);
    }

    const Listing = () => {
        return(
            <>
                {minCategories.map((m) => (
                    <Box key={m.id}>
                        <ListItemButton sx={(theme) =>({
                            backgroundColor: theme.palette.primary.main,
                            borderBottom: "1px solid",
                        })}>
                        
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                                width: "100%",
                                gap: 2,
                            }}>
                                <Typography onClick={() => {setOpen(m.id); {return open === m.id ? null : open};}}>{m.title}</Typography>
                                <Typography onClick={() => {setOpen(m.id); {return open === m.id ? null : open};}} sx={{textAlign:"right"}}>
                                    {m.categoryType === CategoryType.Receita ? '+' : ''}
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.balance)}
                                </Typography>
                                <Typography onClick={() => {setOpen(m.id); {return open === m.id ? null : open};}} sx={{textAlign:"center"}}>{m.transactionsCount}</Typography>
                                <Typography  onClick={() => {setOpen(m.id); {return open === m.id ? null : open};}} sx={{
                                    width: "100%",
                                    color: "#fff",
                                    textAlign: "center"
                                }}>+</Typography>
                                <Typography  onClick={async() => {const returnCategory = await getReturnCategory(m.id); setUpdateCategory(returnCategory);}} sx={{
                                    width: "100%",
                                    color: "#fff",
                                    textAlign: "center"
                                }}>Atualizar</Typography>
                                <Typography  onClick={() => {setPopulateCategory(m.id)}} sx={{
                                    width: "100%",
                                    color: "#fff",
                                    textAlign: "center"
                                }}>+/- Transações</Typography>
                            </Box>                    
                        </ListItemButton>
                        <Collapse in={open === m.id}>
                                <List>
                                    <Box sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                        width: "100%",
                                        p:0,
                                        m:0,
                                        textAlign: "center",    
                                        borderBottom: "1px solid", 
                                    }}>
                                        <Typography>Nome</Typography>
                                        <Typography>Valor</Typography>
                                        <Typography>Tipo</Typography>
                                        <Typography>Data</Typography>
                                    </Box>
                                    <Box sx={{
                                        width: "100%",
                                        borderBottom: "1px solid",
                                    }}>
                                    {transactions?.filter(t => t.categoryId === m.id).map((t) => (
                                        <ListItem key={t.id}>    
                                            <Box sx={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                                width: "100%",
                                                gap: 2,
                                                p:0,
                                                m:0,
                                            
                                            }}>
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
                                </Box>
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </>        
        )
    }

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
                <Typography sx={{fontSize: "48px", fontWeight: "bold", textAlign: "left", textTransform: "uppercase"}}>Categorias</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent:"right",
            }}>
                <Button onClick={() => setOpenAdd(true)}><Typography sx={{fontSize: "18px", fontWeight: "Bold"}}>Adicionar</Typography></Button>
                <CategoryForm open={openAdd} onClose={() => setOpenAdd(false)} oldCategory={null}/>
            </Box>
            <Box sx={() =>({
                Width: "100%",
                height: "100%",
                border: "4px solid",
            })}>
                <List>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                        width: "100%",   
                        textAlign: "center",
                        borderBottom: "2px solid",    
                    }}>
                    
                        <Typography>Nome</Typography>
                        <Typography>Balanço</Typography>
                        <Typography>Quantas Transações</Typography>
                        <Typography>Mais info.</Typography>
                        <Typography>Atualizar</Typography>
                        <Typography>Adicionar/Remover</Typography>
                    </Box>
                    {Listing()}
                    <CategoryForm open={!!updateCategory} onClose={() => setUpdateCategory(null)} oldCategory={updateCategory}/>  
                    <PopulateCategory open={!!populateCategory} onClose={() => setPopulateCategory(null)} selectedCategory={populateCategory}/>                   
                </List>                
            </Box>
        </Box>
    )    
}