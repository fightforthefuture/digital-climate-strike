import './main.css'

let isMaximizing = false

function maximize() {
  if (isMaximizing) return
  isMaximizing = true
  postMessage('maximize')
  const stickyFooter = document.querySelector('.dcs-footer')
  stickyFooter.style.display = 'none'

  const fullPage = document.querySelector('.dcs-full-page')
  fullPage.style.display = 'flex'
}

function todayIs(y, m, d) {
  const date = new Date()
  const offset = 4 // EDT
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60 - offset)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return (year === y && month === m && day === d)
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
  postMessage('closeButtonClicked')
}

function handleJoinStrikeButtonClick(event) {
  event.preventDefault()
  event.stopPropagation()
  postMessage('buttonClicked')
}

function attachEvent(selector, event, callback) {
  var elements = document.querySelectorAll(selector)
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener(event, callback)
  }
}

function initializeInterface() {

  const query = parseQuery(location.search)

  attachEvent('.dcs-close', 'click', handleCloseButtonClick)
  attachEvent('.dcs-button', 'click', handleJoinStrikeButtonClick)

  const isDayOfAction = todayIs(2019, 8, 19)

  if (query.fullPage || isDayOfAction) {
    maximize()
  }
}
document.addEventListener('DOMContentLoaded', initializeInterface)
