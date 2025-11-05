// frontend/src/routes/AdminFleet.jsx
import { useLang } from '../components/LangContext';

export default function AdminFleet({ fleet, onRefresh }) {
  const { txt } = useLang();

  const toggleStatus = async (reg) => {
    const vehicle = fleet.find(v => v.reg === reg);
    const newStatus = vehicle.status === 'Free' ? 'Busy' : 'Free';
    // Simple mock update – real API later
    alert(`${reg} → ${newStatus}`);
    onRefresh();
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-danger text-white">
        <h5> ADMIN – Fleet Control Room</h5>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr><th>Reg #</th><th>Driver</th><th>Status</th><th>Control</th></tr>
          </thead>
          <tbody>
            {fleet.map(v => (
              <tr key={v.reg} className={v.status === 'Busy' ? 'table-warning' : ''}>
                <td><strong>{v.reg}</strong></td>
                <td>{v.driver}</td>
                <td>
                  <span className={`badge ${v.status === 'Free' ? 'bg-success' : 'bg-danger'}`}>
                    {v.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleStatus(v.reg)}
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <small className="text-muted">
          Only visible at /admin – hide from clients
        </small>
      </div>
    </div>
  );
}
