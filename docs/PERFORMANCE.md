# Desempenho — alterações locais em 01/10/2026

- Favicon: reutilizado assets/favicon.svg (4.625 bytes), em vez de PNG (141.378).
  Sem alteração ou remoção dos arquivos originais de marca.
- Inter variável: Google Fonts fornece o subconjunto Latin (48.256 bytes) usado
  pelo português, em vez do arquivo completo (352.240 bytes). Mantida Inter com
  pesos 100–900; glifos fora do subconjunto usam as fontes de fallback do CSS.
  Fonte hospedada localmente, sem chamada Google Fonts durante navegação.
- Retirado preload da fonte completa na home; font-display: optional mantido.
- CSS/JS com versão 2026100101 para evitar uso do código antigo após deploy.
- Corrigido nome acessível da faixa de equipamentos, sem aria-label inválido.

Origem da Inter Latin: https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=optional
Arquivo: https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2
Licença SIL OFL em assets/fonts/Inter-OFL.txt; original InterVariable.woff2 preservado.

Medições Lighthouse locais e limitações constam no relatório da fábrica. Um teste
de laboratório não é Core Web Vitals de campo; INP requer dados reais. PSI público
retornou rate limit nas duas estratégias. Verificar novamente após publicação.
