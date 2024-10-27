import { useState } from "react"


export default function SignIn() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const register = async (e)=>{
        try {
            e.preventDefault();
        const response = await fetch("http://localhost:4000/signin",{
            method : 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        })
        alert('good')
        } catch (e) {
            alert('bad')
        }

    }
    return(
        <div>
            <form className="login" onSubmit={register}>
                <h1>Sign In</h1>
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
                <button>Sign In</button>
            </form>
        </div>
    )
}
