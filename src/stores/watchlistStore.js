import { defineStore } from 'pinia'

const STORAGE_KEY = 'watchlist'

export const useWatchlistStore = defineStore('watchlist', {
  state: () => ({
    watchlist: [],
  }),

  actions: {
    addSymbol(symbol) {
      const normalizedSymbol = symbol.trim().toUpperCase()

      if (!normalizedSymbol || this.watchlist.includes(normalizedSymbol)) {
        return
      }

      this.watchlist.push(normalizedSymbol)
      this.saveWatchlist()
    },

    removeSymbol(symbol) {
      const normalizedSymbol = symbol.trim().toUpperCase()

      this.watchlist = this.watchlist.filter((item) => item !== normalizedSymbol)
      this.saveWatchlist()
    },

    loadWatchlist() {
      const savedWatchlist = localStorage.getItem(STORAGE_KEY)

      if (!savedWatchlist) {
        this.watchlist = []
        return
      }

      try {
        const parsedWatchlist = JSON.parse(savedWatchlist)
        this.watchlist = Array.isArray(parsedWatchlist) ? parsedWatchlist : []
      } catch (error) {
        console.error('Failed to load watchlist:', error)
        this.watchlist = []
      }
    },

    saveWatchlist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.watchlist))
    },
  },
})
