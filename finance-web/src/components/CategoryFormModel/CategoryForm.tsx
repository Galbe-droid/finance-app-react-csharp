import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { ReturnCategory, CategoryDto } from "../../models/Category";
import { useCategories } from "../../context/CategoryContext";

type Props = {
    open: boolean,
    onClose: () => void,
    oldCategory: ReturnCategory | null,
};

export default function CategoryForm ({open, onClose, oldCategory}: Props) {
    const [categoryForm, setCateogoryForm] = useState<CategoryDto>(
        !oldCategory ? {
            title: '',
            description: '',
        }:{
            title: oldCategory.title,
            description: oldCategory.description,
        }
    )
    const [errors, setErrors] = useState({
        title: '',
        description: '',
    })
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);
    const { createCategory, updateCategory, deleteCategory } = useCategories();

    useEffect(() => {
        if (oldCategory) {
            setCateogoryForm(oldCategory);
        } else {
          setCateogoryForm({
            title: "",
            description: "",
        })
    }}, [oldCategory]);

    const validate = () => {
        const newErrors = {title:'', description: ''}

        if(!categoryForm.title){
            newErrors.title = "Nome e Obrigatorio";
        } else if(categoryForm.title.length < 3){
            newErrors.title = "Titulo deve ter mais de 3 letras";
        } else if(categoryForm.title.length > 31){
            newErrors.title = "Titulo deve no maximo 30 letras";
        }

        if(categoryForm.description.length > 101){
            newErrors.description = "Descrição deve ter no maximo 100 caracteres"
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((e) => e === "");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCateogoryForm((prev) => ({ ...prev, [name]: value  }));
        setErrors((prev) => ({...prev, [name]: ""}));
    }

    const handleDelete = async() => {
        if(!confirm("Tem certeza que deseja essa Categoria?"))
        {
            onClose();
        }
        else
        {
            if(oldCategory != null)
               await deleteCategory(oldCategory.id);
            onClose()
        }
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try{            
            if(!validate()){
                setLoading(false)
                return;
            } 
            if(!oldCategory){
                await createCategory(categoryForm) 
            }else{
                await updateCategory(oldCategory.id, categoryForm)
            };    
            
            onClose();
        }catch{
            setMainError("Ocorreu um erro ao tentar criar a categoria. Por favor, tente novamente.");
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            {!oldCategory? 
                <DialogTitle sx={{ fontWeight: 'bold'}}>Criar Categoria</DialogTitle>
                :
                <DialogTitle sx={{ fontWeight: 'bold'}}>Atualizar Categoria</DialogTitle>
            }  
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap:2
                }}>
                    <TextField label="Nome" name="title" value={categoryForm.title} error={!!errors.title} helperText={errors.title} onChange={handleInputChange}/>
                    <TextField label="Descrição" aria-label="minimum height" minRows={3} name="description" value={categoryForm.description} error={!!errors.description} helperText={errors.description} onChange={handleInputChange}/>

                    <DialogActions>                        
                        <Button type="button" onClick={onClose} variant="contained" color="secondary">Cancelar</Button>
                        {oldCategory ? <Button type="button" onClick={() => {handleDelete()}} variant="contained" color="secondary">
                                                                                    Deletar
                                                                                    </Button> : <></>}
                        <Button variant="contained" color="primary" type="submit" disabled={!categoryForm.title}>{oldCategory ? <>Atualizar</> : <>Criar</>}</Button>
                    </DialogActions>
                    {mainError && <p style={{ color: 'red' }}>{mainError}</p>}
                    {loading && <p>Carregando...</p>}
                </DialogContent>
            </form>
        </Dialog>
    )
}