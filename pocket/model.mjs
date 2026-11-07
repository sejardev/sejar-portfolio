export const categories = ['Food & drink', 'Groceries', 'Transport', 'Shopping', 'Bills', 'Other'];
export function cents(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value))) throw new Error('Enter an amount with at most two decimal places.');
  const result = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(result) || result < 1 || result > 99999999) throw new Error('Enter an amount between €0.01 and €999,999.99.');
  return result;
}
export function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number(value.slice(0,4)) >= 1900 && Number(value.slice(0,4)) <= 9999 && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
export function validEntry(e) {
  return e && typeof e.id === 'string' && typeof e.description === 'string' && e.description.trim().length > 0 && e.description.length <= 80 && Number.isSafeInteger(e.amount) && e.amount > 0 && e.amount <= 99999999 && categories.includes(e.category) && typeof e.date === 'string' && validDate(e.date);
}
export function summary(entries, month) {
  const selected = entries.filter(e => e.date.slice(0,7) === month);
  const total = selected.reduce((sum,e) => sum + e.amount,0);
  const groups = categories.map(name => ({name,amount:selected.filter(e=>e.category===name).reduce((sum,e)=>sum+e.amount,0)})).filter(e=>e.amount).sort((a,b)=>b.amount-a.amount);
  const [year,m] = month.split('-').map(Number);
  return {selected,total,groups,average:Math.round(total/new Date(year,m,0).getDate())};
}
export function csv(entries) {
  const cell = value => '"' + String(value).replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""') + '"';
  return ['Date,Description,Category,Amount (EUR)',...entries.map(e=>[e.date,e.description,e.category,(e.amount/100).toFixed(2)].map(cell).join(','))].join('\r\n');
}
