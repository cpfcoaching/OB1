import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'
import { ANALYTICS_CONFIG, getAnalyticsEnabled } from './config/analytics'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

const app = createApp(App)

// Initialize Google Analytics
if (getAnalyticsEnabled() && ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID.startsWith('G-')) {
  // Initialize gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID}`
  document.head.appendChild(script)

  // Configure gtag after script loads
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID)
}

// Initialize LinkedIn Pixel
if (typeof window !== 'undefined') {
  ;(() => {
    (window as any)._linkedin_partner_id = ANALYTICS_CONFIG.LINKEDIN_PARTNER_ID
    ;(window as any)._linkedin_data_partner_ids = (window as any)._linkedin_data_partner_ids || []
    ;(window as any)._linkedin_data_partner_ids.push((window as any)._linkedin_partner_id)
  })()

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
  document.head.appendChild(script)

  ;(window as any).lintrk = function(a: string, b: any) {
    ;(window as any).lintrk.q.push([a, b])
  }
  ;(window as any).lintrk.q = []
}

app.use(router)
app.mount('#app')
