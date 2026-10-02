# Medição e acompanhamento — GC Tech

Implementação publicada em 01/10/2026 às 22:16 (Brasília), após autorização. GA4: propriedade
552988303, tag G-071CJDZME7. Coleta somente em https://gctech.pro e após aceite de
estatísticas. Prévias e localhost não carregam GA4. QA negativa no domínio real
bloqueia Analytics antes da navegação; testes de entrega reais devem ser limitados
e documentados para não confundir QA com clientes.

## Eventos e continuidade

| Evento | Significado | Confirma lead? |
| --- | --- | --- |
| click_whatsapp | Clique para iniciar conversa | Não |
| phone_click | Clique para ligar | Não |
| service_page_view | Visita a página de serviço | Não |
| view_home | Visita à home | Não |
| generate_lead | Reservado para contato realmente confirmado | Não implementado |

click_whatsapp foi marcado como evento principal no GA4, contado uma vez por
sessão e sem valor monetário. Isso mede sessões com intenção, não clientes.
Dimensões service_name e link_location foram cadastradas com escopo Evento.
qualify_lead e close_convert_lead já existiam como eventos principais; não são
emitidos pelo site nem sincronizados automaticamente com o atendimento.

No registro privado de atendimento, contato qualificado exige conversa recebida,
demanda identificada, serviço/região atendidos e intenção real de orçamento.
Serviço fechado exige proposta aceita. Fechamento e pagamento têm datas e
valores próprios; valor contratado não é receita recebida. Uma linha por
oportunidade e datas preservadas evitam contagem duplicada das etapas.

Adotado click_whatsapp para manter o nome histórico de 06/09. O nome whatsapp_click
da versão anterior também representa intenção: considerar os dois ao consultar o
histórico, mas não emitir ambos no código novo. request_quote não é mais enviado
no clique. Não reescrever eventos antigos. service_page_view preserva a versão
atual; view_service é histórico e deve ser tratado com corte de versão.

Parâmetros novos: link_location (hero/navigation/contact/content/footer/floating),
service_name (serviço ou general). Não enviar mensagem, nome, telefone, e-mail,
endereço ou dados de ordem de serviço. page_location conserva somente UTMs do
catálogo controlado; campanhas gc_tech_AAAAMM ou perfil_empresa. Demais parâmetros,
identificadores de anúncio e fragmentos removidos. page_referrer conserva apenas
a origem externa, sem caminho, query ou fragmento.
Não incluir dados pessoais em UTMs. Isto não certifica toda a coleta do GA4.

## Fuso aplicado

America/Sao_Paulo salvo em 01/10/2026 no painel, após confirmação do responsável,
e confirmado pela Admin API da propriedade 552988303. O diagnóstico anterior usava
America/Rio_Branco. Segundo o aviso do Google, o novo fuso afeta dados futuros e
pode gerar lacuna/pico na transição; não reinterpretar o histórico como se já
estivesse em Brasília. Moeda da propriedade continua BRL. OAuth permanece somente
leitura: esta alteração foi feita no painel autenticado, sem alterar o app/Firebase.

## Pendências administrativas — OAuth atual somente leitura

- request_quote foi desmarcado como principal; o valor antigo de 1 USD não
  representava receita. Histórico não foi apagado nem reescrito.
- Dimensões event-scoped link_location e service_name cadastradas; não têm retroatividade.
- Consentimento publicado e verificado no site real: sem escolha/rejeição não
  há coleta. Cliques controlados receberam HTTP 204 do endpoint GA4. Isso verifica
  transporte, não garante processamento: Realtime/DebugView ainda não confirmaram
  os eventos de QA durante a checagem inicial. Continuar a validação de ingestão.
- Cadastro/alteração exige analytics.edit ou operação autorizada no painel. Não
  ampliar OAuth automaticamente nem usar o projeto Firebase do app.

## Acompanhamento enxuto após publicação

1. Registrar a data real do deploy (não a data deste documento).
2. Validar uma visita controlada e um clique com Tag Assistant; abrir WhatsApp
   não envia a mensagem. Excluir/documentar a QA na análise.
3. GA4: filtrar hostName exatamente gctech.pro; agrupar páginas por caminho,
   não por título. Consultar usuários, sessões, campanhas e intenção de contato.
4. Operação: registrar contatos efetivamente recebidos, orçamentos e vendas no
   modelo privado da fábrica, sem expor registros no GitHub Pages.
5. Comparar janelas completas iguais, inicialmente 14 dias versus 14 dias quando
   ambas existirem. Documentar fuso, campanhas e baixo volume; sem conclusão causal
   ou A/B com esta amostra. Search Console tem fuso/contagens diferentes do GA4.
6. Acompanhar indexação e impressões das três páginas locais. Não há promessa de
   prazo/posição. Consultar manualmente ou quando solicitado; sem automação criada.

## Cookies e consentimento — implementação publicada

Banner próprio, sem biblioteca de CMP. `consent.js` precede `analytics.js` nas
17 páginas. Sem escolha, escolha inválida/expirada ou rejeição, não há tag GA4,
dataLayer nem ping de Analytics: Consent Mode básico, não avançado. Ao aceitar
estatísticas, apenas analytics_storage é granted; ad_storage, ad_user_data e
ad_personalization continuam denied. Google Signals e personalização desativados.

A preferência fica no localStorage `gc-tech-consent-v1` por até 180 dias; cookies
GA são configurados para até 180 dias. O botão no rodapé permite mudar a escolha.
Revogar desabilita GA imediatamente, remove cookies conhecidos acessíveis e
recarrega a página sem a biblioteca quando a decisão foi salva. Outras abas
reagem à mudança. Se armazenamento falhar, a decisão vale nesta página, com aviso
explícito para apagar os dados do site ao revogar uma escolha antiga. Não
recarregar nessa falha: o consentimento antigo ainda salvo poderia reativar GA.
Não remove dados já enviados, cookies HttpOnly ou cookies de outros domínios.

Nenhum pixel Google Ads ou Meta foi ativado. A conta Ads 205-809-3564 é um ID de
conta, não uma tag `AW-...` nem rótulo de conversão. A API confirmou o ID de
acompanhamento 18011637420, mas não retornou ação/rótulo de conversão de website.
Consulta de campanhas via MCP não depende de pixel no site. Medição de publicidade
exige decisão separada de consentimento, configuração de conversões reais e
validação de atribuição. Não criar conversões externas no fluxo de leitura.
`gclid` ainda é removido da URL enviada ao GA4; não prometer atribuição Ads pronta.
Clique WhatsApp continua intenção, nunca contato confirmado, compra ou receita.

Não há certificação de conformidade jurídica; revisar a política para operação,
fornecedores e mercados atendidos. Após o deploy, validar com Tag Assistant e
registrar o corte de medição: visitas sem aceite deixam de aparecer no GA4.

Referências: [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
e [controle de coleta GA4](https://developers.google.com/tag-platform/security/guides/privacy).

Testes sem entrega externa: `node qa/check-growth.cjs` e os roteiros Playwright
`qa/browser-growth.js` / `qa/browser-consent.js` (produção simulada e Google bloqueado).
