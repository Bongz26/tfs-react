// frontend/src/App.jsx  ←  REPLACE EVERYTHING WITH THIS
import { useEffect, useState } from 'react';
import API from './components/fixed-api';
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import Planner from './components/Planner';
import Inventory from './components/Inventory';
import Dispatch from './components/Dispatch';
import Reminders from './components/Reminders';
import Memorials from './components/Memorials';
import AdminFleet from './routes/AdminFleet';
import { LangProvider } from './components/LangContext';
import { exportExcel } from './utils/excelExport';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const [data, setData] = useState({
    clients: [], cases: [], dispatch: [], memorials: [], stock: [], fleet: []
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
  if (window.location.search.includes('crash')) {
    throw new Error('Demo crash');
  }
}, []);

  useEffect(() => {
    API.get('/data')
      .then(res => setData(res.data || {}))
      .catch(() => {
        alert('Offline? Loading demo mode...');
        setData({
          clients: [{ id: 1, name: "Mary Jones", id_num: "770101", phone: "0834567890" }],
          cases: [{ id: 1, client_id: 1, service: "Cremation", date: "2025-11-07", items: ["Urn", "Flowers"] }],
          dispatch: [{ id: 1, case_id: 1, vehicle: "TFS-001" }],
          memorials: [{ id: 1, name: "Mary Jones", dod: "2025-11-05", message: "Forever in our hearts" }],
          stock: [{ id: 1, name: "Porcelain Urn", qty: 18, loc: "Warehouse B" }],
          fleet: [
            { id: 1, reg: "TFS-001", driver: "John", status: "Busy" },
            { id: 2, reg: "TFS-002", driver: "Sarah", status: "Free" }
          ]
        });
      });
  }, [refreshKey]);

  const onRefresh = () => setRefreshKey(k => k + 1);

  const handleExport = () => {
    if (!data.clients?.length) return alert('Add a client first!');
    exportExcel(data.clients);
  };

  return (
    <LangProvider>
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container py-4">

          {/* SECRET ADMIN BUTTON – CLICK TO REVEAL FLEET CONTROL */}
          
<div className="text-end mb-3">
  <Link to="/admin" className="btn" style={{background:'#8B1A1A', color:'white'}}>
    ADMIN CONTROL
  </Link>
</div>
          <Routes>

            {/* === PUBLIC APP === */}
            <Route path="/" element={
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="text-warning fw-bold">TFS Funeral Manager</h1>
                  <button className="btn btn-success btn-lg" onClick={handleExport}>
                    Export Excel
                  </button>
                </div>

                <Clients key={`c${refreshKey}`} clients={data.clients || []} onRefresh={onRefresh} />
                <Planner key={`p${refreshKey}`} clients={data.clients || []} cases={data.cases || []} onRefresh={onRefresh} />
                <Inventory key={`i${refreshKey}`} stock={data.stock || []} />
                <Dispatch key={`d${refreshKey}`} dispatch={data.dispatch || []} fleet={data.fleet || []} cases={data.cases || []} />
                <Reminders key={`r${refreshKey}`} cases={data.cases || []} />
                <Memorials key={`m${refreshKey}`} memorials={data.memorials || []} onRefresh={onRefresh} />
              </>
            } />

            {/* === ADMIN FLEET VIEW === */}
            <Route path="/admin" element={
              <div className="row">
                <div className="col-12">
                  <h1 className="text-danger mb-4"> FLEET COMMAND CENTER</h1>
                  <AdminFleet fleet={data.fleet || []} onRefresh={onRefresh} />
                  <Link to="/" className="btn btn-outline-dark mt-3">Back to App</Link>
                </div>
              </div>
            } />

          </Routes>

        </div>
      </div>
    </LangProvider>
  );
}

export default App;
