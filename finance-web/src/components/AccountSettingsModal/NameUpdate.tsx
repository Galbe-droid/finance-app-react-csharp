import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { UpdateName } from "../../models/User";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

type Props = {
    open: boolean,
    onClose: () => void,
};

export default function NameUpdate({open, onClose}: Props){
    const [newName, setNewName] = useState<UpdateName>({name: ''})
    const [errors, setErrors] = useState({name: '',})
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, nameUpdate} = useAuth();

    const validate = () => {
        const newErrors = {name:''}

        if(!newName.name){
            newErrors.name = "Nome e Obrigatorio";
        } else if(newName.name == user?.name){
            newErrors.name = "O novo nome e o antigo são iguais";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewName((prev) => ({ ...prev, [name]: value  }));
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
            nameUpdate(newName, user.id);
            
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
                      label="Nome"
                      name="name"
                      value={newName.name}
                      onChange={handleInputChange}
                      error={!!errors.name}
                      helperText={errors.name}
                    />

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        <Button variant="contained" color="primary" type="submit" disabled={!newName.name}>Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </form>
            {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
            {loading && <p>Carregando...</p>}
        </Dialog>
    )
}