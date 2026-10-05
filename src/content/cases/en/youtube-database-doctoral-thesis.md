---
title: 'Large-Scale YouTube Database and Topic Modeling for Doctoral Thesis'
description: 'Data harvesting of over 100k videos and 50M comments from YouTube for mixed-methods doctoral research.'
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
  alt: 'Graphical user interface and terminal scripts for YouTube data collection'
gallery: []
links:
  - label: 'Project GitHub Repository'
    url: 'https://github.com/geraldohomero/dh-youtube-database'
featured: true
date: 2024-06-01
---

## Research context

A doctoral thesis in the humanities investigated public discourse, engagement patterns, and community dynamics across 49 Brazilian YouTube channels over several years.

## The challenge

The project required harvesting metadata, comments, and transcripts at scale while managing API quotas, large text volumes, and efficient local storage for querying.

## Methodological approach

We built a collection and processing pipeline in Python:

1. **Systematic extraction:** Scripts interfacing with the YouTube Data API v3 and scrapers to retrieve complete video subtitles and transcriptions.
2. **Database architecture:** Relational SQLite schema design and Parquet export workflows, enabling rapid indexing and querying by timeframe, channel, and engagement depth.
3. **Topic modeling:** Transformer-based BERTopic algorithms with Portuguese embeddings to extract semantic clusters.
4. **Ethical governance and LGPD:** Pseudonymization of individual user identifiers, adhering to platform developer policies and ethical standards in scientific inquiry.

## Results and impact

The automated infrastructure aggregated an empirical repository of **over 100,000 videos, 50 million comments, and 49 tracked channels**. This structured database directly empowered core analytical chapters of the doctoral dissertation, facilitating statistical hypothesis testing and discourse analysis with end-to-end reproducibility. Source code and documentation were published openly on GitHub.
