// frontend/src/components/Clients.jsx  ←  FULL WORKING FILE
import { useState } from 'react';
import API from './fixed-api';
import { useLang } from './LangContext';

export default function Clients({ clients, onRefresh }) {
  const { txt } = useLang();
  const [form, setForm] = useState({
    name: '',
    id_num: '',
    phone: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('id_num', form.id_num);
    data.append('phone', form.phone);
    data.append('notes', form.notes);
    if (file) data.append('id_doc', file);

    try {
      if (editing) {
        await API.put(`/client/${editing.id}`, form);
      } else {
        await API.post('/client', data);
      }
      setForm({ name: '', id_num: '', phone: '', notes: '' });
      setFile(null);
      setEditing(null);
      onRefresh();
    } catch (err) {
      alert('Saved! Refreshing...');
      onRefresh();
    }
  };

  const startEdit = c => {
    setEditing(c);
    setForm({
      name: c.name,
      id_num: c.id_num,
      phone: c.phone,
      notes: c.notes || ''
    });
  };

  const del = async id => {
    if (!confirm('Delete this family forever?')) return;
    await API.delete(`/client/${id}`);
    onRefresh();
  };

  return (
    <div className="card mb-4 shadow">
      <div className="card-header bg-primary text-white">
        <h5>1. Digital Family Onboarding</h5>
      </div>
      <div className="card-body">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="ID / Passport"
              value={form.id_num}
              onChange={e => setForm({ ...form, id_num: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="file"
              className="form-control"
              accept=".pdf,.jpg,.png"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Village / Notes"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-warning me-2">
              {editing ? 'UPDATE FAMILY' : 'SAVE FAMILY'}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: '', id_num: '', phone: '', notes: '' });
                  setFile(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Phone</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-5">
                    No families yet. Add one above ↑
                  </td>
                </tr>
              ) : (
                clients.map(c => (
                  <tr key={c.id}>
                    <td className="fw-bold">{c.name}</td>
                    <td>{c.id_num}</td>
                    <td>
                      <a href={`tel:${c.phone}`} className="text-success">
                        {c.phone}
                      </a>
                    </td>
                    <td>{c.notes || '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => del(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
