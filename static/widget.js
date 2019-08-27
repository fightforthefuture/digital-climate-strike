(function() {
  'use strict';
  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';
  var CLOSED_COOKIE = '_DIGITAL_CLIMATE_STRIKE_WIDGET_CLOSED_';
  var NOW = new Date();
  var MS_PER_DAY = 86400000;

  var MONTHS_IN_EN = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  var MONTHS_IN_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  var MONTHS_IN_DE = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  var LANGUAGE_MONTHS_TRANSLATION_MAPPING = {
    en: MONTHS_IN_EN,
    es: MONTHS_IN_ES,
    de: MONTHS_IN_DE
  }

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://assets.digitalclimatestrike.net';
  var websiteName = options.websiteName || null;
  var footerDisplayStartDate = options.footerDisplayStartDate || new Date();                                   // Today
  var fullPageDisplayStartDate = options.fullPageDisplayStartDate || new Date(2019, 8, 20);  // September 20th, 2019
  var forceFullPageWidget = !!options.forceFullPageWidget;
  var cookieExpirationDays = parseFloat(options.cookieExpirationDays || 1);
  var alwaysShowWidget = !!(options.alwaysShowWidget || window.location.hash.indexOf('ALWAYS_SHOW_DIGITAL_CLIMATE_STRIKE') !== -1);
  var disableGoogleAnalytics = !!options.disableGoogleAnalytics;
  var showCloseButtonOnFullPageWidget = !!options.showCloseButtonOnFullPageWidget;
  var language = getLanguage();

  function onIframeLoad() {
    var fullscreenDisplayDate = monthName(fullPageDisplayStartDate.getMonth()) + ' ' + fullPageDisplayStartDate.getDate();
    var nextDay = new Date(fullPageDisplayStartDate.getFullYear(), fullPageDisplayStartDate.getMonth(), fullPageDisplayStartDate.getDate() + 1);
    var nextDayDisplayDate = monthName(nextDay.getMonth()) + ' ' + nextDay.getDate();
    var iframe = document.getElementById(DOM_ID).getElementsByTagName('iframe')[0].contentWindow.document;
    iframe.getElementById('dcs-strike-date').innerText = fullscreenDisplayDate;
    iframe.getElementById('dcs-tomorrow-date').innerText = nextDayDisplayDate;
  }

  function getIframeSrc() {
    var src = iframeHost;

    if (language === 'en') {
      src += '/index.html?';
    }
    else {
      src += '/index-' + language + '.html?';
    }

    src += 'language=' + language + '&';

    src += 'hostname=' + window.location.host + '&';

    if (forceFullPageWidget || todayIs(fullPageDisplayStartDate.getFullYear(), fullPageDisplayStartDate.getMonth() + 1, fullPageDisplayStartDate.getDate())) {
      src += 'forceFullPageWidget=true&';
    }

    if (showCloseButtonOnFullPageWidget) {
      src += 'showCloseButtonOnFullPageWidget=true&';
    }

    if (disableGoogleAnalytics) {
      src += 'googleAnalytics=false&';
    }

    if (websiteName) {
      src += 'websiteName=' + encodeURI(websiteName);
    }

    return src.replace(/(\?|&)$/, '');
  }

  function createIframe() {
    var wrapper = document.createElement('div');
    wrapper.id = DOM_ID;
    var iframe = document.createElement('iframe');
    iframe.src = getIframeSrc();
    iframe.frameBorder = 0;
    iframe.allowTransparency = true;
    iframe.onload = onIframeLoad;
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function todayIs(y, m, d) {
    var date = new Date();
    var offset = 4; // EDT
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60 - offset);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return (year === y && month === m && day === d);
  }

  function monthName(monthIndex) {
    return LANGUAGE_MONTHS_TRANSLATION_MAPPING[language][monthIndex];
  }

  function getLanguage() {
    var language = 'en';

    // spanish is specified or no language is set and browser is set to spanish
    if (options.language === 'es' || (!options.language && navigator && navigator.language.match(/^es/))) {
      language = 'es';
    }

    // spanish is specified or no language is set and browser is set to German
    if (options.language === 'de' || (!options.language && navigator && navigator.language.match(/^de/))) {
      language = 'de';
    }

    return language;
  }

  function maximize() {
    document.getElementById(DOM_ID).style.width = '100%';
    document.getElementById(DOM_ID).style.height = '100%';
  }

  function closeWindow() {
    document.getElementById(DOM_ID).remove();
    window.removeEventListener('message', receiveMessage);
    setCookie(CLOSED_COOKIE, 'true', cookieExpirationDays);
  }

  function navigateToLink(linkUrl) {
    document.location = linkUrl;
  }

  function injectCSS(id, css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    }
    else {
      style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
  }

  function setCookie(name, value, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime()+(expirationDays*24*60*60*1000));

    var expires = 'expires='+d.toGMTString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
  }

  function getCookie(cookieName) {
    var name = cookieName + '=';
    var ca = document.cookie.split(';');
    var c;

    for(var i = 0; i < ca.length; i++) {
      c = ca[i].trim();
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return '';
  }

  function receiveMessage(event) {
    if (!event.data.DIGITAL_CLIMATE_STRIKE) return;

    switch (event.data.action) {
      case 'maximize':
        return maximize();
      case 'closeButtonClicked':
        return closeWindow();
      case 'buttonClicked':
        return navigateToLink(event.data.linkUrl);
    }
  }

  /**
   * There are a few circumstances when the iFrame should not be shown:
   * 1. When the CLOSED_COOKIE has been set on that device
   * 2. We haven't reached either display start date
   * 3. We're past the date to display the full screen widget.
   * 4. We haven't set alwaysShowWidget to be true in the config.
   */
  function iFrameShouldNotBeShown() {
    return (footerDisplayStartDate > NOW && fullPageDisplayStartDate > NOW)
      || new Date(fullPageDisplayStartDate.getTime() + MS_PER_DAY) < NOW
      || !!getCookie(CLOSED_COOKIE)
      && !alwaysShowWidget;
  }

  function initializeInterface() {
    if (iFrameShouldNotBeShown()) {
      return;
    }

    createIframe();

    var iFrameHeight = getIframeHeight();

    injectCSS('DIGITAL_STRIKE_CSS',
      '#' + DOM_ID + ' { position: fixed; right: 0; left: 0; bottom: 0px; width: 100%; height: ' + iFrameHeight + '; z-index: 20000; -webkit-overflow-scrolling: touch; overflow: hidden; } ' +
      '#' + DOM_ID + ' iframe { width: 100%; height: 100%; }'
    );

    // listen for messages from iframe
    window.addEventListener('message', receiveMessage);

    document.removeEventListener('DOMContentLoaded', initializeInterface);
  }

  function getIframeHeight() {

    var isProbablyMobile = window.innerWidth < 600;

    if (isProbablyMobile) {
      return '200px';
    } else {
      return '145px';
    }
  }

  // Wait for DOM content to load.
  switch(document.readyState) {
    case 'complete':
    case 'loaded':
    case 'interactive':
      initializeInterface();
      break;
    default:
      document.addEventListener('DOMContentLoaded', initializeInterface);
  }
})();
