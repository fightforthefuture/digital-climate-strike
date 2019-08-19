(function() {
  'use strict';
  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';
  var closedCookie = '_DIGITAL_CLIMATE_STRIKE_WIDGET_CLOSED_';

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://assets.digitalclimatestrike.net';
  var forceFullPageWidget = !!options.forceFullPageWidget;
  var cookieExpirationDays = parseFloat(options.cookieExpirationDays || 1);
  var alwaysShowWidget = !!(options.alwaysShowWidget || window.location.hash.indexOf('ALWAYS_SHOW_DIGITAL_CLIMATE_STRIKE') !== -1);

  function getIframeSrc() {
    var src = iframeHost + '/index.html?';

    if (forceFullPageWidget) {
      src += 'forceFullPageWidget=true&';
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
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function maximize() {
    document.getElementById(DOM_ID).style.width = '100%';
    document.getElementById(DOM_ID).style.height = '100%';
  }

  function closeWindow() {
    document.getElementById(DOM_ID).remove();
    window.removeEventListener('message', receiveMessage);
    setCookie(closedCookie, 'true', cookieExpirationDays);
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

  function initializeInterface() {
    console.log(!getCookie(closedCookie))
    if (alwaysShowWidget || !getCookie(closedCookie)) {
      createIframe();

      var iFrameHeight = getIframeHeight();

      injectCSS('DIGITAL_STRIKE_CSS',
        '#' + DOM_ID + ' { position: fixed; right: 0; left: 0; bottom: 0px; width: 100%; height: ' + iFrameHeight + '; z-index: 20000; -webkit-overflow-scrolling: touch; overflow: hidden; } ' +
        '#' + DOM_ID + ' iframe { width: 100%; height: 100%; }'
      );

      // listen for messages from iframe
      window.addEventListener('message', receiveMessage);
    }

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
