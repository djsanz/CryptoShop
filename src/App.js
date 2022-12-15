import { GetDebugLvl } from './config/Entorno'
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"
import './idiomas/i18n';
import './App.css';
import { ProtectedRoute } from './hooks/LoginHook'
import NavBar from './components/NavBar';
import PieBar from './components/PieBar';
import Home from './pages/Home'
import Products from './pages/Products';
import Pedidos from './pages/Pedidos';
import Product from './pages/Product';
import Cesta from './pages/Cesta';

export default function App() {
  // eslint-disable-next-line
  const DebugLvl = GetDebugLvl();

  return (
    <div className="App bg-black text-white min-h-screen flex flex-col text-center overflow-x-clip">
      <UserProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Products" element={<Products/>} />
		  <Route path="/Product/:ProductID" element={<Product/>} />
          <Route path="/Cesta" element={<Cesta/>} />
          <Route path="/Pedidos" element={<ProtectedRoute><Pedidos/></ProtectedRoute>} />
          <Route path="*" element={<Home/>} />
        </Routes>
        <PieBar />
      </UserProvider>
    </div>
  );
}
