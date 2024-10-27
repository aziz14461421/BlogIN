import { useState } from 'react'
import './App.css'
import Post from './Post'
import Header from './Header'
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignIn from './pages/SignIn';

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Home />} />
                    <Route path='/login' element={<Login/>} />
                    <Route path='/signin' element={<SignIn/>} />
                </Route>
            </Routes>
        </>
    )
}

export default App
