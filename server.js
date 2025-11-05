const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Create uploads folder
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${file.originalname}`)
});
const upload = multer({ storage });

// Data file
const DB_FILE = path.join(__dirname, 'tfs_data.json');

// Auto-create initial data if missing
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    clients: [],
    cases: [],
    dispatch: [],
    memorials: [],
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

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    return { clients: [], cases: [], dispatch: [], memorials: [], nextIds: { client: 1, case: 1, dispatch: 1, memorial: 1 }, stock: [], fleet: [] };
  }
}
function save(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Save error:', err);
  }
}

app.get('/data', (req, res) => {
  const db = load();
  res.json(db);
});

app.post('/client', upload.single('id_doc'), (req, res) => {
  try {
    const db = load();
    const newClient = {
      id: (db.nextIds.client || 1),
      name: req.body.name || 'Unknown',
      id_num: req.body.id_num || 'N/A',
      phone: req.body.phone || 'N/A',
      notes: req.body.notes || '',
      doc: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.clients.push(newClient);
    db.nextIds.client = newClient.id + 1;
    save(db);
    res.json(newClient);
  } catch (err) {
    console.error('Client error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.put('/client/:id', (req, res) => {
  try {
    const db = load();
    const c = db.clients.find(c => c.id === parseInt(req.params.id));
    if (!c) return res.status(404).send();
    c.name = req.body.name || c.name;
    c.id_num = req.body.id_num || c.id_num;
    c.phone = req.body.phone || c.phone;
    c.notes = req.body.notes !== undefined ? req.body.notes : c.notes;
    save(db);
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/client/:id', (req, res) => {
  try {
    const db = load();
    db.clients = db.clients.filter(c => c.id !== parseInt(req.params.id));
    save(db);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.post('/case', (req, res) => {
  try {
    const db = load();
    const items = (req.body.items || '').split(',').map(i => i.trim()).filter(Boolean);
    const newCase = {
      id: (db.nextIds.case || 1),
      client_id: parseInt(req.body.client_id),
      service: req.body.service,
      date: req.body.date,
      items
    };
    db.cases.push(newCase);
    db.nextIds.case = newCase.id + 1;
    save(db);
    res.json(newCase);
  } catch (err) {
    res.status(500).json({ error: 'Case failed' });
  }
});

app.post('/dispatch/:caseId', (req, res) => {
  try {
    const db = load();
    const free = db.fleet.find(v => v.status === 'Free');
    if (!free) return res.status(400).json({ error: 'No free vehicle' });
    free.status = 'Busy';
    const disp = { id: (db.nextIds.dispatch || 1), case_id: parseInt(req.params.caseId), vehicle: free.reg };
    db.dispatch.push(disp);
    db.nextIds.dispatch = disp.id + 1;
    save(db);
    res.json(disp);
  } catch (err) {
    res.status(500).json({ error: 'Dispatch failed' });
  }
});

app.post('/memorial', (req, res) => {
  try {
    const db = load();
    const m = { id: (db.nextIds.memorial || 1), name: req.body.name, dod: req.body.dod, message: req.body.message };
    db.memorials.push(m);
    db.nextIds.memorial = m.id + 1;
    save(db);
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: 'Memorial failed' });
  }
});

// Serve uploads and React build
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Production port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
