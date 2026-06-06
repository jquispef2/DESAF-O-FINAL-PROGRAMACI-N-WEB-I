# SimuEscasez — Simulador de Rumor de Escasez y Compras por Panico

**Desafio Final de Programacion Web I — Escenario E**

## Descripcion

Herramienta educativa que modela como un rumor de desabastecimiento dispara las
compras por panico, eleva la demanda real y puede agotar el stock disponible.

## Estructura del proyecto

```
simulador-escasez/
  index.html
  css/
    estilos.css
  js/
    script.js
  img/
    .gitkeep
  README.md
```

## Tecnologias

- HTML5 con estructura semantica
- CSS3 con variables, grid y flexbox responsivo
- JavaScript puro con manipulacion del DOM

## Como usar

1. Abre `index.html` en un navegador moderno.
2. Ingresa los cuatro parametros del formulario.
3. Presiona **Calcular simulacion**.
4. Observa los resultados y la proyeccion diaria de 7 dias.
5. Carga cualquiera de los 3 casos de estudio para probar rapidamente.

## Variables de entrada

| Variable               | Descripcion                              |
|------------------------|------------------------------------------|
| Demanda normal         | Unidades consumidas por dia sin rumor    |
| % aumento por rumor    | Incremento porcentual sobre la demanda   |
| Stock disponible       | Unidades totales en almacen              |
| Numero de familias     | Cantidad de compradores                  |

## Calculos implementados

- Nueva demanda = demanda normal * (1 + porcentaje / 100)
- Incremento = demanda panico - demanda normal
- Stock restante dia 1 = stock - demanda panico
- Dias con stock normal = stock / demanda normal
- Dias con stock en panico = stock / demanda panico
- Consumo por familia = demanda panico / numero de familias
- Proyeccion diaria (7 dias) con clasificacion de estado
