import { alpha, Box } from "@mui/material";

type Props = {
    children?: React.ReactNode;
}

export default function LargeCard({ children }: Props ) {
    return(
        <Box sx={(theme) => ({
            backgroundColor: alpha(theme.palette.common.white, 0.5),
            backdropFilter: "blur(14px)",
            pl: 2,
            pr: 2,
            pt: 1,
            pb: 1,
            width: 500,
            height: 400,
            textAlign: "right",
            alignContent: "center",
            borderRadius: 2,
        })}>
            {children}
        </Box>
    )
}