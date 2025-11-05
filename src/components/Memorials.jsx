import { useState } from 'react';
import axios from 'axios';
import { useLang } from './LangContext';
import { Link } from 'react-router-dom';

export default function Memorials({ memorials, onRefresh }) {
  const { txt } = useLang();
  const [form, setForm] = useState({ name:'', dod:'', message:'' });

  const submit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5001/memorial', form);
    setForm({ name:'', dod:'', message:'' });
    onRefresh();
  };

  return (
    <div className="card mb-4">
      <div className="card-header"><h5>6. {txt('memorial')}</h5></div>
      <div className="card-body">
        {memorials.map(m=>(
          <div key={m.id} className="border rounded p-3 mb-2 text-center">
            <h6>{m.name} ({m.dod})</h6>
            <p>{m.message.slice(0,100)}{m.message.length>100?'...':''}</p>
            <Link to={/memorial/} className="btn btn-sm btn-outline-primary">View Full</Link>
          </div>
        ))}

        <form onSubmit={submit} className="row g-3 mt-3">
          <div className="col-md-4"><input className="form-control" placeholder="Deceased Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="col-md-3"><input className="form-control" type="date" value={form.dod} onChange={e=>setForm({...form,dod:e.target.value})} required/></div>
          <div className="col-md-5"><textarea className="form-control" rows="2" placeholder="Condolence message" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/></div>
          <div className="col-12"><button className="btn btn-warning">{txt('post')}</button></div>
        </form>
      </div>
    </div>
  );
}
