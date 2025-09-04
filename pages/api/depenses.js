// pages/api/depenses.js
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SHEET = '💰Dépenses';
const COLUMNS = [
  '🧾 Libellé','💶 Montant TTC','📅 Date de paiement','📎 Facture','🏷️ Catégorie','📌 Type',
  '🗓️ Durée','📅 Échéance','⏳ Jours restants','🗓️ Estimation Annuel','🔗 URL Gestion',
  '🏁 Fin prévue','💸 Mensualité','📉 Cumulé à ce jour'
];

export default async function handler(req, res) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET];
    if (!sheet) return res.status(404).json({ error: `Feuille '${SHEET}' introuvable` });

    const rows = await sheet.getRows();
    const data = rows.map(r => {
      const obj = { _rowNumber: r._rowNumber };
      for (const col of COLUMNS) obj[col] = r[col] ?? '';
      return obj;
    });

    return res.status(200).json({ columns: COLUMNS, rows: data, count: data.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}