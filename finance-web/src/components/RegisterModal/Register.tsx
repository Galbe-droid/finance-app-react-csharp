import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { RegisterUser } from "../../models/User";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function Register({open, onClose}: Props) {
    const [setUser, setUserForm] = useState<RegisterUser>({
        username: '',
        email: '',
        name: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState({
        username:'',
        email:'',
        name:'',
        password:''
    })

    const {register} = useAuth();

    const validade = () => {
        const newErrors = {
            username:'',
            email:'',
            name:'',
            password:''
        }
        const regex = /^[a-zA-Z0-9_]+$/;

        if(!setUser.username){
            newErrors.username = "Username e Obrigatorio";
        } else if(setUser.username.length < 4){
            newErrors.username = "Username deve ter mais de 5 letras";
        } else if(setUser.username.length > 18){
            newErrors.username = "Username deve no maximo 18 letras";
        } else if(!regex.test(setUser.username)){
            newErrors.username = "Username deve ter apenas letras e numeros";
        }

        if(!setUser.email){
            newErrors.email = "Email e Obrigatorio";
        } else if(setUser.email.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === -1){
            newErrors.email = "Email invalido";
        }

        if(!setUser.password){
            newErrors.password = "Senha e Obrigatoria";
        } else if(setUser.password.length < 6){
            newErrors.password = "Senha deve ter mais de 6 caracteres";
        }
        
        setFormError(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{            
            if(!validade()){
                setLoading(false)
                return;
            }
            else{
                const result = await register(setUser);
                if(result.success as boolean){
                    alert("Registro bem-sucedido! Agora você pode fazer login.");
                    onClose();
                } else {
                   setFormError(result.errors); 
                }
            }
            
        }catch{
            setError("Ocorreu um erro ao tentar fazer registro. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({...prev, [name]: ""}));
    }   

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Registrar</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField label="Username" id="username" name="username" value={setUser.username} error={!!formError.username} helperText={formError.username} fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Email" id="email" name="email" value={setUser.email} error={!!formError.email} helperText={formError.email} fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField label="Nome(Opcional)" id="name" name="name" value={setUser.name} error={!!formError.name} helperText={formError.name} fullWidth margin="normal" onChange={handleInputChange} />
                    <TextField type="password" label="Senha" id="password" name="password" value={setUser.password} error={!!formError.password} helperText={formError.password} fullWidth margin="normal" onChange={handleInputChange} />   
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {loading && <p>Carregando...</p>}

                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                    <Button variant="contained" color="primary" type="submit">Entrar</Button>
                </DialogActions> 
                </form>
            </DialogContent>

        </Dialog>
    );
}