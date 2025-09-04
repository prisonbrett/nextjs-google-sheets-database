// pages/api/depenses-update.js
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SHEET = '💰Dépenses';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { rowNumber, updates } = req.body || {};
    if (!rowNumber || !updates || typeof updates !== 'object')
      return res.status(400).json({ error: 'rowNumber et updates requis' });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET];
    if (!sheet) return res.status(404).json({ error: `Feuille '${SHEET}' introuvable` });

    const rows = await sheet.getRows();
    const row = rows.find(r => r._rowNumber === Number(rowNumber));
    if (!row) return res.status(404).json({ error: 'Ligne introuvable' });

    Object.entries(updates).forEach(([key, val]) => {
      row[key] = val;
    });
    await row.save();

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}