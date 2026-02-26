(function () {
  const portalEntry = '/portal/login'
  const selectors = [
    '[data-cal-url]',
    '[data-open-embed]',
    'a[href*="calendly.com"]',
    'a[href*="buy.stripe.com"]',
    'button[data-cal-url]',
    'button[data-open-embed]',
  ]

  const shouldSkip = (element) =>
    element.dataset.portalExempt === 'true' ||
    (element.closest('[data-portal-exempt="true"]') ? true : false)

  const reroute = (element) => {
    if (element.dataset.portalReady === 'true') return
    if (shouldSkip(element)) return
    element.dataset.portalReady = 'true'

    if (element.tagName === 'A') {
      element.setAttribute('href', portalEntry)
      element.removeAttribute('target')
      element.removeAttribute('rel')
    }

    element.addEventListener('click', (event) => {
      event.preventDefault()
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation()
      }
      window.location.href = portalEntry
    })
  }

  const init = () => {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(reroute)
    })

    const bookBtn = document.getElementById('calendly-button')
    if (bookBtn && !shouldSkip(bookBtn)) {
      reroute(bookBtn)
    }

    const consultantSelect = document.getElementById('consultant-select')
    if (consultantSelect) {
      consultantSelect.addEventListener('change', (event) => {
        const value = event.target.value
        if (value) {
          window.location.href = `${portalEntry}?consultant=${encodeURIComponent(value)}`
        }
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
