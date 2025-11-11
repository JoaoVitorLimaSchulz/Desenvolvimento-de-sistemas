const API_BASE = 'http://localhost:3000/api';
let page = 1;
const limit = 10;

const $posts = document.getElementById('postsList');
const $search = document.getElementById('search');
const $userFilter = document.getElementById('userFilter');
const $loadBtn = document.getElementById('loadBtn');
const $prev = document.getElementById('prev');
const $next = document.getElementById('next');
const $pageInfo = document.getElementById('pageInfo');
const $stats = document.getElementById('stats');

async function fetchAndRender() {
  const q = $search.value.trim();
  const userId = $userFilter.value;
  const url = new URL(`${API_BASE}/posts`);
  url.searchParams.set('_page', page);
  url.searchParams.set('_limit', limit);
  if (q) url.searchParams.set('q', q);
  if (userId) url.searchParams.set('userId', userId);

  const res = await fetch(url.toString());
  const json = await res.json();

  $posts.innerHTML = '';
  if (!json.data || json.data.length === 0) {
    $posts.innerHTML = '<p>Nenhum post encontrado.</p>';
  } else {
    json.data.forEach(p => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.body)}</p>
        <small>userId: ${p.userId} — id: ${p.id}</small>
      `;
      $posts.appendChild(div);
    });
  }

  $pageInfo.textContent = `Página ${json.page} — ${json.total} resultados`;
  updateStats(); // Atualiza estatísticas simples
}

async function populateUserFilter() {
  // Buscar estatísticas de posts por usuário
  const res = await fetch(`${API_BASE}/stats/posts-by-user`);
  const counts = await res.json();
  const keys = Object.keys(counts).sort((a, b) => a - b);
  keys.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = `Usuário ${k} (${counts[k]})`;
    $userFilter.appendChild(opt);
  });
}

async function updateStats() {
  const res = await fetch(`${API_BASE}/stats/posts-by-user`);
  const counts = await res.json();
  $stats.textContent =
    'Posts por usuário — ' +
    Object.entries(counts)
      .map(([u, c]) => `U${u}:${c}`)
      .join(', ');
}

$loadBtn.addEventListener('click', () => {
  page = 1;
  fetchAndRender();
});

$prev.addEventListener('click', () => {
  if (page > 1) {
    page--;
    fetchAndRender();
  }
});

$next.addEventListener('click', () => {
  page++;
  fetchAndRender();
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
async function criarPost(titulo, conteudo) {
    const resp = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titulo,
        body: conteudo,
        userId: 1 // pode ser fixo ou dinâmico
      })
    });
  
    const post = await resp.json();
    console.log('Post criado:', post);
    alert(`Post criado com sucesso!\n\nTítulo: ${post.title}`);
  }
  function enviarPost() {
    const titulo = document.getElementById('tituloPost').value;
    const conteudo = document.getElementById('conteudoPost').value;
  
    if (!titulo || !conteudo) {
      alert('Preencha o título e o conteúdo antes de publicar.');
      return;
    }
  
    criarPost(titulo, conteudo);
  }
// Inicializa filtros e carrega dados
populateUserFilter().then(() => fetchAndRender());
