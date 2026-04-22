<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWatchlistStore } from '../stores/watchlistStore'
import { getQuote } from '../services/stockApi'

const router = useRouter()
const watchlistStore = useWatchlistStore()
const quotes = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

function getChangeClass(change) {
  if (change > 0) {
    return 'green'
  }

  if (change < 0) {
    return 'red'
  }

  return ''
}

async function loadQuotes() {
  watchlistStore.loadWatchlist()
  errorMessage.value = ''

  if (watchlistStore.watchlist.length === 0) {
    quotes.value = []
    return
  }

  isLoading.value = true

  const results = await Promise.allSettled(
    watchlistStore.watchlist.map((symbol) => getQuote(symbol))
  )

  quotes.value = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)

  const failedResult = results.find((result) => result.status === 'rejected')

  if (failedResult) {
    errorMessage.value = failedResult.reason.message
  }

  isLoading.value = false
}

function goToStock(symbol) {
  router.push(`/stock/${symbol}`)
}

onMounted(() => {
  loadQuotes()
})
</script>

<template>
  <main>
    <h1>My Watchlist</h1>

    <p v-if="isLoading">Loading watchlist...</p>
    <p v-else-if="watchlistStore.watchlist.length === 0">Your watchlist is empty.</p>
    <p v-else-if="errorMessage && quotes.length === 0">{{ errorMessage }}</p>
    <p v-else-if="quotes.length === 0">No quote data available.</p>

    <p v-if="!isLoading && errorMessage && quotes.length > 0">{{ errorMessage }}</p>

    <div v-if="!isLoading && quotes.length > 0" class="card-list">
      <div
        v-for="stock in quotes"
        :key="stock.symbol"
        class="card stock-card"
        role="button"
        tabindex="0"
        @click="goToStock(stock.symbol)"
      >
        <div class="row">
          <h2>{{ stock.symbol }}</h2>
          <p>${{ stock.price }}</p>
        </div>

        <div class="row change-row" :class="getChangeClass(stock.change)">
          <p>{{ stock.change }}</p>
          <p>{{ stock.percentChange }}</p>
        </div>

        <p class="updated-text">Last updated: {{ stock.lastUpdated }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-list {
  display: grid;
  gap: 1rem;
}

.stock-card {
  display: grid;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.change-row {
  justify-content: flex-start;
  gap: 1rem;
}

.updated-text {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
