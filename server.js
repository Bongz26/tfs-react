const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${file.originalname}`)
});
const upload = multer({ storage });

const DB_FILE = path.join(__dirname, 'tfs_data.json');
function load() {
  if (!fs.existsSync(DB_FILE)) return { clients: [], cases: [], dispatch: [], memorials: [], nextIds: {}, stock: [], fleet: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const initialStock = require('./stock.json');
const initialFleet = require('./fleet.json');

app.get('/data', (req, res) => {
  const db = load();
  db.stock = db.stock.length ? db.stock : initialStock;
  db.fleet = db.fleet.length ? db.fleet : initialFleet;
  res.json(db);
});

app.post('/client', upload.single('id_doc'), (req, res) => {
  const db = load();
  const newClient = {
    id: (db.nextIds.client || 0) + 1,
    name: req.body.name,
    id_num: req.body.id_num,
    phone: req.body.phone,
    doc: req.file ? `/uploads/${req.file.filename}` : null
  };
  db.clients.push(newClient);
  db.nextIds.client = newClient.id;
  save(db);
  res.json(newClient);
});

app.put('/client/:id', (req, res) => {
  const db = load();
  const c = db.clients.find(c => c.id === +req.params.id);
  if (!c) return res.status(404).send();
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

app.post('/case', (req, res) => {
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
});

app.post('/dispatch/:caseId', (req, res) => {
  const db = load();
  const free = db.fleet.find(v => v.status === 'Free');
  if (!free) return res.status(400).json({ error: 'No free vehicle' });
  free.status = 'Busy';
  const disp = { id: (db.nextIds.dispatch || 0) + 1, case_id: +req.params.caseId, vehicle: free.reg };
  db.dispatch.push(disp);
  db.nextIds.dispatch = disp.id;
  save(db);
  res.json(disp);
});

app.post('/memorial', (req, res) => {
  const db = load();
  const m = { id: (db.nextIds.memorial || 0) + 1, name: req.body.name, dod: req.body.dod, message: req.body.message };
  db.memorials.push(m);
  db.nextIds.memorial = m.id;
  save(db);
  res.json(m);
});

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend on ${PORT}`));
