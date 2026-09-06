# SEO Tooling — GC Tech

## Ferramentas essenciais

### Google Search Console

Fonte principal para indexação, consultas, impressões, cliques, CTR, posição média e Core Web Vitals de usuários reais.

1. Verificar a propriedade de domínio `gctech.pro`.
2. Enviar `https://gctech.pro/sitemap.xml`.
3. Inspecionar `/`, `/empresas/`, `/sites/` e as novas páginas da Fase 2.
4. Exportar consultas e páginas para preencher `SEO_KEYWORD_MAP.md`.

### Google Business Profile

Manter categoria, serviços, telefone, site, áreas atendidas, horários, fotos e avaliações reais atualizados. O perfil é o principal ativo para busca local e Google Maps.

### PageSpeed Insights / Lighthouse

Usar PageSpeed Insights para dados de campo quando disponíveis e Lighthouse para diagnóstico reproduzível de uma URL. Medir primeiro mobile e registrar antes/depois; a pontuação não substitui conversão e qualidade do conteúdo.

### Rich Results Test

Validar JSON-LD de LocalBusiness, Organization, Service e BreadcrumbList após publicar. O teste indica elegibilidade para resultados enriquecidos, não garante posição.

## Ferramentas de auditoria

- **SiteOne Crawler**: execução manual para links quebrados, redirects, metadata, headings, imagens e canonicals. Exportar o relatório antes de correções grandes.
- **Unlighthouse**: auditoria em lote das URLs públicas. A instalação é opcional e deve ficar fora do frontend publicado.
- **OpenSEO**: camada de pesquisa e monitoramento. Deve consumir Search Console/DataForSEO e orientar o Keyword Map; não deve ser embutido no site nem receber credenciais no repositório.

## Credenciais e segurança

Nenhuma credencial deve ser colocada em HTML, JavaScript público, `robots.txt` ou sitemap. Tokens de Search Console, DataForSEO, OpenSEO ou Analytics devem ficar em ambiente seguro.

## Comandos sugeridos quando as ferramentas forem instaladas

```bash
npx lighthouse https://gctech.pro/ --form-factor=mobile --output=html --output-path=./reports/lighthouse-home.html
npx unlighthouse --site https://gctech.pro
```

O projeto é HTML estático e não adiciona essas ferramentas ao bundle público. A execução deve ser manual/reprodutível até existir uma pipeline SEO CI.
