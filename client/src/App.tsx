
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminPage from './pages/Admin/Admin';
import HomePage from "./pages/Home/Home"

function App() {
    return (         
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    </BrowserRouter> );
}

export default App;