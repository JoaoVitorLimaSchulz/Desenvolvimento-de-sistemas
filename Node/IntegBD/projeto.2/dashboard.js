// js/dashboard.js
// Ajuste a URL da sua API aqui se necessário:
const API = "http://localhost:3001";

// util
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

// FORMATAÇÃO
function formatDate(dStr){
  if(!dStr) return '';
  // espera YYYY-MM-DD
  return dStr;
}
function formatTime(tStr){
  if(!tStr) return '';
  if(tStr.length === 8) return tStr.slice(0,5);
  return tStr;
}

// BUSCA CONTADORES
async function fetchCounts(){
  try {
    const [clientes, servicos, profissionais, agendamentos] = await Promise.all([
      fetch(API + "/clientes").then(r=>r.json()),
      fetch(API + "/servicos").then(r=>r.json()),
      fetch(API + "/profissionais").then(r=>r.json()),
      fetch(API + "/agendamentos").then(r=>r.json())
    ]);

    $("#count-clientes").textContent = clientes.length;
    $("#count-servicos").textContent = servicos.length;
    $("#count-profissionais").textContent = profissionais.length;
    $("#count-agendamentos").textContent = agendamentos.length;

    return { clientes, servicos, profissionais, agendamentos };
  } catch (err) {
    console.error("Erro ao buscar contadores:", err);
    // deixar traços em caso de falha
    $("#count-clientes").textContent = "-";
    $("#count-servicos").textContent = "-";
    $("#count-profissionais").textContent = "-";
    $("#count-agendamentos").textContent = "-";
    return null;
  }
}

// MONTAR LISTA DE ÚLTIMOS AGENDAMENTOS
function fillLatest(agendamentos){
  if(!agendamentos) return;
  // ordenar por criado_em ou por data/hora (backend retorna em ORDER BY se implementado)
  const sorted = agendamentos.slice().sort((a,b)=>{
    const da = new Date(`${a.data}T${a.hora_inicio || a.hora || '00:00:00'}`);
    const db = new Date(`${b.data}T${b.hora_inicio || b.hora || '00:00:00'}`);
    return db - da;
  }).slice(0,6);

  const tbody = document.getElementById("latest-list");
  tbody.innerHTML = sorted.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.cliente_nome || ''}</td>
      <td>${a.servico_nome || ''}</td>
      <td>${a.profissional_nome || ''}</td>
      <td>${formatDate(a.data)}</td>
      <td>${formatTime(a.hora_inicio || a.hora)}</td>
    </tr>
  `).join("");
}

// Montar dados do gráfico (agendamentos por dia da semana)
function buildWeekChart(agendamentos){
  if(!agendamentos) return;

  const labels = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const counts = [0,0,0,0,0,0,0];

  agendamentos.forEach(a => {
    if(!a.data) return;
    const d = new Date(a.data + "T00:00:00");
    const dow = d.getDay(); // 0..6
    counts[dow]++;
  });

  // criar chart (Chart.js já carregado via CDN)
  const ctx = document.getElementById('chartWeek').getContext('2d');
  // destruir chart anterior se existir (evita duplicação ao recarregar)
  if(window._chartWeek) window._chartWeek.destroy();

  window._chartWeek = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Agendamentos',
        data: counts,
        backgroundColor: 'rgba(13,110,253,0.8)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision:0 } }
      }
    }
  });
}

// função init
async function initDashboard(){
  const data = await fetchCounts();
  if(!data) return;
  buildWeekChart(data.agendamentos || []);
  fillLatest(data.agendamentos || []);
}

// start
initDashboard();

// atualizar periodicamente (opcional)
setInterval(initDashboard, 1000 * 30); // atualiza a cada 30s
