import { useLang } from './LangContext';
export default function Navbar() {
  const { txt, toggle } = useLang();
  return (
    <nav className="navbar bg-primary text-white">
      <div className="container-fluid">
        <a className="navbar-brand text-warning" href="/">Thusanang FS</a>
        <button className="btn btn-warning btn-sm" onClick={toggle}>{txt('lang_btn')}</button>
      </div>
    </nav>
  );
}
