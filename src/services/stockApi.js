const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
const BASE_URL = 'https://www.alphavantage.co/query'

async function fetchFromAlphaVantage(params) {
  if (!API_KEY) {
    throw new Error('Missing Alpha Vantage API key.')
  }

  const url = new URL(BASE_URL)

  Object.entries({
    ...params,
    apikey: API_KEY,
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch stock data.')
  }

  const data = await response.json()

  if (data['Error Message']) {
    throw new Error(data['Error Message'])
  }

  if (data.Note) {
    throw new Error('Alpha Vantage rate limit reached. Please try again soon.')
  }

  return data
}

export async function searchStocks(query) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  try {
    const data = await fetchFromAlphaVantage({
      function: 'SYMBOL_SEARCH',
      keywords: trimmedQuery,
    })

    const matches = data.bestMatches || []

    return matches.map((item) => ({
      symbol: item['1. symbol'],
      name: item['2. name'],
    }))
  } catch (error) {
    console.error('searchStocks error:', error)
    return []
  }
}

export async function getQuote(symbol) {
  const trimmedSymbol = symbol.trim().toUpperCase()

  if (!trimmedSymbol) {
    throw new Error('A stock symbol is required.')
  }

  const data = await fetchFromAlphaVantage({
    function: 'GLOBAL_QUOTE',
    symbol: trimmedSymbol,
  })

  const quote = data['Global Quote']

  if (!quote || Object.keys(quote).length === 0 || !quote['01. symbol']) {
    throw new Error(`No quote data found for ${trimmedSymbol}.`)
  }

  return {
    symbol: quote['01. symbol'],
    price: Number(quote['05. price']),
    change: Number(quote['09. change']),
    percentChange: quote['10. change percent'],
    lastUpdated: quote['07. latest trading day'],
  }
}

export default {
  searchStocks,
  getQuote,
}
