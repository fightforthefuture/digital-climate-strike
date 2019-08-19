(function() {
  'use strict';
  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';
  var CLOSED_COOKIE = '_DIGITAL_CLIMATE_STRIKE_WIDGET_CLOSED_';
  var NOW = new Date();
  var MS_PER_DAY = 86400000;

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://assets.digitalclimatestrike.net';
  var websiteName = options.websiteName || null;
  var footerDisplayStartDate = options.footerDisplayStartDate || new Date();                                   // Today
  var fullPageDisplayStartDate = options.fullPageDisplayStartDate || new Date(2019, 8, 20);  // September 20th, 2019
  var forceFullPageWidget = !!options.forceFullPageWidget;
  var cookieExpirationDays = parseFloat(options.cookieExpirationDays || 1);
  var alwaysShowWidget = !!(options.alwaysShowWidget || window.location.hash.indexOf('ALWAYS_SHOW_DIGITAL_CLIMATE_STRIKE') !== -1);
  var showCloseButtonOnFullPageWidget = !!options.showCloseButtonOnFullPageWidget;

  function onIframeLoad() {
    var fullscreenDisplayDate = monthName(fullPageDisplayStartDate.getMonth()) + ' ' + fullPageDisplayStartDate.getDate();
    var nextDay = new Date(fullPageDisplayStartDate.getFullYear(), fullPageDisplayStartDate.getMonth(), fullPageDisplayStartDate.getDate() + 1);
    var nextDayDisplayDate = monthName(nextDay.getMonth()) + ' ' + nextDay.getDate();
    var iframe = document.getElementById(DOM_ID).getElementsByTagName('iframe')[0].contentWindow.document;
    iframe.getElementById('dcs-strike-date').innerText = fullscreenDisplayDate;
    iframe.getElementById('dcs-tomorrow-date').innerText = nextDayDisplayDate;
  }

  function getIframeSrc() {
    var src = iframeHost + '/index.html?';

    if (forceFullPageWidget || todayIs(fullPageDisplayStartDate.getFullYear(), fullPageDisplayStartDate.getMonth() + 1, fullPageDisplayStartDate.getDate())) {
      src += 'forceFullPageWidget=true&';
    }

    if (showCloseButtonOnFullPageWidget) {
      src += 'showCloseButtonOnFullPageWidget=true&';
    }

    if (websiteName) {
      src += 'websiteName=' + websiteName;
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
    const date = new Date();
    const offset = 4; // EDT
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60 - offset);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return (year === y && month === m && day === d);
  }

  function monthName(monthIndex) {
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
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

  function navigateToLink() {
    document.location ='https://globalclimatestrike.net';
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
        return navigateToLink();
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
      return '175px';
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
