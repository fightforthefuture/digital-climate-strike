import './main.css'

const MS_PER_DAY = 86400000;
const GOOGLE_ANALYTICS_DELAY_MS = 30
const GLOBAL_CLIMATE_STRIKE_URLS = {
  en: 'https://globalclimatestrike.net/?source=digitalstrikebanner',
  es: 'https://es.globalclimatestrike.net/?source=digitalstrikebanner',
  de: 'https://de.globalclimatestrike.net/?source=digitalstrikebanner',
  cs: 'https://www.tydenproklima.cz',
}

const LOCALE_CODE_MAPPING = {
  en: 'en-EN',
  de: 'de-DE',
  es: 'es-ES',
  cs: 'cs-CZ'
}

let isMaximizing = false
let language = 'en'

function maximize() {
  if (isMaximizing) return
  isMaximizing = true
  postMessage('maximize')
  const stickyFooter = document.querySelector('.dcs-footer')
  stickyFooter.style.display = 'none'

  const fullPage = document.querySelector('.dcs-full-page')
  fullPage.style.display = 'flex'
}

function showCloseButtonOnFullPageWidget() {
  const fullPageWidget = document.querySelector('.dcs-full-page')
  fullPageWidget.style.background = 'rgba(78,229,139, 0.8)'

  const fullPageCloseButton = document.querySelector('.dcs-full-page__close')
  fullPageCloseButton.style.display = 'flex'

  const fullPageCloseButtonContent = document.querySelector('.dcs-close')
  fullPageCloseButtonContent.classList.add('dcs-full-page-close')

  const fullPageFooter = document.querySelector('.dcs-full-page__footer')
  fullPageFooter.style.display = 'none'
}

function handleCustomWebsiteName(websiteName) {
  const websiteNameDefault = document.querySelector('.dcs-website-name__default')
  websiteNameDefault.style.display = 'none'

  const websiteNamePrefix = document.querySelector('.dcs-website-name__prefix')
  websiteNamePrefix.style.display = 'inline-block'

  const websiteNameText = document.querySelector('.dcs-website-name')
  websiteNameText.innerHTML = decodeURI(websiteName)
}

function isTruthy(str) {
  return typeof(str) === 'undefined' || `${str}` === 'true' || `${str}` === '1'
}

function parseQuery(queryString) {
  var query = {}
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

function postMessage(action, data) {
  data || (data = {})
  data.action = action
  data.DIGITAL_CLIMATE_STRIKE = true
  window.parent.postMessage(data, '*')
}

function handleCloseButtonClick(event) {
  event.preventDefault()
  event.stopPropagation()

  //adding delay to allow google analytics call to complete
  setTimeout(() => {
    postMessage('closeButtonClicked')
  }, GOOGLE_ANALYTICS_DELAY_MS)
}

function handleJoinStrikeButtonClick(event) {
  event.preventDefault()
  event.stopPropagation()

  //adding delay to allow google analytics call to complete
  setTimeout(() => {
    postMessage('buttonClicked', { linkUrl: GLOBAL_CLIMATE_STRIKE_URLS[language] })
  }, GOOGLE_ANALYTICS_DELAY_MS)
}

function setGlobalClimateStrikeLinkUrl(selector) {
  const element = document.querySelector(selector)
  element.setAttribute('href', GLOBAL_CLIMATE_STRIKE_URLS[language])
}

function attachEvent(selector, event, callback) {
  var elements = document.querySelectorAll(selector)
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener(event, callback)
  }
}

function initGoogleAnalytics() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga')

  if (typeof window.ga !== 'undefined') {
    window.ga('create', 'UA-145982710-1', 'auto')
    window.ga('send', 'pageview')
  }
}

function addTrackingEvents(hostname, forceFullPageWidget) {
  attachEvent('.dcs-footer .dcs-button', 'click', () => trackEvent('footer-join-button', 'click', hostname))
  attachEvent('.dcs-footer .dcs-close', 'click', () => trackEvent('footer-close-button', 'click', hostname))
  attachEvent('.dcs-full-page .dcs-button', 'click', () => trackEvent('full-page-join-button', 'click', hostname))
  attachEvent('.dcs-full-page .dcs-close', 'click', () => trackEvent('full-page-close-button', 'click', hostname))

  if (forceFullPageWidget) {
    trackEvent('full-page-widget', 'load', hostname)
  } else {
    trackEvent('footer-widget', 'load', hostname)
  }
}

function trackEvent(category, action, label, value) {
  if (!window.ga) return

  const params = {
    hitType: 'event',
    eventCategory: category,
    eventAction: action
  }

  if (label) {
    params.eventLabel = label
  }

  if (value) {
    params.eventValue = value
  }
  window.ga('send', params)
}

function todayIs(date) {
  var today = new Date()
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

function getFormattedDate(date, language) {
  return date.toLocaleDateString(LOCALE_CODE_MAPPING[language], { day: 'numeric', month: 'long' })
}

function initializeInterface() {
  const query = parseQuery(location.search)
  const fullPageDisplayStartDate = new Date(Date.parse(query.fullPageDisplayStartDate))
  const fullPageDisplayStopDate = new Date(fullPageDisplayStartDate.getTime() + MS_PER_DAY)

  setGlobalClimateStrikeLinkUrl('.dcs-footer .dcs-button')
  setGlobalClimateStrikeLinkUrl('.dcs-footer__logo')
  setGlobalClimateStrikeLinkUrl('.dcs-full-page .dcs-button')
  setGlobalClimateStrikeLinkUrl('.dcs-full-page__logo')
  attachEvent('.dcs-close', 'click', handleCloseButtonClick)
  attachEvent('.dcs-button', 'click', handleJoinStrikeButtonClick)
  attachEvent('.dcs-footer__logo', 'click', handleJoinStrikeButtonClick)
  attachEvent('.dcs-full-page__logo', 'click', handleJoinStrikeButtonClick)

  language = query.language ? query.language : language

  if (query.showCloseButtonOnFullPageWidget) {
    showCloseButtonOnFullPageWidget()
  }

  if (query.websiteName) {
    handleCustomWebsiteName(query.websiteName)
  }

  if (isTruthy(query.googleAnalytics) && !navigator.doNotTrack) {
    initGoogleAnalytics()
    addTrackingEvents(query.hostname, query.forceFullPageWidget)
  }

  if (query.forceFullPageWidget || todayIs(fullPageDisplayStartDate)) {
    maximize()
  }

  // Set display dates on full-size widget
  var fullscreenDateString = getFormattedDate(fullPageDisplayStartDate, language)
  var nextDayDateString = getFormattedDate(fullPageDisplayStopDate, language)
  document.getElementById('dcs-strike-date').innerText = fullscreenDateString
  document.getElementById('dcs-tomorrow-date').innerText = nextDayDateString
}

document.addEventListener('DOMContentLoaded', initializeInterface)
