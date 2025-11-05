import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function exportExcel(clients) {
  const data = clients.map(c => ({ Name: c.name, ID: c.id_num, Phone: c.phone }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clients');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'clients.xlsx');
}
