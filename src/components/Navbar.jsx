import { Link } from 'react-router-dom';
import { useLang } from './LangContext';

export default function Navbar() {
  const { txt } = useLang();
  return (
    <nav className="navbar bg-primary shadow">
      <div className="container">
        <Link to="/" className="navbar-brand text-white fw-bold">
          <span className="text-gold">T</span>FS Manager
        </Link>
        <span className="text-white small">
          Respectful • Professional • Dignified
        </span>
      </div>
    </nav>
  );
}
