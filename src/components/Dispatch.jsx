import { useLang } from './LangContext';
import { Link } from 'react-router-dom';

export default function Dispatch({ dispatch, fleet, cases }) {
  const { txt } = useLang();
  const caseMap = cases.reduce((m,c)=>(m[c.id]=c,m), {});
  const vehMap = fleet.reduce((m,v)=>(m[v.reg]=v,m), {});

  return (
    <div className="card mb-4">
      <div className="card-header"><h5>4. {txt('dispatch')}</h5></div>
      <div className="card-body">
        {dispatch.length ? dispatch.map(d=> {
          const v = vehMap[d.vehicle];
          return (
            <div key={d.id} className="alert alert-info">
              Case {d.case_id} → {d.vehicle}
              <Link to={`/track/${d.case_id}`} className="btn btn-sm btn-outline-primary ms-2">
                {txt('track')}
              </Link>
            </div>
          );
        }) : <p className="text-muted">{txt('no_dispatch')}</p>}
      </div>
    </div>
  );
}
