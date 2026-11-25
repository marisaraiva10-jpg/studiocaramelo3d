// API de Conversões da Meta (Cloudflare Pages Function, responde em /capi).
//
// O navegador manda cada evento duas vezes: pelo Pixel (tags do GTM-MSKR4FB5) e para esta função,
// com o mesmo event_id. A Meta junta os dois e conta uma vez só.
// Aqui o evento sai do servidor, então chega mesmo quando o bloqueador de anúncios
// ou o iOS barram o Pixel.
//
// Variáveis de ambiente (Cloudflare > Workers e Pages > projeto > Configurações > Variáveis):
//   META_CAPI_TOKEN       (obrigatória, tipo "Secret") token gerado no Gerenciador de Eventos
//   META_PIXEL_ID         (opcional) padrão: Pixel do Studio Caramelo 3D
//   META_TEST_EVENT_CODE  (opcional) código da aba "Testar eventos"; apague depois de testar
//   META_API_VERSION      (opcional) padrão: v23.0
// Sem o token a função não manda nada e o site segue funcionando só com o Pixel.

const PIXEL_PADRAO = '2167835010789845';
const EVENTOS_PERMITIDOS = ['PageView', 'Lead'];

export async function onRequestPost({ request, env }) {
  const token = env.META_CAPI_TOKEN;
  if (!token) return new Response(null, { status: 204 });

  // Só aceita chamadas vindas do próprio site
  const origem = request.headers.get('Origin');
  const host = new URL(request.url).host;
  if (origem && new URL(origem).host !== host) return new Response(null, { status: 403 });

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const nome = corpo.event_name;
  if (!EVENTOS_PERMITIDOS.includes(nome) || typeof corpo.event_id !== 'string') {
    return new Response(null, { status: 400 });
  }

  const cookies = lerCookies(request.headers.get('Cookie'));
  const urlEvento = urlDoMesmoSite(corpo.event_source_url, host) || request.headers.get('Referer') || request.url;

  const user_data = {
    client_ip_address: request.headers.get('CF-Connecting-IP') || undefined,
    client_user_agent: request.headers.get('User-Agent') || undefined,
    fbp: cookies._fbp,
    fbc: cookies._fbc || fbcDoClique(urlEvento),
  };

  const evento = {
    event_name: nome,
    event_time: Math.floor(Date.now() / 1000),
    event_id: corpo.event_id.slice(0, 100),
    event_source_url: urlEvento,
    action_source: 'website',
    user_data,
  };
  if (corpo.custom_data && typeof corpo.custom_data === 'object') {
    evento.custom_data = {
      content_name: String(corpo.custom_data.content_name || '').slice(0, 200) || undefined,
      content_category: String(corpo.custom_data.content_category || '').slice(0, 100) || undefined,
    };
  }

  const payload = { data: [evento] };
  if (env.META_TEST_EVENT_CODE) payload.test_event_code = env.META_TEST_EVENT_CODE;

  const pixel = env.META_PIXEL_ID || PIXEL_PADRAO;
  const versao = env.META_API_VERSION || 'v23.0';
  const resp = await fetch(
    `https://graph.facebook.com/${versao}/${pixel}/events?access_token=${encodeURIComponent(token)}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
  );

  if (!resp.ok) {
    // Aparece em Cloudflare > projeto > Functions > Logs em tempo real
    console.log('CAPI erro', resp.status, await resp.text());
    return new Response(null, { status: 502 });
  }
  return new Response(null, { status: 204 });
}

function lerCookies(cabecalho) {
  const out = {};
  (cabecalho || '').split(';').forEach((par) => {
    const i = par.indexOf('=');
    if (i > 0) out[par.slice(0, i).trim()] = decodeURIComponent(par.slice(i + 1).trim());
  });
  return out;
}

// Aceita só URLs do próprio site como origem do evento
function urlDoMesmoSite(valor, host) {
  try {
    const u = new URL(valor);
    return u.host === host ? u.href : null;
  } catch {
    return null;
  }
}

// Se a pessoa veio de um anúncio (fbclid na URL) e o cookie _fbc ainda não existe
function fbcDoClique(url) {
  try {
    const fbclid = new URL(url).searchParams.get('fbclid');
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  } catch {
    return undefined;
  }
}
