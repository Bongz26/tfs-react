app.post('/client', upload.single('id_doc'), (req, res) => {
  try {
    const db = load();
    const newClient = {
      id: (db.nextIds.client || 0) + 1,
      name: req.body.name || 'Unknown',
      id_num: req.body.id_num || 'N/A',
      phone: req.body.phone || 'N/A',
      doc: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.clients.push(newClient);
    db.nextIds.client = newClient.id;
    save(db);
    console.log('Client saved:', newClient); // DEBUG LOG
    res.json(newClient);
  } catch (err) {
    console.error('Client save error:', err);
    res.status(500).json({ error: 'Failed to save client' });
  }
});
