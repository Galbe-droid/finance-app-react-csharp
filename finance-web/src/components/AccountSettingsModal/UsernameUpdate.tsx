import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { UpdateUsername } from "../../models/User";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function UsernameUpdate({open, onClose}: Props){
    const [newUsername, setNewUsername] = useState<UpdateUsername>({newUsername: ''})
    const [errors, setErrors] = useState({username: '',})
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, usernameUpdate} = useAuth();

    const validate = () => {
        const newErrors = {username:''}
        const regex = /^[a-zA-Z0-9_]+$/;

        if(!newUsername.newUsername){
            newErrors.username = "Username e Obrigatorio";
        } else if(!regex.test(newUsername.newUsername)){
            newErrors.username = "Username deve ter apenas letras e numeros";
        } else if(newUsername.newUsername.length < 4){
            newErrors.username = "Username deve ter mais de 5 letras";
        } else if(newUsername.newUsername.length > 18){
            newErrors.username = "Username deve no maximo 18 letras";
        } else if(newUsername.newUsername == user?.username){
            newErrors.username = "O novo username e o antigo são iguais";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUsername((prev) => ({ ...prev, [name]: value  }));
        setErrors((prev) => ({...prev, [name]: ""}));
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{            
            if(!validate() || user === null){
                setLoading(false)
                return;
            } 
            usernameUpdate(newUsername, user.id);
            
            onClose();
        }catch{
            setMainError("Ocorreu um erro. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }
 
    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Mudar Nome</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <TextField
                      label="Username"
                      name="newUsername"
                      value={newUsername.newUsername}
                      onChange={handleInputChange}
                      error={!!errors.username}
                      helperText={errors.username}
                    />

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        <Button variant="contained" color="primary" type="submit" disabled={!newUsername.newUsername}>Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </form>
            {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
            {loading && <p>Carregando...</p>}
        </Dialog>
    )
}