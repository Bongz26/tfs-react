import { useEffect, useState } from 'react';
import API from '../components/fixed-api';

export default function AdminDashboard({ data, onRefresh }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const today = now.toISOString().split('T')[0];
  const todayCases = data.cases?.filter(c => c.date === today) || [];
  const busy = data.fleet?.filter(v => v.status === 'Busy').length || 0;
  const totalFleet = data.fleet?.length || 1;
  const cash = todayCases.reduce((s, c) => s + (c.service.includes('3 Tier') ? 28000 : 12500), 0);
  const packs = todayCases.filter(c => c.items?.includes('Pack')).length;

  const nextVigil = todayCases[0];
  const mins = nextVigil ? Math.round((new Date(nextVigil.date + 'T18:00') - now) / 60000) : 0;

  return (
    <div className="row g-3">
      <div className="col-12">
        <h2 className="text-primary text-center">
          THUSANANG PHUTHADITJHABA CONTROL ROOM
        </h2>
        <p className="text-center text-dignity fw-bold">
          Respectful • Professional • Dignified
        </p>
      </div>

      <div className="col-md-4">
        <div className="card text-white bg-primary shadow">
          <div className="card-body text-center">
            <h1 className="display-4">{todayCases.length}</h1>
            <p className="fs-5">Today’s Services</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-white" style={{background: '#8B1A1A'}}>
          <div className="card-body text-center">
            <h1 className="display-4">{busy}/{totalFleet}</h1>
            <p className="fs-5">Hearses on Road</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-dark bg-warning shadow">
          <div className="card-body text-center">
            <h1 className="display-4">R {(cash).toLocaleString()}</h1>
            <p className="fs-5">Cash Collected</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-success">
          <div className="card-body text-center">
            <h1 className="display-5">{packs}</h1>
            <p>Grocery Packs</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-gold">
          <div className="card-body text-center">
            <h1 className="display-5">98%</h1>
            <p>Dignity Score</p>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-primary">
          <div className="card-body text-center">
            <h1 className="display-5 text-primary">
              {mins > 0 ? `${Math.floor(mins/60)}h ${mins%60}m` : 'NOW'}
            </h1>
            <p>Next Night Vigil</p>
          </div>
        </div>
      </div>
    </div>
  );
}
