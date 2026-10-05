---
title: 'Base de Dados e Modelagem de Tópicos do YouTube para Tese de Doutorado'
description: 'Coleta em larga escala de mais de 100 mil vídeos e 50 milhões de comentários do YouTube para pesquisa acadêmica quanti-quali.'
translationKey: 'youtube-thesis'
order: 1
sector: 'academia'
services:
  - 'digital-data'
  - 'quantitative'
  - 'qualitative'
tools:
  - 'Python'
  - 'YouTube Data API'
  - 'BERTopic'
  - 'SQLite'
  - 'Pandas'
cover:
  src: '../../../assets/images/cases/youtube-thesis/cover.png'
  alt: 'Interface gráfica e código para coleta e estruturação de dados do YouTube'
gallery: []
links:
  - label: 'Repositório GitHub do Projeto'
    url: 'https://github.com/geraldohomero/dh-youtube-database'
featured: true
date: 2024-06-01
---

## Contexto da Investigação

Em pesquisas de ponta nas ciências humanas e sociais, a análise do debate público em plataformas de vídeo exige volumes maciços de dados empíricos. Uma pesquisa de doutorado demandava o mapeamento aprofundado da circulação de discursos, dinâmicas de engajamento e comunidades discursivas em canais temáticos brasileiros no YouTube ao longo de múltiplos anos.

## O Desafio

O desafio central residia na magnitude e heterogeneidade dos dados: coletar com estabilidade metadados, comentários e transcrições de dezenas de canais, contornando limitações de taxa das APIs, tratando inconsistências de codificação e viabilizando armazenamento local estruturado para consultas analíticas rápidas sem perda de integridade.

## Abordagem Metodológica

A equipe da Universitas desenvolveu um pipeline computacional sob medida em Python, combinando:

1. **Extração sistemática:** Scripts automatizados conectados à YouTube Data API v3 e raspadores complementares para enriquecimento com legendas e transcrições completas.
2. **Estruturação de banco de dados:** Modelagem relacional em SQLite e exports em Parquet, garantindo indexação rápida e consultas eficientes por período, canal e tipo de engajamento.
3. **Modelagem de tópicos:** Aplicação de algoritmos de processamento de linguagem natural (BERTopic) com embeddings em língua portuguesa para identificação de núcleos temáticos emergentes.
4. **Governança ética e LGPD:** Pseudonimização dos identificadores de usuários e estrito cumprimento dos termos de serviço da plataforma e das diretrizes éticas em pesquisa científica.

## Resultados e Impacto

O pipeline consolidou uma base com **mais de 100 mil vídeos, 50 milhões de comentários e 49 canais monitorados**. A base estruturada fundamentou capítulos analíticos da tese de doutorado, permitindo testes estatísticos de dispersão de tópicos e análises qualitativas de discurso com rastreabilidade total do dado bruto ao resultado publicado. O código e documentação metodológica foram disponibilizados em acesso aberto no GitHub.
