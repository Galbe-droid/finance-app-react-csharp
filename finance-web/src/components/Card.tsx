import { alpha, Box, Typography } from "@mui/material";

type Props = {
    name?: string;
    value?: number;
}

export default function Card({ name, value }: Props) {
    return(
        <Box sx={(theme) => ({
            backgroundColor: alpha(theme.palette.common.white, 0.5),
            backdropFilter: "blur(14px)",
            pl: 2,
            pr: 2,
            pt: 1,
            pb: 1,
            width: 350,
            height: 100,
            textAlign: "right",
            alignContent: "center",
            borderRadius: 2,
        })}>
            <Typography sx={{
                fontSize: "18px",
                fontWeight: "bold",
                pt: 0.5,
                pb: 0.5,  
            }}>{name}</Typography>
            <Typography sx={{
                fontSize: "32px",
                fontWeight: "bold",
            }}>{value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
        </Box>
    );
}