import { createSSRApp } from 'vue'
import cuCustom from './colorui/components/cu-custom.vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  app.component('cu-custom', cuCustom)

  return {
    app
  }
}