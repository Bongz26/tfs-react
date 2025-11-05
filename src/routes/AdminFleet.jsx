// frontend/src/routes/AdminFleet.jsx  ←  FINAL 2025 FLEET VIEW
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

                {/* VEHICLE + DRIVER – BIG & GOLD */}
                <h1 className="display-5 fw-bold text-gold">{v.reg}</h1>
                <h2 className="fs-3 text-white mb-3">{v.driver}</h2>

                {/* STATUS BADGE */}
                <div className="mt-3">
                  <span className={`badge fs-4 px-4 py-2 ${
                    v.status==='Busy' ? 'bg-danger' : 'bg-success'
                  }`}>
                    {v.status}
                  </span>
                </div>

                {/* RETURN BUTTON */}
                <button className="btn btn-outline-gold btn-lg mt-4 w-100 fw-bold">
                  {v.status==='Busy' ? 'RETURN TO BASE' : 'READY FOR DUTY'}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIGNITY SCORE FOOTER */}
      <div className="text-center mt-5">
        <span className="badge bg-gold fs-3 px-5 py-3">
          DIGNITY SCORE: 98%
        </span>
      </div>
    </div>
  );
}
