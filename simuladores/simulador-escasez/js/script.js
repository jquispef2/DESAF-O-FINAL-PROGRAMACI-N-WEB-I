const inputDemandaNormal   = document.getElementById('demandaNormal');
const inputPorcentajeRumor = document.getElementById('porcentajeRumor');
const inputStockDisponible = document.getElementById('stockDisponible');
const inputNumFamilias     = document.getElementById('numFamilias');

const btnCalcular = document.getElementById('btnCalcular');
const btnLimpiar  = document.getElementById('btnLimpiar');

const placeholderResultados = document.getElementById('placeholderResultados');
const contenidoResultados   = document.getElementById('contenidoResultados');
const tarjetasResultado     = document.getElementById('tarjetasResultado');
const alertaEstado          = document.getElementById('alertaEstado');
const bloqueComparacion     = document.getElementById('bloqueComparacion');

const tablaWrapper    = document.getElementById('tablaWrapper');
const tablaPlaceholder = document.getElementById('tablaPlaceholder');
const cuerpoTabla     = document.getElementById('cuerpoTabla');

const errores = {
  demandaNormal:   document.getElementById('demandaNormal-error'),
  porcentajeRumor: document.getElementById('porcentajeRumor-error'),
  stockDisponible: document.getElementById('stockDisponible-error'),
  numFamilias:     document.getElementById('numFamilias-error'),
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

function formatNum(n) {
  return n.toLocaleString('es-BO', { maximumFractionDigits: 1 });
}

function limpiarError(campo) {
  errores[campo].textContent = '';
  const input = document.getElementById(campo);
  if (input) input.classList.remove('input--error');
}

function mostrarError(campo, mensaje) {
  errores[campo].textContent = mensaje;
  const input = document.getElementById(campo);
  if (input) input.classList.add('input--error');
}

function validar() {
  let valido = true;

  const demanda = parseFloat(inputDemandaNormal.value);
  const porcentaje = parseFloat(inputPorcentajeRumor.value);
  const stock = parseFloat(inputStockDisponible.value);
  const familias = parseFloat(inputNumFamilias.value);

  limpiarError('demandaNormal');
  limpiarError('porcentajeRumor');
  limpiarError('stockDisponible');
  limpiarError('numFamilias');

  if (!inputDemandaNormal.value.trim() || isNaN(demanda) || demanda <= 0) {
    mostrarError('demandaNormal', 'Ingresa un valor mayor a cero.');
    valido = false;
  }

  if (!inputPorcentajeRumor.value.trim() || isNaN(porcentaje) || porcentaje < 0) {
    mostrarError('porcentajeRumor', 'Ingresa un porcentaje igual o mayor a 0.');
    valido = false;
  }

  if (!inputStockDisponible.value.trim() || isNaN(stock) || stock <= 0) {
    mostrarError('stockDisponible', 'Ingresa un stock mayor a cero.');
    valido = false;
  }

  if (!inputNumFamilias.value.trim() || isNaN(familias) || familias <= 0) {
    mostrarError('numFamilias', 'Ingresa un numero mayor a cero.');
    valido = false;
  }

  return valido;
}

function calcular() {
  if (!validar()) return;

  const demanda    = parseFloat(inputDemandaNormal.value);
  const porcentaje = parseFloat(inputPorcentajeRumor.value);
  const stock      = parseFloat(inputStockDisponible.value);
  const familias   = parseFloat(inputNumFamilias.value);

  const incremento      = demanda * (porcentaje / 100);
  const demandaPanico   = demanda + incremento;
  const diferencia      = demandaPanico - demanda;
  const stockRestante   = stock - demandaPanico;
  const diasNormal      = stock / demanda;
  const diasPanico      = stock / demandaPanico;
  const porPorFamilia   = demandaPanico / familias;
  const agotado         = stockRestante <= 0;

  let estado, estadoClase;
  if (agotado) {
    estado = 'CRITICO — El stock se agota en el primer dia de panico';
    estadoClase = 'danger';
  } else if (stockRestante < demandaPanico) {
    estado = 'ALERTA — El stock durara menos de 2 dias con la demanda actual';
    estadoClase = 'warning';
  } else {
    estado = 'ESTABLE — El stock alcanza para cubrir la demanda de panico por ahora';
    estadoClase = 'safe';
  }

  tarjetasResultado.innerHTML = `
    <div class="result-card result-card--info">
      <div class="result-card__label">Demanda normal</div>
      <div class="result-card__value">${formatNum(demanda)}</div>
      <div class="result-card__desc">unidades por dia (sin rumor)</div>
    </div>
    <div class="result-card result-card--${agotado ? 'danger' : 'warning'}">
      <div class="result-card__label">Demanda con panico</div>
      <div class="result-card__value result-card__value--${agotado ? 'danger' : 'warning'}">${formatNum(demandaPanico)}</div>
      <div class="result-card__desc">unidades por dia (+${porcentaje}%)</div>
    </div>
    <div class="result-card result-card--warning">
      <div class="result-card__label">Incremento de demanda</div>
      <div class="result-card__value result-card__value--warning">+${formatNum(diferencia)}</div>
      <div class="result-card__desc">unidades adicionales diarias</div>
    </div>
    <div class="result-card result-card--${agotado ? 'danger' : 'safe'}">
      <div class="result-card__label">Stock tras dia 1</div>
      <div class="result-card__value result-card__value--${agotado ? 'danger' : 'safe'}">${agotado ? 'AGOTADO' : formatNum(stockRestante)}</div>
      <div class="result-card__desc">${agotado ? 'deficit de ' + formatNum(Math.abs(stockRestante)) + ' unid.' : 'unidades restantes'}</div>
    </div>
  `;

  const iconos = { safe: '&#10003;', warning: '&#9888;', danger: '&#9888;' };
  alertaEstado.innerHTML = `
    <div class="status-alert status-alert--${estadoClase}" role="alert">
      <span class="status-alert__icon" aria-hidden="true">${iconos[estadoClase]}</span>
      <span>${estado}</span>
    </div>
  `;

  bloqueComparacion.innerHTML = `
    <div class="comparison-block">
      <div class="comparison-block__title">Comparacion de escenarios</div>
      <div class="comparison-row">
        <span class="comparison-row__label">Dias de stock — sin rumor</span>
        <span class="comparison-row__val">${formatNum(diasNormal)} dias</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Dias de stock — con panico</span>
        <span class="comparison-row__val comparison-row__val--${agotado ? 'danger' : 'warning'}">${diasPanico < 1 ? 'Menos de 1 dia' : formatNum(diasPanico) + ' dias'}</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Dias perdidos por rumor</span>
        <span class="comparison-row__val comparison-row__val--danger">-${formatNum(diasNormal - diasPanico)} dias</span>
      </div>
      <div class="comparison-row">
        <span class="comparison-row__label">Consumo por familia/dia (panico)</span>
        <span class="comparison-row__val">${formatNum(porPorFamilia)} unidades</span>
      </div>
    </div>
  `;

  placeholderResultados.hidden = true;
  contenidoResultados.hidden = false;

  generarTabla(demanda, demandaPanico, stock);

  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
}

function generarTabla(demanda, demandaPanico, stock) {
  cuerpoTabla.innerHTML = '';
  let stockActual = stock;
  const DIAS = 7;

  for (let dia = 1; dia <= DIAS; dia++) {
    const stockAntes = stockActual;
    stockActual -= demandaPanico;
    const restante = stockActual < 0 ? 0 : stockActual;

    let claseRow, estadoBadge, labelBadge;

    if (stockAntes <= 0) {
      claseRow = 'row--critical';
      estadoBadge = 'danger';
      labelBadge = 'Sin stock';
    } else if (stockActual <= 0) {
      claseRow = 'row--critical';
      estadoBadge = 'danger';
      labelBadge = 'Stock agotado';
    } else if (restante < demandaPanico) {
      claseRow = 'row--warning';
      estadoBadge = 'warning';
      labelBadge = 'Stock bajo';
    } else {
      claseRow = 'row--safe';
      estadoBadge = 'safe';
      labelBadge = 'Stock OK';
    }

    const tr = document.createElement('tr');
    tr.className = claseRow;
    tr.innerHTML = `
      <td>Dia ${dia}</td>
      <td>${formatNum(demanda)} unid.</td>
      <td>${formatNum(demandaPanico)} unid.</td>
      <td>${formatNum(restante)} unid.</td>
      <td><span class="badge-status badge-status--${estadoBadge}">${labelBadge}</span></td>
    `;
    cuerpoTabla.appendChild(tr);

    if (stockAntes <= 0) break;
  }

  tablaPlaceholder.hidden = true;
  tablaWrapper.hidden = false;
}

function limpiar() {
  [inputDemandaNormal, inputPorcentajeRumor, inputStockDisponible, inputNumFamilias].forEach(inp => {
    inp.value = '';
    inp.classList.remove('input--error');
  });

  Object.values(errores).forEach(el => { el.textContent = ''; });

  placeholderResultados.hidden = false;
  contenidoResultados.hidden = true;
  tarjetasResultado.innerHTML = '';
  alertaEstado.innerHTML = '';
  bloqueComparacion.innerHTML = '';

  tablaPlaceholder.hidden = false;
  tablaWrapper.hidden = true;
  cuerpoTabla.innerHTML = '';
}

const casosDatos = {
  1: { demanda: 200,  porcentaje: 80,  stock: 1500, familias: 60  },
  2: { demanda: 500,  porcentaje: 200, stock: 2000, familias: 150 },
  3: { demanda: 80,   porcentaje: 300, stock: 600,  familias: 30  },
};

document.querySelectorAll('.btn--case').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = parseInt(btn.dataset.caso);
    const c = casosDatos[num];
    if (!c) return;

    inputDemandaNormal.value   = c.demanda;
    inputPorcentajeRumor.value = c.porcentaje;
    inputStockDisponible.value = c.stock;
    inputNumFamilias.value     = c.familias;

    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
    setTimeout(calcular, 400);
  });
});

btnCalcular.addEventListener('click', calcular);
btnLimpiar.addEventListener('click', limpiar);

[inputDemandaNormal, inputPorcentajeRumor, inputStockDisponible, inputNumFamilias].forEach(inp => {
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') calcular();
  });
  inp.addEventListener('input', () => {
    const campo = inp.id;
    if (errores[campo]) limpiarError(campo);
  });
});