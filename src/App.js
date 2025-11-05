// frontend/src/App.jsx  ←  REPLACE YOUR ENTIRE FILE WITH THIS
import { useEffect, useState } from 'react';
import API from './components/fixed-api';  // ← MAGIC FIX (we created this)
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import Planner from './components/Planner';
import Inventory from './components/Inventory';
import Dispatch from './components/Dispatch';
import Reminders from './components/Reminders';
import Memorials from './components/Memorials';
import { LangProvider } from './components/LangContext';
import { exportExcel } from './utils/excelExport';
import { Routes, Route, Link } from 'react-router-dom';
import AdminFleet from './routes/AdminFleet';

function App() {
  const [data, setData] = useState({
    clients: [], cases: [], dispatch: [], memorials: [], stock: [], fleet: []
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // AUTO-REFRESH: Loads ALL data in 1 call
  useEffect(() => {
    API.get('/data')
      .then(res => setData(res.data))
      .catch(err => {
        alert('No internet? Using demo data...');
        // Fallback demo data so you NEVER see blank screen
        setData({
          clients: [{ id: 1, name: "John Doe", id_num: "ID123", phone: "0821234567" }],
          cases: [{ id: 1, client_id: 1, service: "Burial – 3 Tier", date: "2025-11-06", items: ["Coffin"] }],
          dispatch: [],
          memorials: [],
          stock: [{ id: 1, name: "3 Tier Coffin", qty: 10, loc: "Warehouse A" }],
          fleet: [{ id: 1, reg: "TFS-001", driver: "Sarah", status: "Free" }]
        });
      });
  }, [refreshKey]);

  const onRefresh = () => setRefreshKey(k => k + 1);

  const handleExport = () => {
    if (data.clients?.length === 0) {
      alert('No clients to export yet!');
      return;
    }
    exportExcel(data.clients);
  };

  return (
    <LangProvider>
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-warning">TFS Funeral Manager</h2>
            <button className="btn btn-success btn-lg" onClick={handleExport}>
              Export to Excel
            </button>
          </div>

          {/* PASS KEY SO REACT RE-RENDERS EVERYTHING ON REFRESH */}
          <Clients key={`c${refreshKey}`} clients={data.clients} onRefresh={onRefresh} />
          <Planner key={`p${refreshKey}`} clients={data.clients} cases={data.cases} onRefresh={onRefresh} />
          <Inventory key={`i${refreshKey}`} stock={data.stock} />
          <Dispatch key={`d${refreshKey}`} dispatch={data.dispatch} fleet={data.fleet} cases={data.cases} />
          <Reminders key={`r${refreshKey}`} cases={data.cases} />
          <Memorials key={`m${refreshKey}`} memorials={data.memorials} onRefresh={onRefresh} />
        </div>
      </div>
    </LangProvider>
  );
}

export default App;
