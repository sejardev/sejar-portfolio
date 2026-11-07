import test from 'node:test';
import assert from 'node:assert/strict';
import {cents,validDate,validEntry,summary,csv} from './model.mjs';
test('money uses integer cents and rejects invalid amounts',()=>{assert.equal(cents('10.10'),1010);assert.equal(cents('0.29'),29);for(const input of ['0','-3','1.001','abc','1000000','Infinity'])assert.throws(()=>cents(input));});
test('dates reject rollover and allow leap day',()=>{assert.equal(validDate('2024-02-29'),true);assert.equal(validDate('2025-02-29'),false);assert.equal(validDate('2026-13-01'),false);});
const item={id:'a',description:'Lunch',amount:1099,category:'Food & drink',date:'2026-11-02'};
test('monthly summary isolates months and includes days without expenses',()=>{const s=summary([item,{...item,id:'b',amount:100,date:'2026-10-31'}],'2026-11');assert.equal(s.total,1099);assert.equal(s.average,37);assert.equal(s.selected.length,1);assert.equal(s.groups[0].name,'Food & drink');assert.equal(summary([],'2026-11').total,0);});
test('stored data must match the expense schema',()=>{assert.equal(validEntry(item),true);assert.equal(validEntry({...item,amount:1.2}),false);assert.equal(validEntry({...item,category:'Unknown'}),false);});
test('CSV escapes quotes, commas and spreadsheet formulas',()=>{const out=csv([{...item,description:'=SUM(1,2) "test"'}]);assert.ok(out.includes('"\'=SUM(1,2) ""test"""'));assert.ok(out.includes('"10.99"'));});
