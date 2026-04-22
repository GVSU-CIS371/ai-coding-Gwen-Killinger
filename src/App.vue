<template>
  <div>
    <header class="navbar">
      <div class="brand">Stock Watchlist</div>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/search">Search</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  background-color: #111827;
  color: #ffffff;
}

.brand {
  font-size: 1.1rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
}
</style>
