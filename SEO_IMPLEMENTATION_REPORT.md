# SEO Implementation Report — GC Tech

Data do registro original: 06/09/2026
Escopo original: **Fase 0 → Fase 1 → Fase 2**.

## Atualização do candidato a publicação — 16/09/2026

Além das fases originais, o candidato atual inclui:

- três páginas locais: `/rio-branco-do-sul/`, `/itaperucu/` e `/colombo/`, com conteúdo específico, links internos, FAQ visível e `FAQPage` coerente com o conteúdo;
- página `/sobre/` com a experiência e a formação reais de Gustavo Canonica, responsável técnico da GC Tech, usando `Person` e `AboutPage` sem expor endereço residencial;
- páginas de avaliações, política de privacidade e termos, sem inventar nota, depoimento ou link direto do Google Business Profile;
- `Organization`, `WebSite` e `LocalBusiness` consolidados na Home, com os dados reais disponíveis: GC Tech, CNPJ informado, telefone, Instagram, cidades atendidas e horários;
- logo original em WebP, favicon, dimensões e carregamento das imagens, além da correção dos ícones externos do marquee;
- FAQ estruturado também nas páginas profundas de suporte empresarial e criação de sites;
- `robots.txt`, `sitemap.xml`, chave pública do IndexNow, canonicals, Open Graph, Twitter Cards e metadados revisados para a publicação.

Não houve commit, push ou publicação durante esta revisão. O site ainda aguarda a conferência visual e comercial do responsável antes do deploy.

## Fase 0 — Baseline

Concluída.

- Auditoria das três URLs existentes registrada em [`docs/SEO_AUDIT_BASELINE.md`](docs/SEO_AUDIT_BASELINE.md).
- Mapa inicial de intenções criado em [`docs/SEO_KEYWORD_MAP.md`](docs/SEO_KEYWORD_MAP.md), sem inventar volume ou dificuldade.
- Mapa editorial criado em [`docs/SEO_CONTENT_MAP.md`](docs/SEO_CONTENT_MAP.md).
- Ferramentas e fluxo operacional documentados em [`docs/SEO_TOOLING.md`](docs/SEO_TOOLING.md).
- Checklist externo do Google Business Profile criado em [`docs/GOOGLE_BUSINESS_PROFILE_SEO.md`](docs/GOOGLE_BUSINESS_PROFILE_SEO.md).

## Fase 1 — SEO técnico

Concluída.

- `robots.txt` criado com sitemap canônico.
- `sitemap.xml` criado contendo somente URLs públicas, canônicas e indexáveis.
- `404.html` criado com `noindex`, navegação para a home e serviços principais.
- Canonicals existentes preservados; a normalização observada do GitHub Pages mantém HTTPS, domínio sem `www` e barra final nas páginas de diretório.
- Twitter Cards adicionados às páginas existentes.
- OG image passou a declarar dimensões.
- Breadcrumbs visíveis não são usados: a navegação principal já apresenta as áreas do site. Os dados estruturados de `BreadcrumbList` permanecem quando úteis para mecanismos de busca.
- Configuração pública de negócio centralizada em [`assets/seo-config.json`](assets/seo-config.json) para orientar futuras gerações de metadata/schema.
- JSON-LD das novas páginas usa `Organization`, `LocalBusiness`, `Service` e `BreadcrumbList`, com dados reais disponíveis no projeto.
- A Home permanece como a landing page principal de assistência técnica.

## Fase 2 — Páginas principais

Concluída.

Páginas criadas sem alterar as URLs existentes:

- `/empresas/suporte-ti/`
- `/sites/criacao-de-sites/`
- `/sites/sites-sob-medida/`

A Home (`/`) concentra a landing de assistência técnica. A antiga URL `/assistencia-tecnica/` foi mantida apenas como alias com redirecionamento para a Home, usando `noindex,follow`, para evitar duas páginas com a mesma intenção e conteúdo. As demais páginas de serviço possuem title, meta description, canonical, Open Graph, Twitter Card, um H1, headings hierárquicos, JSON-LD e CTA para WhatsApp. O conteúdo foi escrito para as intenções definidas, sem avaliações, números, cases ou credenciais inventados.

## Validação executada

- `git diff --check`: passou.
- Revisão do perfil social antigo: nenhuma ocorrência nas páginas publicadas.
- As três páginas existentes responderam 200 no domínio público durante o baseline.
- Redirects observados: HTTP → HTTPS; `/empresas` → `/empresas/`; `/sites` → `/sites/`.
- Lighthouse foi executado na Home local do candidato: performance 85/100, FCP 2,0 s, LCP 4,1 s, CLS 0 e TBT 50 ms. O LCP ainda deve ser conferido no domínio publicado, porque o laboratório local usa emulação e não substitui os dados reais de campo.
- JSON-LD, FAQ visível versus schema, imagens, metadados, links internos, órfãos, sitemap e assets foram validados sem erros no candidato atual.
- Unlighthouse, SiteOne e Search Console ainda não foram executados neste ambiente. Eles ficam para a validação pós-publicação, com o domínio e as credenciais reais.

## Pendências reais antes ou depois do deploy

- O nome do responsável técnico, fotos próprias, certificados e cases dependem do responsável e não foram inventados.
- Não há faixa de preço porque a GC Tech informou que trabalha por diagnóstico e orçamento; publicar valores só deve ocorrer quando houver valores reais.
- Headers de segurança não podem ser adicionados pelo GitHub Pages puro; exigem proxy Cloudflare ou outra hospedagem.
- A política de privacidade e os termos foram atualizados com os dados comerciais confirmados pelo responsável; recomenda-se revisão comercial/jurídica final antes de tratá-los como documentos definitivos.
- A página de avaliações está pronta, mas o link direto e os depoimentos reais dependem do Google Business Profile.
- Depois da aprovação, ainda será necessário publicar, enviar o sitemap no Search Console, solicitar indexação das páginas prioritárias e executar a auditoria no domínio final.

## O que não foi feito de propósito

- Nenhuma expansão adicional por cidade além das três áreas prioritárias aprovadas.
- Nenhum blog, case ou portfolio.
- Nenhuma expansão nacional por nicho.
- Nenhuma alteração de framework ou identidade visual.
- Nenhuma compra ou automação de backlinks.

## Próximo passo recomendado

Configurar a propriedade do domínio no Google Search Console, enviar o sitemap e aguardar dados reais de consultas por algumas semanas. Só então priorizar novas páginas, conteúdos e eventuais hubs locais com base em impressões, cliques, CTR e leads.

## Acompanhamento posterior às Fases 0–2

Após a indexação inicial, o Google Analytics 4 foi preparado com o fluxo Web `G-071CJDZME7`. O tag está presente nas páginas públicas e registra apenas eventos sem dados pessoais: `click_whatsapp`, `click_phone`, `request_quote` e `view_service`. A vinculação GA4 ↔ Search Console ainda deve ser confirmada no painel após os primeiros dados.
