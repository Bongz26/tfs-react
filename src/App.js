// frontend/src/App.jsx  ←  PASTE THIS ENTIRE FILE
import { useEffect, useState } from 'react';
import API from './components/fixed-api';
import Navbar from './components/Navbar';
import Clients from './components/Clients';
import Planner from './components/Planner';
import Inventory from './components/Inventory';
import Dispatch from './components/Dispatch';
import Reminders from './components/Reminders';
import Memorials from './components/Memorials';
import AdminDashboard from './routes/AdminDashboard';
import AdminFleet from './routes/AdminFleet';
import { LangProvider } from './components/LangContext';
import { exportExcel } from './utils/excelExport';
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  const [data, setData] = useState({});
  const [key, setKey] = useState(0);
  const refresh = () => setKey(k => k + 1);

  useEffect(() => {
    API.get('/data')
      .then(r => setData(r.data))
      .catch(() => setData({
        clients: [{id:1,name:"Sarah Khumalo",phone:"082 795 2233"}],
        cases: [{id:1,client_id:1,service:"3 Tier",date:"2025-11-05",items:["Coffin","Tent","30kg Maize"]}],
        dispatch: [{id:1,case_id:1,vehicle:"TFS-001"}],
        fleet: [
          {reg:"TFS-001",driver:"Thabo",status:"Busy"},
          {reg:"TFS-002",driver:"Lerato",status:"Free"},
          {reg:"TFS-003",driver:"Sipho",status:"Free"}
        ],
        stock: [{id:1,name:"3 Tier Coffin",qty:8,loc:"Makgalaneng"}],
        memorials: []
      }));
  }, [key]);

  return (
    <LangProvider>
      <div className="bg-gray min-vh-100">
        <Navbar />
        <div className="container py-4">

          {/* RED ADMIN BUTTON – THUSANANG STYLE */}
          <div className="text-end mb-4">
            <Link to="/admin" className="btn text-white fw-bold px-4" 
                  style={{background:'#8B1A1A', boxShadow:'0 4px 12px rgba(139,26,26,0.4)'}}>
              ADMIN CONTROL ROOM
            </Link>
          </div>

          <Routes>

            {/* PUBLIC APP */}
            <Route path="/" element={
              <>
                <Clients clients={data.clients||[]} onRefresh={refresh} key={key} />
                <Planner clients={data.clients||[]} cases={data.cases||[]} onRefresh={refresh} key={key} />
                <Inventory stock={data.stock||[]} key={key} />
                <Dispatch dispatch={data.dispatch||[]} fleet={data.fleet||[]} cases={data.cases||[]} key={key} />
                <Memorials memorials={data.memorials||[]} onRefresh={refresh} key={key} />
              </>
            } />

            {/* ADMIN DASHBOARD + FLEET */}
            <Route path="/admin" element={
              <div>
                <AdminDashboard data={data} onRefresh={refresh} />
                <div className="my-5">
                  <AdminFleet fleet={data.fleet||[]} onRefresh={refresh} />
                </div>
                <div className="text-center">
                  <button onClick={() => exportExcel(data.clients||[])} 
                          className="btn btn-warning btn-lg fw-bold">
                    EXPORT TODAY'S REPORT
                  </button>
                </div>
                <Link to="/" className="btn btn-outline-primary d-block mt-4">← Back</Link>
              </div>
            } />

          </Routes>

        </div>
      </div>
    </LangProvider>
  );
}
