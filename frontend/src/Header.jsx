import {Link} from 'react-router-dom';
export default function Header() {
    return (
        <header>
            <Link to="/" className="logo">BlogIN</Link>
            <nav>
                <Link to="/login" className="login">Log in</Link>
                <Link to="/signin" className="signin">Sign in</Link>
            </nav>
        </header>
    );
}
