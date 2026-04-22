<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWatchlistStore } from '../stores/watchlistStore'
import { getQuote } from '../services/stockApi'

const props = defineProps({
  symbol: {
    type: String,
    default: '',
  },
})

const watchlistStore = useWatchlistStore()
const stock = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const normalizedSymbol = computed(() => props.symbol.trim().toUpperCase())
const isInWatchlist = computed(() => watchlistStore.watchlist.includes(normalizedSymbol.value))

function getChangeClass(change) {
  if (change > 0) {
    return 'green'
  }

  if (change < 0) {
    return 'red'
  }

  return ''
}

async function loadStock() {
  watchlistStore.loadWatchlist()

  if (!normalizedSymbol.value) {
    errorMessage.value = 'No stock symbol provided.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  stock.value = null

  try {
    const quote = await getQuote(normalizedSymbol.value)
    stock.value = quote
  } catch (error) {
    errorMessage.value = error.message || 'Unable to load stock data.'
  }

  isLoading.value = false
}

function addToWatchlist() {
  watchlistStore.addSymbol(normalizedSymbol.value)
}

function removeFromWatchlist() {
  watchlistStore.removeSymbol(normalizedSymbol.value)
}

onMounted(() => {
  loadStock()
})
</script>

<template>
  <main>
    <h1>Stock Details</h1>

    <p v-if="isLoading">Loading stock data...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else-if="stock">
      <h2>{{ stock.symbol }}</h2>
      <p>Price: {{ stock.price }}</p>
      <p :class="getChangeClass(stock.change)">Change: {{ stock.change }}</p>
      <p :class="getChangeClass(stock.change)">Percent Change: {{ stock.percentChange }}</p>
      <p>Last Updated: {{ stock.lastUpdated }}</p>

      <button v-if="!isInWatchlist" type="button" @click="addToWatchlist">Add to Watchlist</button>
      <button v-else type="button" @click="removeFromWatchlist">Remove from Watchlist</button>
    </div>
  </main>
</template>

<style scoped>
</style>
