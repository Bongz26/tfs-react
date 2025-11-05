import { useState } from 'react';
import axios from 'axios';
import { useLang } from './LangContext';

export default function Clients({ clients, onRefresh }) {
  const { txt } = useLang();
  const [form, setForm] = useState({ name: '', id_num: '', phone: '' });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('id_num', form.id_num);
    data.append('phone', form.phone);
    if (file) data.append('id_doc', file);

    if (editing) {
      await axios.put('http://localhost:5001/client/', form);
    } else {
      await axios.post('http://localhost:5001/client', data);
    }
    setForm({ name: '', id_num: '', phone: '' });
    setFile(null);
    setEditing(null);
    onRefresh();
  };

  const startEdit = c => {
    setEditing(c);
    setForm({ name: c.name, id_num: c.id_num, phone: c.phone });
  };

  const del = async id => {
    if (!window.confirm(txt('delete') + '?')) return;
    await axios.delete(http://localhost:5001/client/);
    onRefresh();
  };

  return (
    <div className="card mb-4">
      <div className="card-header"><h5>1. Digital Onboarding</h5></div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3"><input className="form-control" placeholder={txt('client_name')} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="col-md-3"><input className="form-control" placeholder={txt('id_num')} value={form.id_num} onChange={e=>setForm({...form,id_num:e.target.value})} required/></div>
          <div className="col-md-3"><input className="form-control" placeholder={txt('phone')} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></div>
          <div className="col-md-3"><input type="file" className="form-control" accept=".pdf,.jpg,.png" onChange={e=>setFile(e.target.files[0])}/></div>
          <div className="col-12">
            <button className="btn btn-warning me-2">{editing?txt('save'):txt('upload')}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={()=>{setEditing(null);setForm({name:'',id_num:'',phone:''});}}>Cancel</button>}
          </div>
        </form>

        <table className="table mt-4">
          <thead className="table-dark"><tr><th>{txt('client_name')}</th><th>{txt('id_num')}</th><th>{txt('phone')}</th><th>Actions</th></tr></thead>
          <tbody>
            {clients.length ? clients.map(c=> (
              <tr key={c.id}>
                <td>{c.name}</td><td>{c.id_num}</td><td>{c.phone}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={()=>startEdit(c)}>{txt('edit')}</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>del(c.id)}>{txt('delete')}</button>
                </td>
              </tr>
            )) : <tr><td colSpan={4} className="text-muted">{txt('no_clients')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
