import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import NameUpdate from "../components/AccountSettingsModal/NameUpdate";
import PasswordUpdate from "../components/AccountSettingsModal/PasswordUpdate";
import EmailUpdate from "../components/AccountSettingsModal/EmailUpdate";
import { useCategories } from "../context/CategoryContext";
import { useTransactions } from "../context/TransactionContext";
import UsernameUpdate from "../components/AccountSettingsModal/UsernameUpdate";

export default function Conta(){
    const [nameOpen, setNameOpen] = useState(false);
    const [usernameOpen, setUsernameOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const {user, deleteAccount, logout} = useAuth();
    const { categoryClearCache } = useCategories();
    const { transactionClearCache } = useTransactions();

    const deleteAccountSequence = async (id: string) => {
        categoryClearCache();
        transactionClearCache();
        deleteAccount(id);     
        logout()   
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
                <Typography sx={{fontSize: "48px", fontWeight: "bold", textAlign: "left", textTransform: "uppercase"}}>Conta</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                width: "30%",
                overflowY: "hidden", 
                pt:5,
                justifyContent: "evenly",
                alignItems:"left",      
                justifyItems:"center",           
                border: "4px solid",
            }}>
                <Box sx={{display: "flex", flexDirection: "row", mb:4, ml:2, gap: 2, alignItems:"center", }}>
                    <Typography><strong>Username:</strong> {user?.username} </Typography>
                    <Button onClick={() => setUsernameOpen(true)} sx={(theme) => ({backgroundColor: theme.palette.primary.main, color: theme.palette.common.white})}>Mudar Username</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", mb:4, ml:2, gap: 2, alignItems:"center", }}>
                    <Typography><strong>Name:</strong> {user?.name} </Typography>
                    <Button onClick={() => setNameOpen(true)} sx={(theme) => ({backgroundColor: theme.palette.primary.main, color: theme.palette.common.white})}>Mudar Name</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", mb:4,gap: 2, ml:2, alignItems:"center",}}>
                    <Typography><strong>Email:</strong> {user?.email} </Typography>
                    <Button onClick={() => setEmailOpen(true)} sx={(theme) => ({backgroundColor: theme.palette.primary.main, color: theme.palette.common.white})}>Mudar Email</Button>
                </Box>        
                <Box sx={{display: "flex", flexDirection: "row", mb:4,gap: 2, ml:2, alignItems:"center",}}>
                    <Typography><strong>Senha:</strong> </Typography>
                    <Button onClick={() => setPasswordOpen(true)} sx={(theme) => ({backgroundColor: theme.palette.primary.main, color: theme.palette.common.white})}>Mudar Senha</Button>
                </Box>         
                <Box sx={{display: "flex", flexDirection: "row", mb:4,gap: 2, ml:2, alignItems:"center",}}>
                    <Typography><strong>Deletar Conta:</strong> </Typography>
                    <Button onClick={() => (!confirm("Tem certeza que deseja deletar essa conta?") ? null : deleteAccountSequence(user?.id as string))} sx={(theme) => ({backgroundColor: theme.palette.error.main, color: theme.palette.common.black})}>Deletar</Button>
                </Box>  
            </Box>
            <NameUpdate open={nameOpen} onClose={() => setNameOpen(false)}/>
            <PasswordUpdate open={passwordOpen} onClose={() => setPasswordOpen(false)}/>
            <EmailUpdate open={emailOpen} onClose={() => setEmailOpen(false)}/>
            <UsernameUpdate open={usernameOpen} onClose={() => setUsernameOpen(false)}/>
        </Box>
    )
}