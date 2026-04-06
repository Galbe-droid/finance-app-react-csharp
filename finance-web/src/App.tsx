import { Route, Routes } from 'react-router';
import api from './api/api';
import './App.css'
import Layout from './layout/Layout';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useState } from 'react';
import { darkTheme, theme } from './theme/theme';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes';
import PrivateRoute from './router/PrivateRoute';
import Conta from './pages/Conta';

const token = localStorage.getItem("token");

if(token){
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const chooseTheme = darkMode ? darkTheme : theme;


  return (
    <ThemeProvider theme={chooseTheme}>
      <CssBaseline/>
      <button onClick={() => setDarkMode(!darkMode)} style={{position: "absolute", top: 10, right: 10, height: 40, width: 40, borderRadius: "50%"}}>
          <NightlightIcon/>
      </button>  
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/categorias' element={<PrivateRoute><Categorias/></PrivateRoute>}/>
          <Route path='/transacoes' element={<PrivateRoute><Transacoes/></PrivateRoute>}/>
          <Route path='/conta' element={<PrivateRoute><Conta/></PrivateRoute>}/>
        </Route>
      </Routes>
    </ThemeProvider>   
  )
}

export default App
