import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './style.css'
import router from './router'
import { useWatchlistStore } from './stores/watchlistStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const watchlistStore = useWatchlistStore(pinia)
watchlistStore.loadWatchlist()

app.mount('#app')
