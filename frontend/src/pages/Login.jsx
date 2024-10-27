import { useState } from "react"
import { Navigate } from "react-router-dom";

export default function Login() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false)
    const login = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:4000/login",{
            method : 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
            setRedirect(true)
        }else{
            alert('wrong credentials')
        }


    }
    if (redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <div>
            <form className="login" onSubmit={login}>
                <h1>Login</h1>
                <input type="text"
                placeholder="User Name"
                value={username}
                onChange={e=> setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                 />
                <button>Login</button>
            </form>
        </div>
    )
}
