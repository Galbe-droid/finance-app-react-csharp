import Box from "@mui/material/Box";
import { alpha, Button, Typography } from "@mui/material";
import { useState } from "react";
import Login from "./LoginModal/Login";
import { useAuth } from "../auth/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import { useCategories } from "../context/CategoryContext";
import Register from "./RegisterModal/Register";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const [registrerOpen, setRegisterOpen] = useState(false);
    const { isAuthenticated, logout: authLogout, user } = useAuth();
    const { transactionClearCache, balance } = useTransactions();
    const { categoryClearCache } = useCategories();

    const Cleaning = () => {
        transactionClearCache();
        categoryClearCache();
    }

    return(
        <Box
            sx = {{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                alignItems: "center",

            }}
        >
            {!isAuthenticated && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, mt: 4, mb: 4}}>
                <Button onClick={() => setOpen(true)} sx={{backgroundColor: "primary.main", color: "white", width: "150px"}}>Login</Button>
                <Button onClick={() => setRegisterOpen(true)} sx={{backgroundColor: "primary.main", color: "white", width: "150px"}}>Registrar</Button>
                <Login open={open} onClose={() => setOpen(false)}/>
                <Register open={registrerOpen} onClose={() => setRegisterOpen(false)}/>
                </Box>
            )}
            {isAuthenticated && (
                <Box sx={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    color: "text.primary",
                    textAlign: "center",
                    m: 4,
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.default, 0.3),
                    backdropFilter: "blur(10px)",
                    width: "80%",
                    borderRadius: 2,
                    gap: 0.5,
                })}>
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>{user?.name}</Typography>
                    <Typography sx={{fontSize: "18px"}}>
                        Balanço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                    </Typography>
                </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", alignItems: "center", mt:4}}>
                {isAuthenticated && (
                    <>
                        <Button sx={{backgroundColor: "primary.main", color: "white", width: "150px"}} href="/" >Dashboard</Button>
                        <Button sx={{backgroundColor: "primary.main", color: "white", width: "150px"}} href="/categorias">Categorias</Button>
                        <Button sx={{backgroundColor: "primary.main", color: "white", width: "150px"}} href="/transacoes">Transações</Button>
                        <Button sx={{backgroundColor: "primary.main", color: "white", width: "150px"}} href="/conta">Conta</Button>
                    </>
                )}
            </Box>
            

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", alignItems: "center", mt: "auto", mb: 4}}>
                {isAuthenticated && (
                    <Button onClick={() => { Cleaning(); authLogout(); }} sx={{backgroundColor: "secondary.main", color: "white", width: "150px"}}>Logout</Button>
                )}                
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "10px" }}>
                    Desenvolvido por Gabriel Lima Bertoldo
                </Typography>
            </Box>
        </Box>
    );
}