<script setup>
import { ref } from 'vue'
import { searchStocks } from '../services/stockApi'
import { useWatchlistStore } from '../stores/watchlistStore'

const query = ref('')
const results = ref([])
const isLoading = ref(false)
const hasSearched = ref(false)
const watchlistStore = useWatchlistStore()

async function handleSearch() {
  hasSearched.value = true
  isLoading.value = true

  results.value = await searchStocks(query.value)

  isLoading.value = false
}

function addToWatchlist(symbol) {
  watchlistStore.addSymbol(symbol)
}
</script>

<template>
  <main>
    <h1>Search Stocks</h1>

    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Enter ticker or company name"
        @keyup.enter="handleSearch"
      />
      <button type="button" @click="handleSearch" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </div>

    <p v-if="isLoading">Loading results...</p>
    <p v-else-if="hasSearched && results.length === 0">No stocks found.</p>

    <ul v-else-if="results.length > 0">
      <li v-for="stock in results" :key="stock.symbol">
        <strong>{{ stock.symbol }}</strong>
        -
        <span>{{ stock.name }}</span>
        <button type="button" @click="addToWatchlist(stock.symbol)">Add to Watchlist</button>
      </li>
    </ul>
  </main>
</template>
