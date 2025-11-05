// frontend/src/routes/AdminFleet.jsx  ←  FINAL HOLLYWOOD FLEET
export default function AdminFleet({ fleet }) {
  return (
    <div className="p-5 rounded-4" style={{background:'linear-gradient(135deg, #0B2C5D 0%, #001233 100%)'}}>
      
      <h2 className="text-center text-gold mb-5 fw-bold display-5">
        ⚡ THUSANANG LIVE FLEET ⚡
      </h2>

      <div className="row g-5">
        {fleet.map(v => (
          <div key={v.reg} className="col-md-4">
            <div className="card bg-glass border-0 shadow-xl h-100 text-white overflow-hidden">
              
              {/* PULSING GPS DOT */}
              <div className="position-absolute top-0 end-0 p-3">
                <span className={`dot ${v.status==='Busy'?'busy':'ready'}`}></span>
              </div>

              <div className="card-body text-center pt-5">
                {/* VEHICLE */}
                <h1 className="display-4 fw-bold text-gold mb-2">
                  {v.reg}
                </h1>

                {/* DRIVER — HUGE GOLD */}
                <h3 className="fs-2 fw-bold text-white mb-4">
                  👤 {v.driver}
                </h3>

                {/* STATUS — GREEN OR RED */}
                <div className={`badge fs-3 px-5 py-3 ${
                  v.status==='Busy' ? 'bg-danger' : 'bg-success'
                }`}>
                  {v.status==='Busy' ? 'ON DUTY' : 'READY FOR DUTY'}
                </div>

                {/* ACTION BUTTON */}
                <button className="btn btn-outline-gold btn-lg mt-4 w-100 fw-bold">
                  {v.status==='Busy' ? 'RETURN TO BASE' : 'DISPATCH NOW'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIGNITY SCORE */}
      <div className="text-center mt-5">
        <span className="badge bg-gold fs-2 px-5 py-3">
          ⭐ DIGNITY SCORE: 98% ⭐
        </span>
      </div>
    </div>
  );
}
