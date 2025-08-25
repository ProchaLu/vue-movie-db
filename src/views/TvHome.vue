<template>
  <main>
    <section>
      <h1>Neueste TV-Serien</h1>
      <div class="tv-list">
        <div v-for="tv in tvSeries" :key="tv.id" class="tv-card">
          <router-link :to="`/tv/${tv.id}`">
            <img :src="getPosterUrl(tv.poster_path)" alt="Poster" />
            <h2>{{ tv.name }}</h2>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type TvSeries = {
  id: number
  name: string
  poster_path: string | null
}

const tvSeries = ref<TvSeries[]>([])

function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=de-DE&page=1`)
  const data = await res.json()
  tvSeries.value = data.results.slice(0, 20)
})
</script>

<style scoped>
.tv-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
}
.tv-card {
  background: #222;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  text-align: center;
}
.tv-card img {
  width: 100%;
  height: 270px;
  object-fit: cover;
}
.tv-card h2 {
  font-size: 1rem;
  margin: 0.5rem 0;
}
</style>
