const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// === CREATE FOLDERS & FILES IF MISSING ===
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const DB_FILE = path.join(__dirname, 'tfs_data.json');
const STOCK_FILE = path.join(__dirname, 'stock.json');
const FLEET_FILE = path.join(__dirname, 'fleet.json');

// Initialize tfs_data.json
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ clients: [], cases: [], dispatch: [], memorials: [], nextIds: {}, stock: [], fleet: [] }, null, 2));
}

// Initialize stock.json
if (!fs.existsSync(STOCK_FILE)) {
  const defaultStock = [
    { id: 1, name: "3 Tier Coffin", cat: "Coffins", qty: 10, cost: 1500, loc: "Warehouse A" },
    { id: 2, name: "Econo Casket", cat: "Coffins", qty: 5, cost: 800, loc: "Warehouse A" },
    { id: 3, name: "Porcelain Urn", cat: "Urns", qty: 20, cost: 450, loc: "Warehouse B" },
    { id: 4, name: "Tent & 50 Chairs", cat: "Tents", qty: 8, cost: 2000, loc: "Depot" },
    { id: 5, name: "Grocery Pack", cat: "Catering", qty: 30, cost: 500, loc: "Kitchen" },
    { id: 6, name: "Flower Wreath", cat: "Flowers", qty: 15, cost: 300, loc: "Cold Room" }
  ];
  fs.writeFileSync(STOCK_FILE, JSON.stringify(defaultStock, null, 2));
}

// Initialize fleet.json
if (!fs.existsSync(FLEET_FILE)) {
  const defaultFleet = [
    { id: 1, reg: "TFS-001", driver: "John", status: "Free", gps: "-28.123,28.456" },
    { id: 2, reg: "TFS-002", driver: "Sarah", status: "Free", gps: "-28.124,28.457" }
  ];
  fs.writeFileSync(FLEET_FILE, JSON.stringify(defaultFleet, null, 2));
}

// === MULTER ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${file.originalname}`)
});
const upload = multer({ storage });

// === DATA HELPERS ===
function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('Failed to load DB:', err);
    return { clients: [], cases: [], dispatch: [], memorials: [], nextIds: {}, stock: [], fleet: [] };
  }
}
function save(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

// === LOAD INITIAL DATA SAFELY ===
let initialStock = [];
let initialFleet = [];
try {
  initialStock = JSON.parse(fs.readFileSync(STOCK_FILE, 'utf-8'));
} catch (err) {
  console.error('Failed to load stock.json:', err);
}
try {
  initialFleet = JSON.parse(fs.readFileSync(FLEET_FILE, 'utf-8'));
} catch (err) {
  console.error('Failed to load fleet.json:', err);
}

// === API ROUTES ===
app.get('/data', (req, res) => {
  const db = load();
  db.stock = db.stock.length ? db.stock : initialStock;
  db.fleet = db.fleet.length ? db.fleet : initialFleet;
  res.json(db);
});

app.post('/client', upload.single('id_doc'), (req, res) => {
  try {
    const db = load();
    const newClient = {
      id: (db.nextIds.client || 0) + 1,
      name: req.body.name || 'Unknown',
      id_num: req.body.id_num || 'N/A',
      phone: req.body.phone || 'N/A',
      notes: req.body.notes || '',
      doc: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.clients.push(newClient);
    db.nextIds.client = newClient.id;
    save(db);
    console.log('Client saved:', newClient);
    res.json(newClient);
  } catch (err) {
    console.error('Client save error:', err);
    res.status(500).json({ error: 'Failed to save client' });
  }
});

app.put('/client/:id', (req, res) => {
  try {
    const db = load();
    const c = db.clients.find(c => c.id === +req.params.id);
    if (!c) return res.status(404).send();
    c.name = req.body.name || c.name;
    c.id_num = req.body.id_num || c.id_num;
    c.phone = req.body.phone || c.phone;
    c.notes = req.body.notes !== undefined ? req.body.notes : c.notes;
    save(db);
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/client/:id', (req, res) => {
  try {
    const db = load();
    db.clients = db.clients.filter(c => c.id !== +req.params.id);
    save(db);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/case', (req, res) => {
  try {
    const db = load();
    const items = (req.body.items || '').split(',').map(i => i.trim()).filter(Boolean);
    const newCase = {
      id: (db.nextIds.case || 0) + 1,
      client_id: +req.body.client_id,
      service: req.body.service,
      date: req.body.date,
      items
    };
    db.cases.push(newCase);
    db.nextIds.case = newCase.id;
    save(db);
    res.json(newCase);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/dispatch/:caseId', (req, res) => {
  try {
    const db = load();
    const free = db.fleet.find(v => v.status === 'Free');
    if (!free) return res.status(400).json({ error: 'No free vehicle' });
    free.status = 'Busy';
    const disp = { id: (db.nextIds.dispatch || 0) + 1, case_id: +req.params.caseId, vehicle: free.reg };
    db.dispatch.push(disp);
    db.nextIds.dispatch = disp.id;
    save(db);
    res.json(disp);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/memorial', (req, res) => {
  try {
    const db = load();
    const m = { id: (db.nextIds.memorial || 0) + 1, name: req.body.name, dod: req.body.dod, message: req.body.message };
    db.memorials.push(m);
    db.nextIds.memorial = m.id;
    save(db);
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === SERVE UPLOADS & REACT APP ===
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// === START SERVER ===
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
