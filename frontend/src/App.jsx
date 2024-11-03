import { useState } from 'react'
import './App.css'
import Post from './Post'
import Header from './Header'
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import { UserContext, UserContextProvider } from './UserContexte';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <UserContextProvider>
                <Routes>
                    <Route path='/' element={<Layout/>}>
                        <Route index element={<Home />} />
                        <Route path='/login' element={<Login/>} />
                        <Route path='/signin' element={<SignIn/>} />
                        <Route path='/create' element={<CreatePost/>} />
                        <Route path='/post/:id' element={<PostPage/>} />
                        <Route path='/edit/:id' element={<EditPost/>} />
                    </Route>
                </Routes>
            </UserContextProvider>

        </>
    )
}

export default App
