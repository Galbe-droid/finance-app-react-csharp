import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Box from "@mui/material/Box";


export default function Layout() {    
    return(
        <Box
            sx={{
              display: "flex",
              height: "100vh",   
              width: "100vw",
              overflow: "hidden", 
            }}
        >
            <Box
                sx={{
                    backgroundColor: "background.paper",
                    width: 240,
                    height: "100vh",
                }}
            >
                <Sidebar/>
            </Box>
            <Box sx={(theme) => ({
                backgroundColor: theme.palette.background.default,
                width: "100%",
                height: "100vh",
                overflowY: "hidden",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            })}>
                <Outlet/> 
            </Box>
            
        </Box>
    )
}