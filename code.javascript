<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>XpenseTrack — Expense Calculator</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#f5f4f0;min-height:100vh;color:#1a1a18}
.header{background:#fff;border-bottom:1px solid #e0ddd4;padding:.85rem 1.5rem;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:10;flex-wrap:wrap}
.logo{font-family:'DM Serif Display',serif;font-size:22px;margin-right:auto}
.logo span{color:#1D9E75}
.badge{font-size:11px;background:#E1F5EE;color:#0F6E56;padding:3px 10px;border-radius:20px;font-weight:500}
.header-actions{display:flex;gap:8px;align-items:center}
.main{max-width:980px;margin:0 auto;padding:1.25rem 1rem}
.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:1.1rem}
.metric{background:#eceae2;border-radius:8px;padding:.9rem;text-align:center}
.metric-label{font-size:11px;color:#5f5e5a;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.metric-val{font-size:21px;font-weight:500}
.metric-val.green{color:#0F6E56}
.metric-val.red{color:#993C1D}
.card{background:#fff;border:1px solid #e0ddd4;border-radius:12px;padding:1.1rem 1.25rem;margin-bottom:1rem}
.card-title{font-size:11px;font-weight:500;color:#888780;margin-bottom:.85rem;text-transform:uppercase;letter-spacing:.06em}
.row5{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.1fr auto;gap:7px;align-items:center}
select,input[type=text],input[type=number],input[type=date]{font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 10px;background:#f5f4f0;border:1px solid #c8c6bc;border-radius:8px;color:#1a1a18;width:100%;outline:none}
.btn{font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 14px;border-radius:8px;cursor:pointer;font-weight:500;white-space:nowrap;border:none}
.btn-green{background:#1D9E75;color:#fff}
.btn-green:hover{background:#0F6E56}
.btn-outline{background:#fff;border:1px solid #c8c6bc;color:#5f5e5a}
.btn-outline:hover{background:#f5f4f0}
.btn-excel{background:#fff;border:1px solid #217346;color:#217346;font-size:12px;padding:7px 12px;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500}
.btn-excel:hover{background:#E1F5EE}
.btn-del{background:none;border:1px solid #d0cec4;border-radius:6px;padding:4px 9px;cursor:pointer;color:#888780;font-size:12px}
.btn-del:hover{background:#FAECE7;color:#993C1D;border-color:#D85A30}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.exp-item{display:grid;grid-template-columns:1fr 90px 90px auto;gap:8px;align-items:center;padding:9px 0;border-bottom:1px solid #eceae2}
.exp-item:last-child{border-bottom:none}
.tag{display:inline-block;font-size:11px;padding:2px 9px;border-radius:20px;font-weight:500}
.tag.Food{background:#FAEEDA;color:#633806}
.tag.Transport{background:#E6F1FB;color:#0C447C}
.tag.Bills{background:#FAECE7;color:#993C1D}
.tag.Shopping{background:#FBEAF0;color:#72243E}
.tag.Health{background:#EAF3DE;color:#27500A}
.tag.Other{background:#F1EFE8;color:#444441}
.exp-name{font-size:13px;color:#1a1a18;font-weight:500}
.exp-sub{font-size:11px;color:#888780}
.exp-amt{font-size:13px;font-weight:500;text-align:right}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:9px}
.bar-label{font-size:12px;color:#5f5e5a;width:72px;flex-shrink:0}
.bar-bg{flex:1;height:7px;background:#eceae2;border-radius:4px;overflow:hidden}
.bar-fill{height:100%;border-radius:4px;transition:width .4s}
.bar-val{font-size:12px;color:#1a1a18;min-width:62px;text-align:right}
.progress-bar{height:8px;background:#eceae2;border-radius:4px;overflow:hidden;margin-top:7px}
.progress-fill{height:100%;border-radius:4px;transition:width .4s,background .3s}
.filter-row{display:flex;gap:7px;align-items:center;margin-bottom:.85rem;flex-wrap:wrap}
.filter-row label{font-size:12px;color:#5f5e5a;white-space:nowrap}
.filter-row input,.filter-row select{max-width:128px}
.empty{text-align:center;color:#888780;font-size:13px;padding:1.5rem 0}
.legend{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}
.leg-item{display:flex;align-items:center;gap:5px;font-size:12px;color:#5f5e5a}
.leg-sq{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.month-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eceae2;font-size:13px}
.month-item:last-child{border-bottom:none}
.budget-row{display:flex;align-items:center;gap:10px;margin-bottom:.8rem}
.budget-row label{font-size:13px;color:#5f5e5a;white-space:nowrap}
.budget-row input{max-width:160px}
.toast{position:fixed;bottom:24px;right:24px;background:#1D9E75;color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .3s;z-index:100}
.toast.show{opacity:1}
.file-hint{font-size:12px;color:#888780;margin-top:6px}
</style>
</head>
<body>

<div class="header">
  <div class="logo">Coin<span>Clever</span></div>
  <div class="badge">Mini Project</div>
  <div class="header-actions">
    <label style="cursor:pointer">
      <span class="btn-excel">&#128194; Import Excel</span>
      <input type="file" id="import-file" accept=".xlsx,.xls" style="display:none" onchange="importExcel(this)">
    </label>
    <button class="btn-excel" onclick="exportExcel()">&#128229; Save to Excel</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<div class="main">

  <div style="background:#E1F5EE;border:1px solid #9FE1CB;border-radius:8px;padding:10px 14px;margin-bottom:1rem;font-size:13px;color:#085041;display:flex;gap:8px;align-items:center">
    <span>Data is stored in an Excel file (.xlsx). Click <strong>Save to Excel</strong> after adding expenses, and <strong>Import Excel</strong> to reload your saved data anytime.</span>
  </div>

  <div class="summary-grid">
    <div class="metric"><div class="metric-label">Budget</div><div class="metric-val" id="s-budget">&#8377;0</div></div>
    <div class="metric"><div class="metric-label">Spent</div><div class="metric-val red" id="s-spent">&#8377;0</div></div>
    <div class="metric"><div class="metric-label">Remaining</div><div class="metric-val green" id="s-left">&#8377;0</div></div>
    <div class="metric"><div class="metric-label">Entries</div><div class="metric-val" id="s-count">0</div></div>
  </div>

  <div class="card">
    <div class="card-title">Monthly budget</div>
    <div class="budget-row">
      <label>Set budget (&#8377;)</label>
      <input type="number" id="budget-input" placeholder="e.g. 20000" min="0" oninput="updateSummary()">
    </div>
    <div class="progress-bar"><div class="progress-fill" id="progress" style="width:0%;background:#1D9E75"></div></div>
    <div style="font-size:11px;color:#888780;margin-top:5px" id="prog-label">0% of budget used</div>
  </div>

  <div class="card">
    <div class="card-title">Add expense</div>
    <div class="row5">
      <input type="text" id="exp-name" placeholder="Description">
      <input type="number" id="exp-amt" placeholder="Amount (&#8377;)" min="0">
      <select id="exp-cat">
        <option>Food</option><option>Transport</option><option>Bills</option>
        <option>Shopping</option><option>Health</option><option>Other</option>
      </select>
      <input type="date" id="exp-date">
      <button class="btn btn-green" onclick="addExpense()">+ Add</button>
    </div>
    <div class="file-hint">After adding expenses, click "Save to Excel" in the top bar to persist your data.</div>
  </div>

  <div class="card">
    <div class="card-title">Expenses</div>
    <div class="filter-row">
      <label>From</label>
      <input type="date" id="f-from" onchange="render()">
      <label>To</label>
      <input type="date" id="f-to" onchange="render()">
      <label>Category</label>
      <select id="f-cat" onchange="render()">
        <option value="">All</option>
        <option>Food</option><option>Transport</option><option>Bills</option>
        <option>Shopping</option><option>Health</option><option>Other</option>
      </select>
      <button class="btn btn-outline" onclick="clearFilters()" style="padding:7px 11px;font-size:12px">Clear</button>
    </div>
    <div id="exp-list"><div class="empty">No expenses yet. Add one above or import your Excel file!</div></div>
  </div>

  <div class="two-col">
    <div class="card">
      <div class="card-title">Spending by category</div>
      <div class="legend" id="pie-legend"></div>
      <div style="position:relative;width:100%;height:200px">
        <canvas id="pieChart"></canvas>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Category bars</div>
      <div id="cat-bars"><div class="empty">No data yet.</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Monthly history</div>
    <div id="month-hist"><div class="empty">No data yet.</div></div>
    <div style="position:relative;width:100%;height:180px;margin-top:1rem">
      <canvas id="barChart"></canvas>
    </div>
  </div>

</div>

<script>
const CAT_COLORS={Food:'#BA7517',Transport:'#185FA5',Bills:'#993C1D',Shopping:'#993356',Health:'#3B6D11',Other:'#5F5E5A'};
let expenses=[];
let pieInst=null,barInst=null;

function today(){return new Date().toISOString().split('T')[0]}
document.getElementById('exp-date').value=today();

function fmt(n){return '\u20B9'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:2})}
function toast(msg){var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2800)}

function addExpense(){
  var name=document.getElementById('exp-name').value.trim();
  var amt=parseFloat(document.getElementById('exp-amt').value);
  var cat=document.getElementById('exp-cat').value;
  var date=document.getElementById('exp-date').value||today();
  if(!name||isNaN(amt)||amt<=0){alert('Please enter a valid description and amount.');return}
  expenses.push({id:Date.now(),name:name,amt:amt,cat:cat,date:date});
  document.getElementById('exp-name').value='';
  document.getElementById('exp-amt').value='';
  document.getElementById('exp-date').value=today();
  render();
  toast('Expense added! Remember to Save to Excel.');
}

function deleteExpense(id){
  if(!confirm('Delete this expense?'))return;
  expenses=expenses.filter(function(e){return e.id!==id});
  render();
  toast('Deleted. Save to Excel to update your file.');
}

function filtered(){
  var from=document.getElementById('f-from').value;
  var to=document.getElementById('f-to').value;
  var cat=document.getElementById('f-cat').value;
  return expenses.filter(function(e){
    if(from&&e.date<from)return false;
    if(to&&e.date>to)return false;
    if(cat&&e.cat!==cat)return false;
    return true;
  });
}

function clearFilters(){
  document.getElementById('f-from').value='';
  document.getElementById('f-to').value='';
  document.getElementById('f-cat').value='';
  render();
}

function render(){
  var list=document.getElementById('exp-list');
  var data=filtered().slice().sort(function(a,b){return b.date.localeCompare(a.date)});
  if(data.length===0){list.innerHTML='<div class="empty">No expenses match the filter.</div>';}
  else{list.innerHTML=data.map(function(e){return '<div class="exp-item"><div><div class="exp-name">'+e.name+'</div><div class="exp-sub">'+e.date+'</div></div><div><span class="tag '+e.cat+'">'+e.cat+'</span></div><div class="exp-amt">'+fmt(e.amt)+'</div><button class="btn-del" onclick="deleteExpense('+e.id+')">x</button></div>'}).join('');}
  renderPie();renderBars();renderMonthly();updateSummary();
}

function renderPie(){
  var totals={};
  expenses.forEach(function(e){totals[e.cat]=(totals[e.cat]||0)+e.amt});
  var labels=Object.keys(totals);
  var vals=labels.map(function(k){return totals[k]});
  var total=vals.reduce(function(a,b){return a+b},0);
  var colors=labels.map(function(l){return CAT_COLORS[l]});
  var legend=document.getElementById('pie-legend');
  if(total===0){legend.innerHTML='';if(pieInst){pieInst.destroy();pieInst=null}return}
  legend.innerHTML=labels.map(function(l,i){return '<span class="leg-item"><span class="leg-sq" style="background:'+colors[i]+'"></span>'+l+' '+Math.round(vals[i]/total*100)+'%</span>'}).join('');
  if(pieInst)pieInst.destroy();
  pieInst=new Chart(document.getElementById('pieChart'),{type:'pie',data:{labels:labels,datasets:[{data:vals,backgroundColor:colors,borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){return ' '+fmt(ctx.raw)}}}}}});
}

function renderBars(){
  var bars=document.getElementById('cat-bars');
  var totals={};
  expenses.forEach(function(e){totals[e.cat]=(totals[e.cat]||0)+e.amt});
  var total=Object.values(totals).reduce(function(a,b){return a+b},0);
  if(total===0){bars.innerHTML='<div class="empty">No data yet.</div>';return}
  bars.innerHTML=Object.entries(totals).sort(function(a,b){return b[1]-a[1]}).map(function(entry){var cat=entry[0];var amt=entry[1];return '<div class="bar-row"><div class="bar-label">'+cat+'</div><div class="bar-bg"><div class="bar-fill" style="width:'+Math.round(amt/total*100)+'%;background:'+CAT_COLORS[cat]+'"></div></div><div class="bar-val">'+fmt(amt)+'</div></div>'}).join('');
}

function renderMonthly(){
  var hist=document.getElementById('month-hist');
  var monthly={};
  expenses.forEach(function(e){var m=e.date.slice(0,7);monthly[m]=(monthly[m]||0)+e.amt});
  var months=Object.keys(monthly).sort().reverse();
  if(months.length===0){hist.innerHTML='<div class="empty">No data yet.</div>';if(barInst){barInst.destroy();barInst=null}return}
  hist.innerHTML=months.slice(0,6).map(function(m){return '<div class="month-item"><span>'+new Date(m+'-01').toLocaleString('en-IN',{month:'long',year:'numeric'})+'</span><span style="font-weight:500">'+fmt(monthly[m])+'</span></div>'}).join('');
  var sorted=Object.keys(monthly).sort();
  if(barInst)barInst.destroy();
  barInst=new Chart(document.getElementById('barChart'),{type:'bar',data:{labels:sorted.map(function(m){return new Date(m+'-01').toLocaleString('en-IN',{month:'short',year:'2-digit'})}),datasets:[{label:'Spent',data:sorted.map(function(m){return Math.round(monthly[m])}),backgroundColor:'#1D9E75',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{autoSkip:false}},y:{ticks:{callback:function(v){return '\u20B9'+v.toLocaleString('en-IN')}}}}}});
}

function updateSummary(){
  var budget=parseFloat(document.getElementById('budget-input').value)||0;
  var spent=expenses.reduce(function(a,e){return a+e.amt},0);
  var left=budget-spent;
  document.getElementById('s-budget').textContent=fmt(budget);
  document.getElementById('s-spent').textContent=fmt(spent);
  document.getElementById('s-left').textContent=fmt(left);
  document.getElementById('s-left').className='metric-val '+(left>=0?'green':'red');
  document.getElementById('s-count').textContent=expenses.length;
  var pct=budget>0?Math.min(100,Math.round(spent/budget*100)):0;
  var prog=document.getElementById('progress');
  prog.style.width=pct+'%';
  prog.style.background=pct>90?'#993C1D':pct>70?'#BA7517':'#1D9E75';
  document.getElementById('prog-label').textContent=pct+'% of budget used';
}

function exportExcel(){
  if(expenses.length===0){alert('No expenses to save yet.');return}
  var wb=XLSX.utils.book_new();

  var expRows=[['ID','Date','Description','Category','Amount (INR)']];
  expenses.forEach(function(e){expRows.push([e.id,e.date,e.name,e.cat,e.amt])});
  var ws1=XLSX.utils.aoa_to_sheet(expRows);
  ws1['!cols']=[{wch:14},{wch:13},{wch:30},{wch:13},{wch:15}];
  XLSX.utils.book_append_sheet(wb,ws1,'Expenses');

  var cats=['Food','Transport','Bills','Shopping','Health','Other'];
  var totals={};
  expenses.forEach(function(e){totals[e.cat]=(totals[e.cat]||0)+e.amt});
  var total=Object.values(totals).reduce(function(a,b){return a+b},0);
  var sumRows=[['Category','Total Spent (INR)','% of Total']];
  cats.forEach(function(c){var amt=totals[c]||0;sumRows.push([c,amt,total>0?+(amt/total*100).toFixed(1):0])});
  sumRows.push(['TOTAL',total,100]);
  var ws2=XLSX.utils.aoa_to_sheet(sumRows);
  ws2['!cols']=[{wch:16},{wch:18},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ws2,'Summary');

  var monthly={};
  expenses.forEach(function(e){var m=e.date.slice(0,7);monthly[m]=(monthly[m]||0)+e.amt});
  var mRows=[['Month','Total Spent (INR)']];
  Object.keys(monthly).sort().forEach(function(m){mRows.push([new Date(m+'-01').toLocaleString('en-IN',{month:'long',year:'numeric'}),monthly[m]])});
  var ws3=XLSX.utils.aoa_to_sheet(mRows);
  ws3['!cols']=[{wch:18},{wch:18}];
  XLSX.utils.book_append_sheet(wb,ws3,'Monthly History');

  var budget=parseFloat(document.getElementById('budget-input').value)||0;
  var spent=expenses.reduce(function(a,e){return a+e.amt},0);
  var budgetRows=[['Budget Summary',''],['Monthly Budget (INR)',budget],['Total Spent (INR)',spent],['Remaining (INR)',budget-spent],['% Used',budget>0?+((spent/budget)*100).toFixed(1):0]];
  var ws4=XLSX.utils.aoa_to_sheet(budgetRows);
  ws4['!cols']=[{wch:22},{wch:18}];
  XLSX.utils.book_append_sheet(wb,ws4,'Budget');

  XLSX.writeFile(wb,'XpenseTrack_Data.xlsx');
  toast('Saved as XpenseTrack_Data.xlsx!');
}

function importExcel(input){
  var file=input.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var wb=XLSX.read(e.target.result,{type:'binary'});
      if(wb.SheetNames.includes('Budget')){
        var bdata=XLSX.utils.sheet_to_json(wb.Sheets['Budget'],{header:1});
        bdata.forEach(function(row){if(row[0]==='Monthly Budget (INR)'&&row[1])document.getElementById('budget-input').value=row[1]});
      }
      var ws=wb.Sheets[wb.SheetNames[0]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1});
      if(rows.length<2){toast('No data found in file.');return}
      expenses=[];
      rows.slice(1).forEach(function(row,i){
        if(!row[2]||!row[4])return;
        expenses.push({id:row[0]||Date.now()+i,date:row[1]||today(),name:String(row[2]),cat:row[3]||'Other',amt:parseFloat(row[4])||0});
      });
      render();
      toast('Imported '+expenses.length+' expenses!');
    }catch(err){alert('Could not read the Excel file. Make sure it was saved by XpenseTrack.')}
  };
  reader.readAsBinaryString(file);
  input.value='';
}

render();
</script>
</body>
</html>
