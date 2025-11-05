import { useLang } from './LangContext';
export default function Inventory({ stock }) {
  const { txt } = useLang();
  return (
    <div className="card mb-4">
      <div className="card-header"><h5>3. Inventory</h5></div>
      <div className="card-body">
        <table className="table">
          <thead className="table-dark"><tr><th>Item</th><th>Qty</th><th>Location</th></tr></thead>
          <tbody>
            {stock.map(s=> (
              <tr key={s.id} className={s.qty<5?'table-danger':''}>
                <td>{s.name}</td><td>{s.qty}</td><td>{s.loc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
