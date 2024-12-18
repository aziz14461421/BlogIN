import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

export default function CreatePost(){
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect] = useState(false)
    const createNewPost = async (ev)=>{
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('file', files[0]);
        data.set('content', content);
        ev.preventDefault()
        const response = await fetch('http://localhost:4000/post',
            {
                method : 'POST',
                body: data,
                credentials:'include'
            }
        )
        if(response.ok) {
            setRedirect(true);
        }

    }
    if(redirect){
        return(<Navigate to={'/'}/>)
    }
    return(
    <form onSubmit={createNewPost}>
        <input type='title'
            placeholder="Title"
            value={title}
            onChange={e=>{setTitle(e.target.value)}}
        />
        <input type='summary'
            placeholder="Summary"
            value={summary}
            onChange={e=>{setSummary(e.target.value)}}
        />
        <input type='file' onChange={e=>setFiles(e.target.files)} />
        <ReactQuill value={content} onChange={newValue=>{setContent(newValue)}} theme='snow'/>
        <button style={{marginTop:'5px'}}>Create Post</button>
    </form>
)}
