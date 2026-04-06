import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { UpdatePassword } from "../../models/User";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function PasswordUpdate({open, onClose}: Props){
    const [newPassword, setNewPassword] = useState<UpdatePassword>({confirmPassword: '', newPassword: ''})
    const [errors, setErrors] = useState({newPassword: '',})
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, passwordUpdate} = useAuth();

    const validate = () => {
        const newErrors = {newPassword:''}

        if(!newPassword.newPassword){
            newErrors.newPassword = "Nome e Obrigatorio";
        } else if(newPassword.newPassword.length < 5){
            newErrors.newPassword = "Titulo deve ter mais de 6 caracteres";
        } else if(newPassword.newPassword == newPassword.confirmPassword){
            newErrors.newPassword = "A nova senha e a confirmação são iguais";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPassword((prev) => ({ ...prev, [name]: value  }));
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
            passwordUpdate(newPassword, user.id);
            
            onClose();
        }catch{
            setMainError("Ocorreu um erro. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }
 
    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Mudar Senha</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <TextField
                        type="password"
                        label="Senha Atual"
                        name="confirmPassword"
                        value={newPassword.confirmPassword}
                        onChange={handleInputChange}
                    />
                    <TextField
                        type="password"
                        label="Nova Senha"
                        name="newPassword"
                        value={newPassword.newPassword}
                        onChange={handleInputChange}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                    />

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        <Button variant="contained" color="primary" type="submit" disabled={!newPassword.newPassword}>Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </form>
            {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
            {loading && <p>Carregando...</p>}
        </Dialog>
    )
}