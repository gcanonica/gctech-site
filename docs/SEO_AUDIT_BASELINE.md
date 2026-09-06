# SEO Audit Baseline — GC Tech

Data da coleta: 06/09/2026  
Domínio auditado: `https://gctech.pro`

## Stack e arquitetura atual

- Site estático em HTML/CSS/JavaScript, publicado no GitHub Pages.
- Domínio canônico configurado no `CNAME` como `gctech.pro`.
- Páginas públicas encontradas no repositório antes da Fase 2: `/`, `/empresas/` e `/sites/`.
- Não havia `robots.txt`, `sitemap.xml` ou `404.html` publicados no momento da coleta.
- Assets principais incluem logo/favicon com dimensões declaradas no HTML.

## URLs existentes

| URL | HTTP observado | Indexável | Canonical | Title | H1 | H2 | H3 | OG | Schema | Imagens sem alt | Palavras aprox. | Links internos | Links externos |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | ---: |
| `/` | 200 | Sim, sem `noindex` | `https://gctech.pro/` | GC Tech — Assistência Técnica e CFTV em Rio Branco do Sul, Itaperuçu e Colombo | 1 | 5 | 7 | Parcial, sem Twitter | LocalBusiness + FAQPage | 0 | 460 | 6 | 14 |
| `/empresas/` | 200 | Sim, sem `noindex` | `https://gctech.pro/empresas/` | GC Tech — Suporte de TI para Empresas em Rio Branco do Sul, Itaperuçu e Colombo | 1 | 7 | 20 | Parcial, sem Twitter | Service + FAQPage | 0 | 860 | 8 | 18 |
| `/sites/` | 200 | Sim, sem `noindex` | `https://gctech.pro/sites/` | GC Tech — Criação de Sites para Pequenos Negócios em Rio Branco do Sul, Itaperuçu e Colombo | 1 | 5 | 7 | Parcial, sem Twitter | Service + FAQPage | 0 | 564 | 7 | 14 |

Contagens são aproximadas e consideram o texto renderizável do HTML, excluindo scripts e estilos. Links externos incluem WhatsApp, Google Fonts e redes sociais.

## Verificações técnicas

- `https://gctech.pro/`, `https://gctech.pro/empresas/` e `https://gctech.pro/sites/` responderam 200.
- `http://gctech.pro/` respondeu 301 para `https://gctech.pro/`.
- `/empresas` e `/sites` responderam 301 para as versões com barra final.
- `https://www.gctech.pro/` não apresentou conexão TLS válida durante a coleta; a versão canônica escolhida é o domínio sem `www`.
- `/robots.txt`, `/sitemap.xml` e `/404.html` ainda respondiam 404 na coleta inicial; foram implementados na Fase 1.
- Não foram encontrados `noindex` nas três páginas comerciais existentes.
- Core Web Vitals reais e Lighthouse ainda não foram medidos neste baseline; precisam de uma execução em ambiente público e em dispositivo móvel.

## Riscos e oportunidades

1. A arquitetura inicial concentrava várias intenções na home; a Fase 2 cria páginas comerciais específicas sem alterar URLs existentes.
2. O schema anterior era válido em intenção, mas não estava centralizado e não tinha BreadcrumbList nas páginas existentes.
3. O site já tinha conteúdo comercial e FAQ úteis; a estratégia preserva esse conteúdo e adiciona caminhos internos.
4. Não criar páginas por cidade nesta etapa. Primeiro coletar impressões, cliques e consultas no Search Console.
