const inputDistanciaNormal  = document.getElementById('distanciaNormal');
const inputDistanciaDesvio  = document.getElementById('distanciaDesvio');
const inputCostoPorKm       = document.getElementById('costoPorKm');
const inputViajesPorSemana  = document.getElementById('viajesPorSemana');

const btnCalcular = document.getElementById('btnCalcular');
const btnLimpiar  = document.getElementById('btnLimpiar');

const placeholderResultados = document.getElementById('placeholderResultados');
const contenidoResultados   = document.getElementById('contenidoResultados');

const tablaWrapper     = document.getElementById('tablaWrapper');
const tablaPlaceholder = document.getElementById('tablaPlaceholder');

const errores = {
  distanciaNormal:  document.getElementById('distanciaNormal-error'),
  distanciaDesvio:  document.getElementById('distanciaDesvio-error'),
  costoPorKm:       document.getElementById('costoPorKm-error'),
  viajesPorSemana:  document.getElementById('viajesPorSemana-error'),
};

const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('nav--open');
  navToggle.classList.toggle('nav-toggle--open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mainNav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('nav--open');
    navToggle.classList.remove('nav-toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

function validarCampo(input, errorEl, label, soloPositivo) {
  const valor = input.value.trim();

  if (valor === '') {
    mostrarError(input, errorEl, `El campo "${label}" es obligatorio.`);
    return false;
  }

  const num = parseFloat(valor);

  if (isNaN(num)) {
    mostrarError(input, errorEl, 'Ingresa un número válido.');
    return false;
  }

  if (num < 0) {
    mostrarError(input, errorEl, 'El valor no puede ser negativo.');
    return false;
  }

  if (soloPositivo && num === 0) {
    mostrarError(input, errorEl, 'El valor debe ser mayor que cero.');
    return false;
  }

  limpiarError(input, errorEl);
  return true;
}

function mostrarError(input, errorEl, mensaje) {
  errorEl.textContent = mensaje;
  input.classList.add('input--error');
}

function limpiarError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('input--error');
}

function validarFormulario() {
  const v1 = validarCampo(inputDistanciaNormal, errores.distanciaNormal, 'Distancia normal', true);
  const v2 = validarCampo(inputDistanciaDesvio, errores.distanciaDesvio, 'Distancia con desvío', true);
  const v3 = validarCampo(inputCostoPorKm,      errores.costoPorKm,      'Costo por kilómetro', true);
  const v4 = validarCampo(inputViajesPorSemana, errores.viajesPorSemana, 'Viajes por semana', true);
  return v1 && v2 && v3 && v4;
}

function calcularCostos(distNormal, distDesvio, costoPorKm, viajesSemana) {
  const costoNormalSemana  = distNormal  * costoPorKm * viajesSemana;
  const costoDesvioSemana  = distDesvio  * costoPorKm * viajesSemana;
  const diferenciaSemana   = costoDesvioSemana - costoNormalSemana;
  const costoNormalMes     = costoNormalSemana  * 4;
  const costoDesvioMes     = costoDesvioSemana  * 4;
  const diferenciaMes      = diferenciaSemana   * 4;
  const kmExtra            = distDesvio - distNormal;
  const porcentajeAumento  = distNormal > 0
    ? ((distDesvio - distNormal) / distNormal) * 100
    : 0;

  return {
    costoNormalSemana,
    costoDesvioSemana,
    diferenciaSemana,
    costoNormalMes,
    costoDesvioMes,
    diferenciaMes,
    kmExtra,
    porcentajeAumento,
  };
}

function calcularProyeccionSemanal(distNormal, distDesvio, costoPorKm, viajesSemana, semanas) {
  const filas = [];
  let acumuladoNormal = 0;
  let acumuladoDesvio = 0;

  for (let s = 1; s <= semanas; s++) {
    const costoNormal = distNormal * costoPorKm * viajesSemana;
    const costoDesvio = distDesvio * costoPorKm * viajesSemana;
    const diferencia  = costoDesvio - costoNormal;
    acumuladoNormal  += costoNormal;
    acumuladoDesvio  += costoDesvio;

    const nivelImpacto = diferencia / costoNormal;

    filas.push({
      semana: s,
      costoNormal,
      costoDesvio,
      diferencia,
      acumuladoNormal,
      acumuladoDesvio,
      acumuladoDif: acumuladoDesvio - acumuladoNormal,
      nivelImpacto,
    });
  }

  return filas;
}

function nivelAlerta(porcentajeAumento) {
  if (porcentajeAumento >= 50) return 'danger';
  if (porcentajeAumento >= 20) return 'warning';
  return 'safe';
}

function renderizarResultados(distNormal, distDesvio, costoPorKm, viajesSemana) {
  const datos  = calcularCostos(distNormal, distDesvio, costoPorKm, viajesSemana);
  const alerta = nivelAlerta(datos.porcentajeAumento);

  let html = `<div class="result-cards-grid">`;

  html += tarjetaResultado(
    'Costo normal / semana',
    `Bs ${formatNum(datos.costoNormalSemana)}`,
    'info',
    `${formatNum(distNormal)} km × ${viajesSemana} viajes`
  );

  html += tarjetaResultado(
    'Costo con desvío / semana',
    `Bs ${formatNum(datos.costoDesvioSemana)}`,
    datos.porcentajeAumento >= 50 ? 'danger' : 'warning',
    `${formatNum(distDesvio)} km × ${viajesSemana} viajes`
  );

  html += tarjetaResultado(
    'Gasto adicional / semana',
    `+Bs ${formatNum(datos.diferenciaSemana)}`,
    alerta,
    `+${formatNum(datos.kmExtra)} km extra por viaje`
  );

  html += tarjetaResultado(
    'Gasto adicional / mes',
    `+Bs ${formatNum(datos.diferenciaMes)}`,
    alerta,
    `Estimado a 4 semanas`
  );

  html += `</div>`;

  const mensajesAlerta = {
    safe: `Impacto <strong>MODERADO</strong>: El desvío representa un aumento del ${formatNum(datos.porcentajeAumento)}% en distancia. El gasto adicional es manejable.`,
    warning: `Impacto <strong>SIGNIFICATIVO</strong>: El desvío aumenta la distancia un ${formatNum(datos.porcentajeAumento)}%. Se recomienda evaluar opciones de transporte compartido.`,
    danger:  `Impacto <strong>CRÍTICO</strong>: El desvío aumenta la distancia un ${formatNum(datos.porcentajeAumento)}%. El gasto adicional puede afectar gravemente el presupuesto familiar o empresarial.`,
  };

  html += `
    <div class="status-alert status-alert--${alerta}" role="alert">
      <p>${mensajesAlerta[alerta]}</p>
    </div>
  `;

  html += `
    <div class="comparison-block">
      <p class="comparison-block__title">Resumen comparativo mensual</p>
      <div class="comparison-row">
        <span class="comparison-row__label">Distancia normal</span>
        <span class="comparison-row__val">${formatNum(distNormal)} km / viaje</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Distancia con desvío</span>
        <span class="comparison-row__val comparison-row__val--warning">${formatNum(distDesvio)} km / viaje (+${formatNum(datos.kmExtra)} km)</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Costo mensual normal</span>
        <span class="comparison-row__val">Bs ${formatNum(datos.costoNormalMes)}</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Costo mensual con desvío</span>
        <span class="comparison-row__val comparison-row__val--danger">Bs ${formatNum(datos.costoDesvioMes)}</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Diferencia mensual</span>
        <span class="comparison-row__val comparison-row__val--danger">+Bs ${formatNum(datos.diferenciaMes)} (${formatNum(datos.porcentajeAumento)}% más)</span>
      </div>
    </div>
  `;

  contenidoResultados.innerHTML = html;
  placeholderResultados.hidden = true;
  contenidoResultados.hidden   = false;

  renderizarTabla(distNormal, distDesvio, costoPorKm, viajesSemana);

  setTimeout(() => {
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

function tarjetaResultado(label, valor, tipo, desc) {
  return `
    <div class="result-card result-card--${tipo}">
      <p class="result-card__label">${label}</p>
      <p class="result-card__value result-card__value--${tipo}">${valor}</p>
      <p class="result-card__desc">${desc}</p>
    </div>
  `;
}

function renderizarTabla(distNormal, distDesvio, costoPorKm, viajesSemana) {
  const proyeccion = calcularProyeccionSemanal(distNormal, distDesvio, costoPorKm, viajesSemana, 8);

  let html = `
    <table class="projection-table" aria-label="Proyección semanal del costo de transporte">
      <thead>
        <tr>
          <th scope="col">Semana</th>
          <th scope="col">Costo Normal (Bs)</th>
          <th scope="col">Costo Desvío (Bs)</th>
          <th scope="col">Diferencia (Bs)</th>
          <th scope="col">Acum. Normal (Bs)</th>
          <th scope="col">Acum. Adicional (Bs)</th>
        </tr>
      </thead>
      <tbody>
  `;

  proyeccion.forEach(fila => {
    const rowClass = fila.nivelImpacto >= 0.5 ? 'row--high'
      : fila.nivelImpacto >= 0.2 ? 'row--medium' : '';

    html += `
      <tr class="${rowClass}">
        <td><strong>Semana ${fila.semana}</strong></td>
        <td>${formatNum(fila.costoNormal)}</td>
        <td>${formatNum(fila.costoDesvio)}</td>
        <td>+${formatNum(fila.diferencia)}</td>
        <td>${formatNum(fila.acumuladoNormal)}</td>
        <td style="color: var(--color-danger)">+${formatNum(fila.acumuladoDif)}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  tablaWrapper.innerHTML = html;
  tablaWrapper.hidden     = false;
  tablaPlaceholder.hidden = true;
}

btnCalcular.addEventListener('click', () => {
  if (!validarFormulario()) return;

  const distanciaNormal  = parseFloat(inputDistanciaNormal.value);
  const distanciaDesvio  = parseFloat(inputDistanciaDesvio.value);
  const costoPorKm       = parseFloat(inputCostoPorKm.value);
  const viajesPorSemana  = parseFloat(inputViajesPorSemana.value);

  if (distanciaDesvio <= distanciaNormal) {
    mostrarError(
      inputDistanciaDesvio,
      errores.distanciaDesvio,
      'La distancia con desvío debe ser mayor que la distancia normal.'
    );
    return;
  }

  renderizarResultados(distanciaNormal, distanciaDesvio, costoPorKm, viajesPorSemana);
});

btnLimpiar.addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
  [inputDistanciaNormal, inputDistanciaDesvio, inputCostoPorKm, inputViajesPorSemana].forEach(el => {
    el.value = '';
    el.classList.remove('input--error');
  });

  Object.values(errores).forEach(el => { el.textContent = ''; });

  placeholderResultados.hidden = false;
  contenidoResultados.hidden   = true;
  tablaWrapper.hidden          = true;
  tablaPlaceholder.hidden      = false;
  contenidoResultados.innerHTML = '';

  inputDistanciaNormal.focus();
}

inputDistanciaNormal.addEventListener('blur',  () => validarCampo(inputDistanciaNormal, errores.distanciaNormal, 'Distancia normal', true));
inputDistanciaDesvio.addEventListener('blur',  () => validarCampo(inputDistanciaDesvio, errores.distanciaDesvio, 'Distancia con desvío', true));
inputCostoPorKm.addEventListener('blur',       () => validarCampo(inputCostoPorKm,      errores.costoPorKm,      'Costo por kilómetro', true));
inputViajesPorSemana.addEventListener('blur',  () => validarCampo(inputViajesPorSemana, errores.viajesPorSemana, 'Viajes por semana', true));

function cargarCaso(num) {
  const casos = {
    1: { normal: 10,  desvio: 18,  costo: 1.5, viajes: 10 },
    2: { normal: 50,  desvio: 80,  costo: 2.5, viajes: 5  },
    3: { normal: 5,   desvio: 12,  costo: 1.2, viajes: 10 },
  };

  const caso = casos[num];
  if (!caso) return;

  inputDistanciaNormal.value  = caso.normal;
  inputDistanciaDesvio.value  = caso.desvio;
  inputCostoPorKm.value       = caso.costo;
  inputViajesPorSemana.value  = caso.viajes;

  Object.values(errores).forEach(el => { el.textContent = ''; });
  [inputDistanciaNormal, inputDistanciaDesvio, inputCostoPorKm, inputViajesPorSemana]
    .forEach(el => el.classList.remove('input--error'));

  document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    btnCalcular.click();
  }, 600);
}

function formatNum(n) {
  return new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observerOpts = { rootMargin: '-30% 0px -60% 0px' };

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, observerOpts);

sections.forEach(s => sectionObserver.observe(s));