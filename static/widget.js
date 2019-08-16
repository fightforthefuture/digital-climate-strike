(function() {
  'use strict';
  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';
  var NOW = new Date();
  var MS_PER_DAY = 86400000;

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var footerDate = window.FOOTER_DISPLAY_START_DATE || new Date(2019, 8, 1);    // September 1st, 2019
  var fullscreenDate = window.FULL_PAGE_DISPLAY_DATE || new Date(2019, 8, 20);  // September 20th, 2019
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://globalclimatestrike.net';
  var forceFullPageWidget = !!options.forceFullPageWidget;

  function getIframeSrc() {
    var src = iframeHost + '/index.html?';

    if (forceFullPageWidget || todayIs(fullscreenDate.getFullYear(), fullscreenDate.getMonth() + 1, fullscreenDate.getDate())) {
      src += 'fullPage=true&';
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

  function todayIs(y, m, d) {
    const date = new Date();
    const offset = 4; // EDT
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60 - offset);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return (year === y && month === m && day === d);
  }

  function maximize() {
    document.getElementById(DOM_ID).style.width = '100%';
    document.getElementById(DOM_ID).style.height = '100%';
  }

  function closeWindow() {
    document.getElementById(DOM_ID).remove();
    window.removeEventListener('message', receiveMessage);
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

  function receiveMessage(event) {
    if (!event.data.DIGITAL_CLIMATE_STRIKE) return;

    switch (event.data.action) {
      case 'maximize':
        return maximize();
      case 'closeWindow':
        return closeWindow();
    }
  }

  function initializeInterface() {

    // If we haven't reached either display date, or we're past the day where we displayed the
    // fullscreen widget, don't show the iframe
    if ((footerDate > NOW && fullscreenDate > NOW) || new Date(fullscreenDate.getTime() + MS_PER_DAY) < NOW) {
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
