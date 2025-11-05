// frontend/src/routes/AdminFleet.jsx  ←  MODERN 2025 FLEET VIEW
export default function AdminFleet({ fleet }) {
  return (
    <div className="p-4 rounded-3" style={{background:'linear-gradient(135deg, #0B2C5D, #001233)'}}>
      <h3 className="text-gold text-center mb-4 fw-bold">
        ⚡ LIVE HEARSE CONTROL ⚡
      </h3>
      <div className="row g-4">
        {fleet.map(v => (
          <div key={v.reg} className="col-md-4">
            <div className="card bg-glass border-0 shadow-lg h-100 text-white">
              <div className="card-body text-center position-relative">
                {/* LIVE GPS DOT */}
                <div className="position-absolute top-0 end-0 p-3">
                  <span className={`dot ${v.status==='Busy'?'busy':''}`}></span>
                </div>

                <h1 className="display-5 fw-bold text-gold">{v.reg}</h1>
                <p className="fs-4">{v.driver}</p>

                <div className="mt-3">
                  <span className={`badge fs-5 px-4 py-2 ${
                    v.status==='Busy' ? 'bg-danger' : 'bg-success'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <button className="btn btn-outline-gold btn-sm mt-3 w-100">
                  {v.status==='Busy' ? 'Return to Base' : 'Ready'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
