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
gallery:
  - src: '../../../assets/images/cases/youtube-thesis/image-1.png'
    alt: 'Temporal distribution and metrics of scraped comments'
  - src: '../../../assets/images/cases/youtube-thesis/image-2.png'
    alt: 'Topic clustering with BERTopic modeling'
links:
  - label: 'Project GitHub Repository'
    url: 'https://github.com/geraldohomero/dh-youtube-database'
featured: true
date: 2024-06-01
---

## Research Context

In advanced social and computational humanities research, investigating public discourse across video streaming platforms demands extensive empirical evidence. A doctoral thesis required comprehensive mapping of discursive circulation, engagement dynamics, and online communities across Brazilian thematic YouTube channels over multiple years.

## The Challenge

The core obstacle was data scale and structural heterogeneity: reliably collecting metadata, user comments, and transcripts across dozens of channels, managing API rate limits, handling encoding inconsistencies, and engineering local storage optimized for high-performance querying without data loss.

## Methodological Approach

Universitas engineered an automated Python data pipeline combining:

1. **Systematic Extraction:** Customized scripts interfacing with the YouTube Data API v3 and specialized scrapers to retrieve complete video subtitles and transcriptions.
2. **Database Architecture:** Relational SQLite schema design and Parquet export workflows, enabling rapid indexing and performant querying by timeframe, channel, and engagement depth.
3. **Natural Language Topic Modeling:** Integration of transformer-based BERTopic algorithms with Portuguese embeddings to extract latent semantic structures.
4. **Ethical Governance & LGPD:** Rigorous pseudonymization of individual user identifiers, adhering strictly to platform developer policies and ethical standards in scientific inquiry.

## Results & Impact

The automated infrastructure aggregated an empirical repository of **over 100,000 videos, 50 million comments, and 49 tracked channels**. This structured database directly empowered core analytical chapters of the doctoral dissertation, facilitating statistical hypothesis testing and discourse analysis with end-to-end reproducibility. Source code and documentation were published openly on GitHub.
