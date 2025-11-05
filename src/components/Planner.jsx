import { useState } from 'react';
import API from './fixed-api';
import { useLang } from './LangContext';

const SERVICES = ['Burial – 3 Tier', 'Burial – Econo', 'Cremation', 'Pre-Need Plan'];
const GROCERY_PACKS = [
  '30kg Maize + 10kg Sugar + Oil',
  'Full Family Pack R850',
  'Bread + Milk + Tea Pack'
];

export default function Planner({ clients, cases, onRefresh }) {
  const { txt } = useLang();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    client_id: '', service: SERVICES[0], date: today, items: ''
  });

  const addPack = (pack) => {
    setForm({ ...form, items: form.items ? `${form.items}, ${pack}` : pack });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/case', form);
    setForm({ ...form, items: '' });
    onRefresh();
  };

  const nameMap = clients.reduce((m, c) => (m[c.id] = c.name, m), {});

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5>2. {txt('plan')}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Existing fields */}
          <div className="col-md-3">
            <select className="form-select" value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} required>
              <option value="" disabled>Select client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input className="form-control" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Coffin, Urn" value={form.items} readOnly />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-warning w-100">Get Quote</button>
          </div>
        </form>

        {/* GROCERY PACKS */}
        <div className="mt-3">
          <small className="text-dignity">Add Grocery Pack:</small>
          <div className="row g-2 mt-1">
            {GROCERY_PACKS.map(p => (
              <div key={p} className="col-4">
                <button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={() => addPack(p)}>
                  {p.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cases table */}
        <table className="table mt-4">
          <thead className="table-dark">
            <tr><th>Client</th><th>Service</th><th>Date</th><th>Items</th><th>Action</th></tr>
          </thead>
          <tbody>
            {cases.map(cs => (
              <tr key={cs.id}>
                <td>{nameMap[cs.client_id] || '??'}</td>
                <td>{cs.service}</td>
                <td>{cs.date}</td>
                <td>{cs.items?.join(', ')}</td>
                <td>
                  <button className="btn btn-sm btn-success" onClick={async () => {
                    await API.post(`/dispatch/${cs.id}`);
                    onRefresh();
                  }}>
                    Dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
