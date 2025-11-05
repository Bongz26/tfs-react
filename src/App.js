import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import Planner from './components/Planner';
import Inventory from './components/Inventory';
import Dispatch from './components/Dispatch';
import Reminders from './components/Reminders';
import Memorials from './components/Memorials';
import { LangProvider } from './components/LangContext';
import { exportExcel } from './utils/excelExport';

function App() {
  const [data, setData] = useState({});
  const [refresh, setRefresh] = useState(0);

  // FIXED: Use live URL, not localhost
  const API_URL = window.location.origin;

  useEffect(() => {
    axios.get(`${API_URL}/data`)
      .then(r => setData(r.data))
      .catch(err => {
        console.error('Failed to load data:', err);
        // Optional: Show user-friendly message
      });
  }, [refresh, API_URL]);

  const forceRefresh = () => setRefresh(v => v + 1);
  const handleExport = () => exportExcel(data.clients || []);

  return (
    <LangProvider>
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container mt-4">
          <button className="btn btn-warning mb-3" onClick={handleExport}>Export Clients</button>
          <Clients clients={data.clients || []} onRefresh={forceRefresh} />
          <Planner clients={data.clients || []} cases={data.cases || []} onRefresh={forceRefresh} />
          <Inventory stock={data.stock || []} />
          <Dispatch dispatch={data.dispatch || []} fleet={data.fleet || []} cases={data.cases || []} />
          <Reminders cases={data.cases || []} />
          <Memorials memorials={data.memorials || []} onRefresh={forceRefresh} />
        </div>
      </div>
    </LangProvider>
  );
}

export default App;
