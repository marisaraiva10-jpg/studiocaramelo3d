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

## Meta Pixel (anúncios)
Os botões de WhatsApp já disparam o evento `Contact` automaticamente. Basta colar o código do Pixel da Meta dentro do `<head>` do `index.html`.
