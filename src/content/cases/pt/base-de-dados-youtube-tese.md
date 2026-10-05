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

## Contexto da investigação

Uma pesquisa de doutorado em ciências humanas investigou a circulação de discursos, dinâmicas de engajamento e comunidades discursivas em 49 canais temáticos do YouTube ao longo de múltiplos anos.

## O desafio

O projeto exigia coletar metadados, comentários e transcrições em larga escala, lidando com limites de taxa da API, volumes extensos de texto e necessidade de armazenamento estruturado para consultas locais rápidas.

## Abordagem metodológica

Desenvolvemos um fluxo de coleta e processamento em Python:

1. **Extração sistemática:** Scripts automatizados conectados à YouTube Data API v3 e extratores complementares para recuperação de legendas e transcrições completas.
2. **Estruturação de banco de dados:** Modelagem relacional em SQLite e exportação em Parquet, garantindo consultas por período, canal e engajamento.
3. **Modelagem de tópicos:** Algoritmos de processamento de linguagem natural (BERTopic) com embeddings em português para identificar agrupamentos temáticos.
4. **Governança ética e LGPD:** Pseudonimização de identificadores de usuários e respeito aos termos de serviço e diretrizes de pesquisa.

## Resultados e impacto

A base consolidou **mais de 100 mil vídeos, 50 milhões de comentários e 49 canais monitorados**. Os dados estruturados fundamentaram capítulos da tese de doutorado, permitindo testes estatísticos de dispersão de tópicos e análises qualitativas de discurso. O código e a documentação metodológica foram disponibilizados em acesso aberto no GitHub.
