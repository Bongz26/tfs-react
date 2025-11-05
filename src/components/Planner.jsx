import { useState } from 'react';
import axios from 'axios';
import { useLang } from './LangContext';

const SERVICES = ['Burial – 3 Tier', 'Burial – Econo', 'Cremation', 'Pre-Need Plan'];

export default function Planner({ clients, cases, onRefresh }) {
  const { txt } = useLang();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ client_id: '', service: SERVICES[0], date: today, items: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5001/case', form);
    setForm({ ...form, items: '' });
    onRefresh();
  };

  const nameMap = clients.reduce((m, c) => (m[c.id] = c.name, m), {});

  return (
    <div className="card mb-4">
      <div className="card-header"><h5>2. {txt('plan')}</h5></div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <select className="form-select" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} required>
              <option value="" disabled>Select client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input className="form-control" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Coffin, Urn, Tent" value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} />
          </div>
          <div className="col-12">
            <button className="btn btn-warning">{txt('get_quote')}</button>
          </div>
        </form>

        <table className="table mt-4">
          <thead className="table-dark">
            <tr><th>Client</th><th>Service</th><th>Date</th><th>Items</th><th>Action</th></tr>
          </thead>
          <tbody>
            {cases.length ? cases.map(cs => (
              <tr key={cs.id}>
                <td>{nameMap[cs.client_id] || '??'}</td>
                <td>{cs.service}</td>
                <td>{cs.date}</td>
                <td>{cs.items?.join(', ') || ''}</td>
                <td>
                  <button className="btn btn-sm btn-success" onClick={async () => {
                    await axios.post(`http://localhost:5001/dispatch/${cs.id}`);
                    onRefresh();
                  }}>Dispatch</button>
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="text-muted">{txt('no_cases')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
      }          </div>
          <div className="col-md-2"><input className="form-control" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div>
          <div className="col-md-2"><input className="form-control" placeholder="Coffin, Urn, Tent" value={form.items} onChange={e=>setForm({...form,items:e.target.value})}/></div>
          <div className="col-12"><button className="btn btn-warning">{txt('get_quote')}</button></div>
        </form>

        <table className="table mt-4">
          <thead className="table-dark"><tr><th>Client</th><th>Service</th><th>Date</th><th>Items</th><th>Action</th></tr></thead>
          <tbody>
            {cases.length ? cases.map(cs=> (
              <tr key={cs.id}>
                <td>{nameMap[cs.client_id] || '??'}</td>
                <td>{cs.service}</td>
                <td>{cs.date}</td>
                <td>{cs.items?.join(', ') || ''}</td>
                <td>
                  {dispatched.has(cs.id) ?
                    <span className="text-success">Dispatched</span> :
                    <button className="btn btn-sm btn-success" onClick={async()=>{await axios.post(http://localhost:5001/dispatch/);onRefresh();}}>Dispatch</button>
                  }
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="text-muted">{txt('no_cases')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
