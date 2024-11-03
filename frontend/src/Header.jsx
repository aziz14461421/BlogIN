import { useContext, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from './UserContexte';
export default function Header() {
    const {userInfo,setUserInfo}=useContext(UserContext)
    useEffect(()=>{
        fetch('http://localhost:4000/profile',{
            credentials:'include',
        }).then(response => {
            response.json().then((userInfo)=>{
                setUserInfo(userInfo);
            })
        })
    },[])
    const logout =()=>{
        fetch('http://localhost:4000/logout',
            {
                credentials:'include',
                method:'POST'
            }
        )
        setUserInfo(null)
    }
    const username=userInfo?.username;
    return (
        <header>
            <Link to="/" className="logo">BlogIN</Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Create Post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login" className="login">Log in</Link>
                        <Link to="/signin" className="signin">Sign in</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
