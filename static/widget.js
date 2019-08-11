(function() {
  'use strict';

  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://globalclimatestrike.net';


  function getIframeSrc() {
    var src = iframeHost + '/index.html?';
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

  function initializeInterface() {
    createIframe();

    document.removeEventListener('DOMContentLoaded', initializeInterface);
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
