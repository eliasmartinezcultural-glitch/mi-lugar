# Esquema editorial

## Estados
DRAFT = contenido en preparación.
REVIEW = contenido en revisión.
VERIFIED = contenido territorial verificado.
PUBLISHED = contenido público.
ARCHIVED = contenido retirado sin borrar su historial.

## Campos mínimos comunes
id
title
slug
summary
category
tags
media
related
verification

## Verificación
verification.status
verification.checkedAt
verification.source
verification.notes

## Principio
Nunca confundir ausencia de información con inexistencia del lugar.

## Relaciones
related contiene IDs estables de otras entidades.
Las relaciones deben aportar contexto, no crear navegación infinita.

## Media
Toda imagen, video o documento debe poder registrar:
- referencia
- autor/procedencia cuando corresponda
- fecha cuando esté disponible
- derechos/uso cuando corresponda
- texto alternativo

## Publicación
Solo VERIFIED puede pasar a PUBLISHED cuando el contenido contiene una afirmación factual sobre el territorio.
