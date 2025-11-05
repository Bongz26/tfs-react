// backend/server.js  ←  REPLACE YOUR ENTIRE FILE WITH THIS
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ==================== RENDER FIXES ====================
// 1. CORS: Allow your live frontend (mobile + desktop)
app.use(cors({ origin: "*", credentials: true }));

// 2. Body parser (already good)
app.use(express.json({ limit: '10mb' }));

// 3. Render kills disk after 24h → move uploads to /tmp
const UPLOAD_DIR = '/tmp/uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// 4. Multer → save to /tmp
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// 5. JSON DB → also /tmp (Render wipes everything else)
const DB_FILE = '/tmp/tfs_data.json';

// Auto-create DB if missing
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    clients: [], cases: [], dispatch: [], memorials: [],
    nextIds: { client: 1, case: 1, dispatch: 1, memorial: 1 },
    stock: [
      { id: 1, name: "3 Tier Coffin", qty: 10, loc: "Warehouse A" },
      { id: 2, name: "Econo Casket", qty: 5, loc: "Warehouse A" },
      { id: 3, name: "Porcelain Urn", qty: 20, loc: "Warehouse B" },
      { id: 4, name: "Tent & 50 Chairs", qty: 8, loc: "Depot" },
      { id: 5, name: "Grocery Pack", qty: 30, loc: "Kitchen" },
      { id: 6, name: "Flower Wreath", qty: 15, loc: "Cold Room" }
    ],
    fleet: [
      { id: 1, reg: "TFS-001", driver: "John", status: "Free" },
      { id: 2, reg: "TFS-002", driver: "Sarah", status: "Free" }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// ==================== DB HELPERS ====================
function load() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('DB load error:', err);
    return { clients: [], cases: [], dispatch: [], memorials: [], nextIds: { client: 1, case: 1, dispatch: 1, memorial: 1 }, stock: [], fleet: [] };
  }
}

function save(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('DB save error:', err);
  }
}

// ==================== API ROUTES ====================
// Get everything
app.get('/data', (req, res) => res.json(load()));

// Clients
app.post('/client', upload.single('id_doc'), (req, res) => {
  try {
    const db = load();
    const newClient = {
      id: db.nextIds.client++,
      name: req.body.name || 'Unknown',
      id_num: req.body.id_num || 'N/A',
      phone: req.body.phone || 'N/A',
      notes: req.body.notes || '',
      doc: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.clients.push(newClient);
    save(db);
    res.json(newClient);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/client/:id', (req, res) => {
  const db = load();
  const c = db.clients.find(c => c.id === +req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  Object.assign(c, req.body);
  save(db);
  res.json(c);
});

app.delete('/client/:id', (req, res) => {
  const db = load();
  db.clients = db.clients.filter(c => c.id !== +req.params.id);
  save(db);
  res.sendStatus(200);
});

// Cases
app.post('/case', (req, res) => {
  try {
    const db = load();
    const items = (req.body.items || '').split(',').map(i => i.trim()).filter(Boolean);
    const newCase = {
      id: db.nextIds.case++,
      client_id: +req.body.client_id,
      service: req.body.service,
      date: req.body.date,
      items
    };
    db.cases.push(newCase);
    save(db);
    res.json(newCase);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Dispatch
app.post('/dispatch/:caseId', (req, res) => {
  const db = load();
  const free = db.fleet.find(v => v.status === 'Free');
  if (!free) return res.status(400).json({ error: 'No free vehicle' });
  free.status = 'Busy';
  const disp = { id: db.nextIds.dispatch++, case_id: +req.params.caseId, vehicle: free.reg };
  db.dispatch.push(disp);
  save(db);
  res.json(disp);
});

// Memorials
app.post('/memorial', (req, res) => {
  const db = load();
  const m = {
    id: db.nextIds.memorial++,
    name: req.body.name,
    dod: req.body.dod,
    message: req.body.message
  };
  db.memorials.push(m);
  save(db);
  res.json(m);
});

// ==================== STATIC FILES ====================
// Serve uploaded files from /tmp
app.use('/uploads', express.static(UPLOAD_DIR));

// Serve React build (Render puts it in /app/build)
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 10000;  // Render requires this
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TFS-React LIVE at https://tfs-react.onrender.com`);
  console.log(`📂 Uploads → ${UPLOAD_DIR}`);
  console.log(`💾 DB      → ${DB_FILE}`);
});
