import { createTheme } from "@mui/material";


export const theme = createTheme({
    palette:{
        mode: "light",
        background: {
          default: "#e7e7e7", 
          paper: "#004ba0",
        },
        common:{
            black: "#000",
            white: "#fff"
        },
        primary:{
            main: "#1976d2",  
        },
        secondary:{
            main: "#d32f2f",   
        },
        error:{
            main: "#d32f2f",   
        },
        text: {
            primary: "#000",
            secondary: "#fff",
        },
    },

    shape:{
        borderRadius: 8,
    },

    typography:{
        fontFamily: "Roboto, sans-serif",
    },

    
})

export const darkTheme = createTheme({
    palette: {
      mode: "dark",
        background: {
            default: "#121212",
            paper: "#6a0080",
        },
        common:{
            black: "#000",
            white: "#fff"
        },
        primary:{
            main: "#9c27b0",  
        },
        secondary:{
            main: "#d32f2f",   
        },
        error:{
            main: "#d32f2f",   
        },
        text: {
            primary: "#fff",
            secondary: "#000",
        },
    },

    shape:{
        borderRadius: 8,
    },
    
    typography:{
        fontFamily: "Roboto, sans-serif",
        
    },
});