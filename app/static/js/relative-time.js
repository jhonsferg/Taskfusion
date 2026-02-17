// Web Component para fechas relativas en español (estilo GitHub)
class RelativeTime extends HTMLElement {
  constructor() {
    super();
    this._datetime = null;
    this._timer = null;
  }

  static get observedAttributes() {
    return ['datetime'];
  }

  connectedCallback() {
    this._updateTime();
    // Actualizar cada minuto
    this._timer = setInterval(() => this._updateTime(), 60000);
  }

  disconnectedCallback() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'datetime' && oldValue !== newValue) {
      this._datetime = newValue;
      this._updateTime();
    }
  }

  _updateTime() {
    const datetime = this.getAttribute('datetime');
    if (!datetime) {
      this.textContent = 'Sin fecha';
      return;
    }

    const date = new Date(datetime);
    if (isNaN(date.getTime())) {
      this.textContent = 'Fecha inválida';
      return;
    }

    // Usar Intl.RelativeTimeFormat nativo para español
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffWeek = Math.round(diffDay / 7);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    let text;
    if (Math.abs(diffSec) < 60) {
      text = rtf.format(diffSec, 'second');
    } else if (Math.abs(diffMin) < 60) {
      text = rtf.format(diffMin, 'minute');
    } else if (Math.abs(diffHour) < 24) {
      text = rtf.format(diffHour, 'hour');
    } else if (Math.abs(diffDay) < 7) {
      text = rtf.format(diffDay, 'day');
    } else if (Math.abs(diffWeek) < 4) {
      text = rtf.format(diffWeek, 'week');
    } else if (Math.abs(diffMonth) < 12) {
      text = rtf.format(diffMonth, 'month');
    } else {
      text = rtf.format(diffYear, 'year');
    }

    this.textContent = text;
    
    // Agregar atributo title con fecha completa
    this.setAttribute('title', date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }
}

// Registrar el web component
customElements.define('relative-time', RelativeTime);
