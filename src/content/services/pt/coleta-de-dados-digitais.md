---
title: 'Coleta de Dados Digitais'
description: 'Web scraping ético, consumo de APIs e estruturação de bases em grande escala para redes sociais e portais públicos, com respeito à LGPD.'
translationKey: 'digital-data'
tier: 'research-data'
order: 3
icon: 'lucide:database'
summary: 'Extração automatizada, estruturação e enriquecimento de dados da web e redes sociais com rigor metodológico e conformidade legal.'
audiences:
  - 'academia'
  - 'business'
  - 'public-sector'
  - 'ngos'
tools:
  - 'Python'
  - 'Scrapy'
  - 'BeautifulSoup'
  - 'Playwright'
  - 'APIs REST'
  - 'PostgreSQL'
  - 'SQLite'
deliverables:
  - 'Base de dados estruturada em formatos relacionais (SQL/PostgreSQL) ou tabulares (CSV/Parquet)'
  - 'Dicionário de dados completo com metadados e tipagem de campos'
  - 'Relatório de conformidade metodológica, legal (LGPD) e respeito aos termos de uso'
  - 'Scripts de coleta e rotinas de atualização automatizadas'
faq:
  - q: 'Vocês emitem nota fiscal?'
    a: 'Sim. Emitimos nota fiscal para pessoas físicas e jurídicas para qualquer volume de projeto.'
  - q: 'A raspagem de dados digitais é legal e compatível com a LGPD?'
    a: 'Sim. Coletamos apenas dados públicos ou autorizados por APIs oficiais, aplicando práticas imediatas de anonimização e minimização para dados pessoais, com relatório de conformidade dedicado.'
  - q: 'Quais plataformas vocês conseguem coletar?'
    a: 'Extraímos dados de YouTube, portais governamentais de transparência, redes sociais, diários oficiais, bases jurídicas e acervos acadêmicos abertos.'
  - q: 'Vocês conseguem lidar com grandes volumes de dados?'
    a: 'Sim. Já estruturamos projetos com mais de 100 mil vídeos e 50 milhões de comentários, utilizando arquiteturas otimizadas e bancos de dados relacionais.'
examples:
  title: 'Exemplos de Projetos Realizados'
  items:
    - title: 'Tese de Doutorado: Coleta e Análise de Dados do YouTube'
      url: 'https://github.com/geraldohomero/dh-youtube-database'
      description: 'Base de dados com mais de 100 mil vídeos, 50 milhões de comentários de 49 canais do YouTube, incluindo transcrições e metadados estruturados para análise quantitativa e qualitativa e modelagem de tópicos com BERTopic.'
---

## O que é

A coleta de dados digitais da Universitas organiza páginas web, redes sociais e repositórios abertos em bancos de dados estruturados. Escrevemos extratores em **Python** que combinam consumo de APIs oficiais e rotinas de web scraping.

Nossa atuação prioriza a integridade técnica e a conformidade ética: respeitamos diretrizes de rate limiting, termos de uso das plataformas, parâmetros do `robots.txt` e a Lei Geral de Proteção de Dados Pessoais (LGPD).

## Para quem

- **Academia:** Grupos de pesquisa e teses que investigam comunicação política, debates públicos em redes sociais, discursos digitais e dados abertos governamentais.
- **Empresas:** Monitoramento de mercado, inteligência competitiva, análise de preços e mapeamento de tendências de consumo.
- **Setor Público:** Monitoramento de indicadores, coleta de evidências em diários oficiais e fiscalização de transparência ativa em portais públicos.
- **ONGs e Terceiro Setor:** Monitoramento de causas e pautas públicas na internet, análise de desinformação e coleta de dados públicos para campanhas e relatórios temáticos.

## Como fazemos

1. **Avaliação de viabilidade:** Diagnóstico técnico e jurídico sobre as fontes, mecanismos de acesso e volume estimado.
2. **Desenvolvimento de extratores:** Criação de scripts resilientes com tratamento de erros, paginação e logs de auditoria.
3. **Higienização e modelagem:** Limpeza de duplicatas, normalização de caracteres e indexação em banco de dados relacional.
4. **Validação de conformidade:** Emissão do relatório de integridade e entrega da base com dicionário de variáveis.
