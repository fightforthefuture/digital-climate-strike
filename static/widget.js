(function() {
  'use strict';
  var DOM_ID = 'DIGITAL_CLIMATE_STRIKE';

  // user-configurable options
  var options = window.DIGITAL_CLIMATE_STRIKE_OPTIONS || {};
  var websiteName = window.WEBSITE_NAME || null;
  var iframeHost = options.iframeHost !== undefined ? options.iframeHost : 'https://globalclimatestrike.net';
  var forceFullPageWidget = !!options.forceFullPageWidget;

  function setWebsiteName() {
    if (websiteName) {
      var websiteNameEls = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByClassName('dcs-website-name');
      for (var i = 0; i < websiteNameEls.length; i++) {
        websiteNameEls[i].innerText = websiteName;
      }
    }
  }

  function getIframeSrc() {
    var src = iframeHost + '/index.html?';

    if (forceFullPageWidget) {
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
    iframe.onload = setWebsiteName;
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
