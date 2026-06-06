# Simuladores Educativos — Programación Web I

**Proyecto Final · Desafío: "Página web interactiva para simular problemas reales del contexto actual"**

---

## Descripción general

Este repositorio contiene un portafolio de **tres simuladores web educativos** desarrollados con HTML5, CSS3 y JavaScript puro, sin frameworks ni librerías externas. Cada simulador modela un problema real relacionado con la crisis de abastecimiento, precios y transporte que afecta al contexto actual del país.

Los simuladores están agrupados bajo una **página de portafolio principal** (`index.html`) que enlaza a cada uno de ellos.

---

## ️ Estructura del proyecto

```
simuladores/
│
├── index.html                        ← Portafolio principal (página de inicio)
│
├── simulador-carburantes/            ← Escenario A: Abastecimiento de combustible
│   ├── index.html
│   ├── css/
│   │   └── estilos.css
│   ├── js/
│   │   └── script.js
│   ├── img/
│   │   ├── hero-combustible.svg
│   │   ├── formula-combustible.svg
│   │   └── niveles-alerta.svg
│   └── README.md
│
├── simulador-transporte/             ← Escenario C: Costo de transporte con desvíos
│   ├── index.html
│   ├── css/
│   │   └── estilos.css
│   ├── js/
│   │   └── script.js
│   ├── img/
│   │   ├── hero-transporte.svg
│   │   ├── mapa-rutas.svg
│   │   └── icono-costo.svg
│   └── README.md
│
└── simulador-escasez/                ← Escenario E: Rumor de escasez y compras por pánico
    ├── index.html
    ├── css/
    │   └── estilos.css
    ├── js/
    │   └── script.js
    ├── img/
    │   ├── hero-escasez.svg
    │   ├── grafico-demanda.svg
    │   └── icono-panico.svg
    └── README.md
```

---

## Simuladores incluidos

### SimuCombustible — Escenario A
Calcula cuántos días durará la reserva de una estación de servicio según el consumo diario, el reabastecimiento y el nivel crítico configurado. Genera una proyección de hasta 60 días con alertas visuales por estado (Normal / Alerta / Crítico).

**Modelo matemático:**
```
Reserva diaria = Reserva anterior + Reabastecimiento − Consumo
```

---

### SimuTransporte — Escenario C
Estima el aumento del costo de traslado cuando existen bloqueos o desvíos. Calcula la diferencia de gasto semanal y mensual entre la ruta normal y la ruta alternativa, con proyección acumulada de 8 semanas.

**Modelos matemáticos:**
```
Costo normal     = Distancia normal × Costo/km × Viajes/semana
Costo con desvío = Distancia con desvío × Costo/km × Viajes/semana
Costo adicional  = Costo con desvío − Costo normal
```

---

### SimuEscasez — Escenario E
Modela cómo un rumor de desabastecimiento dispara las compras por pánico, eleva la demanda real y puede agotar el stock disponible. Incluye proyección diaria de 7 días y clasificación por estado del stock.

**Modelos matemáticos:**
```
Nueva demanda    = Demanda normal × (1 + % aumento / 100)
Stock restante   = Stock disponible − Nueva demanda
Días con stock   = Stock / Demanda (normal vs pánico)
```

---

## ️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica: `header`, `nav`, `main`, `section`, `article`, `footer` |
| CSS3 | Estilos externos, variables CSS, Flexbox, Grid, media queries responsivas |
| JavaScript | Cálculos, validaciones, eventos y lógica de simulación |
| DOM | Captura de datos de formularios y renderizado dinámico de resultados |
| SVG | Imágenes e íconos propios del proyecto |
| Git / GitHub | Control de versiones y publicación del repositorio |

---

## Casos de estudio

Cada simulador incluye **3 casos de estudio precargados** con un solo clic, para verificar el funcionamiento sin necesidad de ingresar datos manualmente.

### Carburantes
| Caso | Reserva | Consumo | Reabast. | Crítico |
|------|---------|---------|----------|---------|
| Estándar | 10,000 L | 1,200 L/día | 300 L/día | 2,000 L |
| Crisis | 5,000 L | 800 L/día | 0 L/día | 1,000 L |
| Estable | 8,000 L | 1,500 L/día | 1,500 L/día | 3,000 L |

### Transporte
| Caso | Dist. normal | Dist. desvío | Costo/km | Viajes/sem |
|------|-------------|-------------|----------|-----------|
| Bloqueo leve | 10 km | 15 km | 2.5 Bs | 10 |
| Bloqueo severo | 8 km | 25 km | 3 Bs | 14 |
| Ruta habitual | 20 km | 20 km | 2 Bs | 5 |

### Escasez
| Caso | Demanda normal | % aumento | Stock | Familias |
|------|---------------|-----------|-------|---------|
| Pánico moderado | 100 u | 40% | 120 u | 50 |
| Pánico alto | 80 u | 90% | 100 u | 40 |
| Stock suficiente | 60 u | 25% | 500 u | 30 |

---

## Cómo usar

1. Clona el repositorio o descarga el ZIP
2. Abre `simuladores/index.html` en cualquier navegador moderno
3. Desde el portafolio, accede a cada simulador
4. Ingresa los datos en el formulario o carga un caso de estudio
5. Haz clic en **"Calcular simulación"** y revisa los resultados

> No requiere servidor ni instalación. Funciona directamente en el navegador.

---

## Publicación

| Recurso | Enlace |
|---------|--------|
| Página web publicada | *(agregar enlace)* |
| Repositorio Git | *(agregar enlace)* |

---

## Información del proyecto

| Campo | Detalle |
|-------|---------|
| Materia | Programación Web I |
| Desafío | Página web interactiva para simular problemas reales |
| Escenarios | A (Carburantes), C (Transporte), E (Escasez) |
| Tipo de proyecto | Educativo, sin fines comerciales |
