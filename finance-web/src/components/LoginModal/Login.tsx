import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import type { LoginUser } from "../../models/User";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function Login({ open, onClose }: Props) {
    const [loginForm, setLoginForm] = useState<LoginUser>({
        login: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {login: authLogin} = useAuth();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{            
            const res = await api.post("/Auth/login", loginForm);
            authLogin(res.data.token, res.data.userInfo); 
            onClose();
        }catch{
            setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Login</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField label="Username or Email" id="login" name="login" value={loginForm.login} fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Senha" type="password" id="password" name="password" value={loginForm.password} fullWidth margin="normal" onChange={handleInputChange} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {loading && <p>Carregando...</p>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                    <Button variant="contained" color="primary" type="submit">Entrar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
} 