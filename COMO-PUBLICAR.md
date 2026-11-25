# Site Studio Caramelo 3D

## Estrutura
- `index.html`: todo o conteúdo do site (textos, seções)
- `assets/css/style.css`: cores, fontes e layout
- `assets/js/main.js`: número do WhatsApp e mensagens automáticas (linha `var WHATSAPP = ...`)
- `assets/img/`: imagens (troque mantendo o mesmo nome do arquivo, de preferência em .webp ou .jpg)

## Publicar no GitHub Pages (grátis)
1. Em github.com, clique em **New repository**, dê o nome `caramelo3d` e deixe **Public**.
2. Clique em **uploading an existing file** e arraste todos os arquivos e pastas deste projeto (index.html e a pasta assets).
3. Clique em **Commit changes**.
4. Vá em **Settings > Pages**, em *Branch* escolha `main` e `/ (root)`, e clique em **Save**.
5. Em 1 a 2 minutos o site fica no ar em `https://SEU-USUARIO.github.io/caramelo3d/`.

## Domínio próprio (opcional)
Em **Settings > Pages > Custom domain**, digite o domínio (ex.: `caramelo3d.com.br`) e siga as instruções de DNS que o GitHub mostra.

## Meta Pixel e API de Conversões (anúncios)
O Pixel (2167835010789845) é carregado pelo Google Tag Manager (GTM-MSKR4FB5), não direto no `index.html`.
- Todo clique no WhatsApp vira **Lead** (nunca `Contact`): o `assets/js/main.js` manda o evento `whatsapp_click` para o GTM, e a tag "Meta Pixel - Lead WhatsApp" dispara o Lead.
- O mesmo Lead (e o PageView) também vai pela **API de Conversões**, pelo servidor: `functions/capi.js`, que responde em `/capi`. O navegador e o servidor mandam o mesmo `event_id`, e a Meta conta uma vez só.
- O container do GTM para importar fica em `GTM/GTM-MSKR4FB5-caramelo3d-LEAD-capi.json` (Administrador > Importar contêiner > Mesclar > Substituir conflitantes).
- A API de Conversões só funciona na **Cloudflare Pages** (o GitHub Pages não roda a pasta `functions/`). Na Cloudflare: Workers e Pages > Criar > Pages > Conectar ao Git > repositório `studiocaramelo3d`, sem comando de build, pasta de saída `/`.
- Depois, em Configurações > Variáveis do projeto, adicione `META_CAPI_TOKEN` (tipo Secret) com o token gerado no Gerenciador de Eventos (Pixel > Configurações > API de Conversões). Sem o token, o site funciona só com o Pixel.
