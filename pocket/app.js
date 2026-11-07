import {cents, validDate, validEntry, summary, csv} from './model.mjs';
const $ = id => document.getElementById(id);
const key = 'sejar-pocket-v1';
const now = new Date();
const today = [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
const money = value => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(value/100);
let entries = [];
let storageBlocked = false;
try {
  const saved = localStorage.getItem(key);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(validEntry) || new Set(parsed.map(e=>e.id)).size !== parsed.length) throw new Error('Invalid data');
    entries = parsed;
  }
} catch {
  storageBlocked = true;
  $('message').textContent = 'Saved data could not be read. Changes will stay in memory for this session; existing storage will not be overwritten.';
}
$('month').value = today.slice(0,7);
$('date').value = today;
function save(message) {
  if (!storageBlocked) {
    try { localStorage.setItem(key,JSON.stringify(entries)); }
    catch { storageBlocked = true; }
  }
  $('message').textContent = message + (storageBlocked ? ' Browser storage is unavailable. Export your data before leaving.' : ' Saved in this browser.');
  render();
}
function element(tag,text,className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function render() {
  const month = $('month').value;
  if (!/^\d{4}-\d{2}$/.test(month)) return;
  const {selected,total,groups,average} = summary(entries,month);
  $('total').textContent = money(total);
  $('average').textContent = money(average);
  $('count').textContent = selected.length + (selected.length === 1 ? ' expense' : ' expenses') + ' this month';
  $('top').textContent = groups[0]?.name ?? '—';
  $('top-amount').textContent = groups.length ? money(groups[0].amount) + ' this month' : 'Add an expense to get started';
  $('breakdown').replaceChildren();
  if (!groups.length) $('breakdown').append(element('p','Your spending breakdown will appear here.','empty'));
  for (const group of groups) {
    const row = element('div',undefined,'category');
    const head = element('div',undefined,'category-head');
    head.append(element('span',group.name),element('strong',money(group.amount)));
    const track = element('div',undefined,'track');
    const bar = element('div',undefined,'bar');
    bar.style.width = (group.amount/total*100)+'%';
    track.setAttribute('aria-hidden','true');
    track.append(bar); row.append(head,track); $('breakdown').append(row);
  }
  const search = $('search').value.trim().toLowerCase();
  const visible = selected.filter(e=>(e.description+' '+e.category).toLowerCase().includes(search)).sort((a,b)=>b.date.localeCompare(a.date));
  $('list').replaceChildren();
  if (!visible.length) $('list').append(element('p',search ? 'No matching expenses. Try another search.' : 'A fresh start. Add your first expense, or try the sample data.','empty'));
  for (const item of visible) {
    const row = element('div',undefined,'row');
    const info = element('div');
    info.append(element('strong',item.description),element('small',item.category+' · '+item.date));
    const remove = element('button','Delete','delete');
    remove.setAttribute('aria-label','Delete '+item.description);
    remove.onclick = () => {
      if (!confirm('Delete “'+item.description+'”?')) return;
      entries = entries.filter(e=>e.id!==item.id); save('Expense deleted.');
    };
    row.append(info,element('strong',money(item.amount)),remove); $('list').append(row);
  }
  $('export').disabled = !selected.length;
  $('sample').disabled = entries.some(e=>e.id.startsWith('sample-'+month));
}
$('expense-form').onsubmit = event => {
  event.preventDefault();
  try {
    const description = $('description').value.trim();
    if (!description) throw new Error('Enter a description.');
    if (!validDate($('date').value)) throw new Error('Choose a valid date from year 1900 onward.');
    const item = {id:crypto.randomUUID(),description,amount:cents($('amount').value),category:$('category').value,date:$('date').value};
    entries.push(item); $('month').value = item.date.slice(0,7);
    $('description').value = ''; $('amount').value = ''; save('Expense added.'); $('description').focus();
  } catch (error) { $('message').textContent = error.message; }
};
$('month').onchange = render; $('search').oninput = render;
$('sample').onclick = () => {
  const month = $('month').value;
  if (!/^\d{4}-\d{2}$/.test(month) || entries.some(e=>e.id.startsWith('sample-'+month))) return;
  [['Weekly groceries',4280,'Groceries','02'],['Coffee & pastry',650,'Food & drink','03'],['Bus pass',2500,'Transport','04'],['Internet',2990,'Bills','05'],['Lunch with friends',1840,'Food & drink','06']].forEach(([description,amount,category,day],i)=>entries.push({id:'sample-'+month+'-'+i,description:'Sample: '+description,amount,category,date:month+'-'+day}));
  save('Sample expenses added. Each is labeled Sample and can be deleted.');
};
$('export').onclick = () => {
  const {selected} = summary(entries,$('month').value);
  const url = URL.createObjectURL(new Blob(['\uFEFF'+csv(selected)],{type:'text/csv;charset=utf-8'}));
  const link = element('a'); link.href = url; link.download = 'pocket-'+$('month').value+'.csv'; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('message').textContent = 'Exported all expenses for the selected month.';
};
window.addEventListener('storage', event => {
  if (event.key !== key) return;
  try {const data = event.newValue ? JSON.parse(event.newValue) : []; if (Array.isArray(data) && data.every(validEntry)) {entries=data;render();}}
  catch { $('message').textContent='Another tab changed saved data. Reload before adding more expenses.'; }
});
render();
