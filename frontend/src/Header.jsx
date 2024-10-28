import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
export default function Header() {
    const [username,setUsername] = useState(null);
    useEffect(()=>{
        fetch('http://localhost:4000/profile',{
            credentials:'include',
        }).then(response => {
            response.json().then((userInfo)=>{
                setUsername(userInfo.username);
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
    }
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
