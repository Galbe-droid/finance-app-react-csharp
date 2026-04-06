import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { UpdateEmail } from "../../models/User";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function EmailUpdate({open, onClose}: Props){
    const [newEmail, setNewEmail] = useState<UpdateEmail>({newEmail: ''})
    const [errors, setErrors] = useState({newEmail: '',})
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, emailUpdate} = useAuth();

    const validate = () => {
        const newErrors = {newEmail:''};

        if(!newEmail.newEmail){
            newErrors.newEmail = "Email e Obrigatorio";
        } else if(newEmail.newEmail.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === -1){
            newErrors.newEmail = "Email invalido";
        } else if(newEmail.newEmail == user?.email){
            newErrors.newEmail = "O novo email e o antigo são iguais";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmail((prev) => ({ ...prev, [name]: value  }));
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
            emailUpdate(newEmail, user.id);
            
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
                      label="Email"
                      name="newEmail"
                      value={newEmail.newEmail}
                      onChange={handleInputChange}
                      error={!!errors.newEmail}
                      helperText={errors.newEmail}
                    />

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        <Button variant="contained" color="primary" type="submit" disabled={!newEmail.newEmail}>Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </form>
            {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
            {loading && <p>Carregando...</p>}
        </Dialog>
    )
}