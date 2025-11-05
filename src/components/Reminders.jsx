import { useLang } from './LangContext';
export default function Reminders({ cases }) {
  const { txt } = useLang();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
  const list = cases.filter(c => c.date === tomorrow);

  return (
    <div className="card mb-4">
      <div className="card-header"><h5>5. {txt('reminders')}</h5></div>
      <div className="card-body">
        {list.length ? list.map(c=>(
          <div key={c.id} className="alert alert-warning">
            Tomorrow: {c.client_name} – {c.service}
          </div>
        )) : <p className="text-muted">{txt('no_reminders')}</p>}
      </div>
    </div>
  );
}
