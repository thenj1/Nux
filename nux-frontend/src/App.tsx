import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Products from './pages/Products';
import RawMaterials from './pages/RawMaterials';
import Production from './pages/Production';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/production" element={<Production />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
