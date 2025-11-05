export default function AdminFleet({ fleet, onRefresh }) {
  return (
    <div className="card">
      <div className="card-header bg-primary text-white text-center">
        <h4>THUSANANG FLEET CONTROL</h4>
        <p className="mb-0">Respectful • Professional • Dignified</p>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Dignity Score</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map(v => (
              <tr key={v.reg}>
                <td><b>{v.reg}</b></td>
                <td>{v.driver}</td>
                <td>
                  <span className={`badge ${v.status==='Free' ? 'badge-free' : 'badge-busy'}`}>
                    {v.status}
                  </span>
                </td>
                <td><span className="badge bg-gold">98%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
