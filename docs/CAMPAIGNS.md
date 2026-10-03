# Links de divulgação — GC Tech

Use os links de campaigns.csv na bio/post/status ou ação correspondente. Eles
estão preparados, mas nenhum perfil, anúncio ou mensagem foi alterado/enviado.

- utm_source: plataforma, em minúsculas (instagram/facebook/whatsapp).
- utm_medium: social para redes; referral para indicação/WhatsApp.
- utm_campaign: ação identificável (gc_tech_202610), não nome de pessoa.
- utm_content: posição/criativo (bio/post/status/indicacao).
- Google Business Profile: google / organic / perfil_empresa.
- Link de material impresso: material_impresso / offline / gc_tech_202610.

Não adicionar UTMs aos links internos do site: isso confundiria a origem externa.
Cada serviço pode divulgar sua própria URL; revisar ação/mês antes de reutilizar.
O script aceita somente as origens/mídias/posições deste catálogo e campanhas
gc_tech_AAAAMM ou perfil_empresa. Para uma nova origem/posição, atualizar o catálogo
em analytics.js e os testes antes de divulgar; UTMs não reconhecidas são removidas
de page_location. Para Google Ads, a codificação automática já está ativa: gclid,
gbraid ou wbraid válidos são preservados na page_location enviada ao GA4 somente
depois do aceite de Estatísticas. Os sinais de armazenamento e dados de publicidade
permanecem negados; essa medição não habilita personalização nem otimização de lances.
Não inserir nome, telefone ou e-mail. As UTMs são públicas e sensíveis a maiúsculas.
GA4 usa esses parâmetros para aquisição; não precisa de um gerador de links novo.

Fontes: https://support.google.com/analytics/answer/10917952?hl=pt-BR
