# GC Tech — Site de Captação

Landing page da **GC Tech Assistência Técnica** (Rio Branco do Sul, Itaperuçu e Colombo — PR).

Site estático (HTML/CSS puro), pensado para hospedagem gratuita no GitHub Pages e otimizado para busca local no Google (schema.org LocalBusiness + FAQPage).

## Estrutura

```
index.html        # página única com todas as seções
css/style.css     # identidade visual (fundo escuro, azul, prata)
assets/           # favicon e imagens (colocar o logo original aqui)
```

## Publicar no GitHub Pages

1. Criar repositório no GitHub e dar push
2. Settings → Pages → Deploy from branch → `main` / raiz
3. Atualizar a URL no `<link rel="canonical">` e no JSON-LD do `index.html`
4. Colocar o link no Google Business Profile, bio do Instagram e WhatsApp Business

## Ecossistema GC Tech

- **GCTech** (`C:\Users\GC\Documents\GC-Eletronica\GCTech`) — sistema interno de OS/agenda/financeiro
- **gc-eletronica-ops** — automação de WhatsApp
- Fase 2: botão "Agendar" nesta página apontando para o GCTech em produção
