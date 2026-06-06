# ⛽ SimuCombustible — Simulador de Abastecimiento de Carburantes

**Proyecto Final — Programación Web I**  
**Escenario A: Simulador de abastecimiento de carburantes**

---

## 📋 Descripción

Herramienta web educativa que permite calcular cuántos días durará la reserva de una estación de servicio según su consumo diario, reabastecimiento y nivel crítico configurado. Simula el impacto del desabastecimiento de combustible que afecta a Bolivia.

---

## 🎯 Objetivo

Aplicar los fundamentos de Programación Web I (HTML5, CSS3, JavaScript y DOM) para modelar un problema real relacionado con el abastecimiento de carburantes.

---

## 🚀 Características

- ✅ Formulario interactivo con validación de campos
- ✅ Proyección diaria de la reserva (hasta 60 días)
- ✅ Detección del día en que se alcanza el nivel crítico
- ✅ Comparación entre consumo normal y demanda alta
- ✅ Alertas dinámicas (Normal / Alerta / Crítico)
- ✅ Tabla de proyección con colores según estado
- ✅ 3 casos de estudio predefinidos cargables con un clic
- ✅ Diseño responsivo (desktop, tablet, móvil)
- ✅ Navegación con menú hamburguesa para móviles

---

## 🧮 Modelo matemático

```
Reserva diaria = Reserva anterior + Reabastecimiento − Consumo
```

Se proyecta día a día hasta que la reserva llegue a cero o se cumplan 60 días de simulación.

---

## 🗂️ Estructura de carpetas

```
simulador-carburantes/
│
├── index.html          ← Página principal (estructura HTML5 semántica)
│
├── css/
│   └── estilos.css     ← Todos los estilos (diseño responsivo, variables CSS)
│
├── js/
│   └── script.js       ← Lógica JavaScript + manipulación del DOM
│
├── img/
│   └── (vacío — sin imágenes externas en esta versión)
│
└── README.md           ← Este archivo
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica (header, nav, main, section, footer) |
| CSS3 | Estilos externos, variables CSS, diseño responsivo con media queries |
| JavaScript | Cálculos, validaciones, manipulación del DOM |
| DOM | Captura de datos, renderizado dinámico de resultados |

---

## 📊 Casos de estudio incluidos

| Caso | Reserva | Consumo | Reabast. | Crítico | Resultado esperado |
|------|---------|---------|----------|---------|-------------------|
| 1 — Estándar | 10,000 L | 1,200 L/día | 300 L/día | 2,000 L | ~8 días hasta crítico |
| 2 — Crisis | 5,000 L | 800 L/día | 0 L/día | 1,000 L | ~5 días hasta crítico |
| 3 — Estable | 8,000 L | 1,500 L/día | 1,500 L/día | 3,000 L | Reserva estable |

---

## 📌 Cómo usar

1. Abre `index.html` en cualquier navegador moderno
2. Ingresa los datos de la estación de servicio en el formulario
3. Haz clic en **"Calcular simulación"**
4. Revisa los resultados en las tarjetas y la tabla de proyección
5. O bien, usa un **"Caso de estudio"** para cargar datos de ejemplo automáticamente

---

## 📝 Licencia

Proyecto educativo — Programación Web I. Sin fines comerciales.
