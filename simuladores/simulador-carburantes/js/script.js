const inputReservaInicial  = document.getElementById('reservaInicial');
const inputConsumoDiario   = document.getElementById('consumoDiario');
const inputReabastecimiento = document.getElementById('reabastecimiento');
const inputNivelCritico    = document.getElementById('nivelCritico');
const inputConsumoAlto     = document.getElementById('consumoAlto');

const btnCalcular = document.getElementById('btnCalcular');
const btnLimpiar  = document.getElementById('btnLimpiar');

const placeholderResultados = document.getElementById('placeholderResultados');
const contenidoResultados   = document.getElementById('contenidoResultados');

const tablaWrapper     = document.getElementById('tablaWrapper');
const tablaPlaceholder = document.getElementById('tablaPlaceholder');

const errores = {
  reservaInicial:   document.getElementById('reservaInicial-error'),
  consumoDiario:    document.getElementById('consumoDiario-error'),
  reabastecimiento: document.getElementById('reabastecimiento-error'),
  nivelCritico:     document.getElementById('nivelCritico-error'),
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

function validarCampo(input, errorEl, label) {
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
  const v1 = validarCampo(inputReservaInicial,   errores.reservaInicial,   'Reserva inicial');
  const v2 = validarCampo(inputConsumoDiario,    errores.consumoDiario,    'Consumo diario');
  const v3 = validarCampo(inputReabastecimiento, errores.reabastecimiento, 'Reabastecimiento');
  const v4 = validarCampo(inputNivelCritico,     errores.nivelCritico,     'Nivel crítico');
  return v1 && v2 && v3 && v4;
}

function calcularProyeccion(reservaInicial, consumoDiario, reabastecimiento, nivelCritico) {
  const MAX_DIAS = 60;
  const filas = [];
  let reserva = reservaInicial;

  for (let dia = 1; dia <= MAX_DIAS; dia++) {
    const reabast = reserva > 0 ? reabastecimiento : 0;
    const consumo = reserva > 0 ? Math.min(consumoDiario, reserva + reabast) : 0;
    const nuevaReserva = reserva + reabast - consumo;
    reserva = Math.max(nuevaReserva, 0);

    let estado;
    if (reserva <= 0)           estado = 'agotada';
    else if (reserva <= nivelCritico) estado = 'critical';
    else if (reserva <= nivelCritico * 1.5) estado = 'warning';
    else                              estado = 'safe';

    filas.push({
      dia,
      reserva: Math.round(reserva),
      consumo: Math.round(consumo),
      reabastecimiento: Math.round(reabast),
      estado,
    });

    if (reserva <= 0) break;
  }

  return filas;
}

function diaCritico(proyeccion, nivelCritico) {
  const fila = proyeccion.find(f => f.reserva <= nivelCritico && f.estado !== 'safe');
  return fila ? fila.dia : null;
}

function estadoGeneral(proyeccion, nivelCritico) {
  const ultimaFila = proyeccion[proyeccion.length - 1];
  if (ultimaFila.estado === 'agotada') return 'danger';
  const critico = diaCritico(proyeccion, nivelCritico);
  if (critico !== null && critico <= 10) return 'danger';
  if (critico !== null) return 'warning';
  return 'safe';
}

function renderizarResultados(reservaInicial, consumoDiario, reabastecimiento, nivelCritico, consumoAlto) {
  const proyeccion = calcularProyeccion(reservaInicial, consumoDiario, reabastecimiento, nivelCritico);
  const diaAlerta  = diaCritico(proyeccion, nivelCritico);
  const estado     = estadoGeneral(proyeccion, nivelCritico);

  const netoDiario = reabastecimiento - consumoDiario;
  const ultimaFila = proyeccion[proyeccion.length - 1];
  const diasTotales = ultimaFila.dia;
  const reservaFinal = ultimaFila.reserva;

  
  const estadoReservaFinal = reservaFinal > nivelCritico ? 'safe'
    : reservaFinal > 0 ? 'warning' : 'danger';

  let html = `<div class="result-cards-grid">`;

  html += tarjetaResultado(
    'Días simulados',
    `${diasTotales} días`,
    netoDiario >= 0 ? 'info' : 'warning',
    netoDiario >= 0
      ? 'La reserva se mantiene durante todo el período'
      : 'La reserva se reduce cada día'
  );

  html += tarjetaResultado(
    'Reserva al final',
    `${formatNum(reservaFinal)} L`,
    estadoReservaFinal,
    `Al día ${diasTotales}`
  );

  html += tarjetaResultado(
    'Variación diaria',
    `${netoDiario >= 0 ? '+' : ''}${formatNum(netoDiario)} L/día`,
    netoDiario >= 0 ? 'safe' : 'danger',
    netoDiario >= 0 ? 'Reabastecimiento cubre consumo' : 'Déficit diario'
  );

  html += tarjetaResultado(
    'Día nivel crítico',
    diaAlerta !== null ? `Día ${diaAlerta}` : 'No alcanzado',
    diaAlerta !== null ? (diaAlerta <= 7 ? 'danger' : 'warning') : 'safe',
    diaAlerta !== null
      ? `Reserva baja a ≤ ${formatNum(nivelCritico)} L`
      : 'La reserva se mantiene sobre el umbral'
  );

  html += `</div>`;

  
  const alertas = {
    safe:    { icon: '', msg: 'Estado <strong>NORMAL</strong>: La reserva se mantiene sobre el nivel crítico durante toda la simulación. El abastecimiento está bajo control.' },
    warning: { icon: '️', msg: `Estado <strong>ALERTA</strong>: La reserva llegará al nivel crítico en el día ${diaAlerta}. Se recomienda gestionar un reabastecimiento urgente.` },
    danger:  { icon: '', msg: diaAlerta !== null
      ? `Estado <strong>CRÍTICO</strong>: La reserva alcanza el nivel de emergencia en el día ${diaAlerta}. ¡Acción inmediata requerida!`
      : 'Estado <strong>CRÍTICO</strong>: La reserva se agota completamente. El desabastecimiento es inminente.' },
  };

  const alerta = alertas[estado];
  html += `
    <div class="status-alert status-alert--${estado}" role="alert">
      <span class="status-alert__icon" aria-hidden="true">${alerta.icon}</span>
      <p>${alerta.msg}</p>
    </div>
  `;

  
  if (consumoAlto && consumoAlto > 0) {
    const proyAlto   = calcularProyeccion(reservaInicial, consumoAlto, reabastecimiento, nivelCritico);
    const diaAltoCrit = diaCritico(proyAlto, nivelCritico);
    const diasAlto   = proyAlto[proyAlto.length - 1].dia;

    html += `
      <div class="comparison-block">
        <p class="comparison-block__title"> Comparación: consumo normal vs demanda alta</p>
        <div class="comparison-row">
          <span class="comparison-row__label">Consumo normal (${formatNum(consumoDiario)} L/día)</span>
          <span class="comparison-row__val">Día crítico: ${diaAlerta !== null ? 'Día ' + diaAlerta : '— no alcanzado'}</span>
        </div>
        <div class="comparison-row">
          <span class="comparison-row__label">Demanda alta (${formatNum(consumoAlto)} L/día)</span>
          <span class="comparison-row__val comparison-row__val--danger">
            Día crítico: ${diaAltoCrit !== null ? 'Día ' + diaAltoCrit : '— no alcanzado'}
          </span>
        </div>
        <div class="comparison-row">
          <span class="comparison-row__label">Días de reserva restantes</span>
          <span class="comparison-row__val">Normal: ${diasTotales} · Alta: ${diasAlto} <span style="color:var(--color-danger)">(−${diasTotales - diasAlto} días)</span></span>
        </div>
      </div>
    `;
  }

  
  contenidoResultados.innerHTML = html;
  placeholderResultados.hidden = true;
  contenidoResultados.hidden   = false;

  
  renderizarTabla(proyeccion, consumoAlto ? calcularProyeccion(reservaInicial, consumoAlto, reabastecimiento, nivelCritico) : null, nivelCritico);

  
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

function renderizarTabla(proyeccion, proyeccionAlta, nivelCritico) {
  const tieneAlta = proyeccionAlta !== null;

  let html = `
    <table class="projection-table" aria-label="Proyección diaria de reserva de combustible">
      <thead>
        <tr>
          <th scope="col">Día</th>
          <th scope="col">Reserva (L)</th>
          <th scope="col">Consumo (L)</th>
          <th scope="col">Reabastec. (L)</th>
          <th scope="col">Estado</th>
          ${tieneAlta ? '<th scope="col">Res. Alta demanda (L)</th>' : ''}
        </tr>
      </thead>
      <tbody>
  `;

  proyeccion.forEach((fila, idx) => {
    const rowClass = fila.estado === 'agotada' || fila.estado === 'critical'
      ? 'row--critical'
      : fila.estado === 'warning' ? 'row--warning' : 'row--safe';

    const badge = badgeEstado(fila.estado);
    const reservaAlta = tieneAlta && proyeccionAlta[idx]
      ? formatNum(proyeccionAlta[idx].reserva) + ' L'
      : tieneAlta ? '—' : '';

    html += `
      <tr class="${rowClass}">
        <td><strong>Día ${fila.dia}</strong></td>
        <td>${formatNum(fila.reserva)} L</td>
        <td>${formatNum(fila.consumo)} L</td>
        <td>${formatNum(fila.reabastecimiento)} L</td>
        <td>${badge}</td>
        ${tieneAlta ? `<td>${reservaAlta}</td>` : ''}
      </tr>
    `;
  });

  html += `</tbody></table>`;

  tablaWrapper.innerHTML = html;
  tablaWrapper.hidden     = false;
  tablaPlaceholder.hidden = true;
}

function badgeEstado(estado) {
  const configs = {
    safe:     { cls: 'safe',    icon: '', label: 'Normal' },
    warning:  { cls: 'warning', icon: '️', label: 'Alerta' },
    critical: { cls: 'danger',  icon: '', label: 'Crítico' },
    agotada:  { cls: 'danger',  icon: '', label: 'Agotada' },
  };
  const c = configs[estado] || configs.safe;
  return `<span class="badge-status badge-status--${c.cls}" aria-label="Estado: ${c.label}">${c.icon} ${c.label}</span>`;
}

btnCalcular.addEventListener('click', () => {
  if (!validarFormulario()) return;

  const reservaInicial    = parseFloat(inputReservaInicial.value);
  const consumoDiario     = parseFloat(inputConsumoDiario.value);
  const reabastecimiento  = parseFloat(inputReabastecimiento.value);
  const nivelCritico      = parseFloat(inputNivelCritico.value);
  const consumoAlto       = inputConsumoAlto.value.trim() !== ''
    ? parseFloat(inputConsumoAlto.value)
    : null;

  
  if (nivelCritico >= reservaInicial) {
    mostrarError(
      inputNivelCritico,
      errores.nivelCritico,
      'El nivel crítico debe ser menor que la reserva inicial.'
    );
    return;
  }

  renderizarResultados(reservaInicial, consumoDiario, reabastecimiento, nivelCritico, consumoAlto);
});

btnLimpiar.addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
  
  [inputReservaInicial, inputConsumoDiario, inputReabastecimiento, inputNivelCritico, inputConsumoAlto].forEach(el => {
    el.value = '';
    el.classList.remove('input--error');
  });

  
  Object.values(errores).forEach(el => { el.textContent = ''; });

  
  placeholderResultados.hidden = false;
  contenidoResultados.hidden   = true;
  tablaWrapper.hidden          = true;
  tablaPlaceholder.hidden      = false;
  contenidoResultados.innerHTML = '';

  
  inputReservaInicial.focus();
}

inputReservaInicial.addEventListener('blur',  () => validarCampo(inputReservaInicial,   errores.reservaInicial,   'Reserva inicial'));
inputConsumoDiario.addEventListener('blur',   () => validarCampo(inputConsumoDiario,    errores.consumoDiario,    'Consumo diario'));
inputReabastecimiento.addEventListener('blur',() => validarCampo(inputReabastecimiento, errores.reabastecimiento, 'Reabastecimiento'));
inputNivelCritico.addEventListener('blur',    () => validarCampo(inputNivelCritico,     errores.nivelCritico,     'Nivel crítico'));

function cargarCaso(num) {
  const casos = {
    1: { reserva: 10000, consumo: 1200, reabast: 300, critico: 2000, alto: 2000 },
    2: { reserva: 5000,  consumo: 800,  reabast: 0,   critico: 1000, alto: null },
    3: { reserva: 8000,  consumo: 1500, reabast: 1500,critico: 3000, alto: null },
  };

  const caso = casos[num];
  if (!caso) return;

  inputReservaInicial.value   = caso.reserva;
  inputConsumoDiario.value    = caso.consumo;
  inputReabastecimiento.value = caso.reabast;
  inputNivelCritico.value     = caso.critico;
  inputConsumoAlto.value      = caso.alto ?? '';

  
  Object.values(errores).forEach(el => { el.textContent = ''; });
  [inputReservaInicial, inputConsumoDiario, inputReabastecimiento, inputNivelCritico, inputConsumoAlto]
    .forEach(el => el.classList.remove('input--error'));

  
  document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    btnCalcular.click();
  }, 600);
}

function formatNum(n) {
  return new Intl.NumberFormat('es-BO').format(n);
}

const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav__link');

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