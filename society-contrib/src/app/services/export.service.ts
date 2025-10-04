import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportService {
  downloadCsv(filename: string, rows: (string | number | boolean | null | undefined)[][]) {
    const csv = rows.map((r) => r.map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
