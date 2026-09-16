# Checklist SEO pós-publicação

Use este checklist depois de publicar as alterações no GitHub Pages.

## Domínio e HTTPS

- Confirmar que `https://gctech.pro/` abre sem alerta.
- Confirmar que `https://www.gctech.pro/` também abre sem erro de certificado.
- No GitHub Pages, salvar novamente o domínio personalizado se o certificado não for reemitido; só depois ativar “Enforce HTTPS”.
- No DNS, manter o apex `@` com os quatro registros A do GitHub Pages e configurar `www` como CNAME para `gcanonica.github.io` (não para `gctech.pro`).
- Manter os registros DNS da hospedagem como DNS only enquanto o certificado for emitido.

## Indexação

- Abrir `https://gctech.pro/robots.txt` e `https://gctech.pro/sitemap.xml`.
- Enviar o sitemap no Google Search Console.
- Solicitar inspeção da home, das três páginas por cidade e das páginas legais.
- Conferir no Search Console se `/assistencia-tecnica/` permanece fora do sitemap por ser um alias de redirecionamento.

## IndexNow

O arquivo público da chave já está em `https://gctech.pro/gctech-2026-seo-indexnow.txt`. Depois do deploy, a submissão pode ser feita pelo endpoint oficial:

```text
https://api.indexnow.org/indexnow?url=https%3A%2F%2Fgctech.pro%2F&key=gctech-2026-seo-indexnow&keyLocation=https%3A%2F%2Fgctech.pro%2Fgctech-2026-seo-indexnow.txt
```

Se preferir enviar várias URLs, use um POST JSON para o mesmo endpoint com `host`, `key`, `keyLocation` e `urlList`, incluindo apenas URLs publicadas.

## Verificação final

- Validar os JSON-LD no Rich Results Test e no Schema Markup Validator.
- Testar menu móvel, botões de WhatsApp, telefone e links de cidade.
- Conferir títulos, canonical, favicon e imagens em cada rota.
- Rodar uma nova auditoria técnica após o domínio e as novas páginas estarem no ar.
