<template>
  <div v-if="tv">
    <h1>{{ tv.name }}</h1>
    <img :src="getPosterUrl(tv.poster_path)" alt="Poster" />
    <p>{{ tv.overview }}</p>
    <p><strong>Erstausstrahlung:</strong> {{ tv.first_air_date }}</p>
    <router-link to="/tv">Zurück</router-link>
  </div>
  <div v-else>
    <p>Lade TV-Serien-Daten ...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

type TvDetail = {
  id: number
  name: string
  poster_path: string | null
  overview: string
  first_air_date: string
}

const route = useRoute()
const tv = ref<TvDetail | null>(null)

function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/tv/${route.params.id}?api_key=${apiKey}&language=de-DE`)
  tv.value = await res.json()
})
</script>

<style scoped>
img {
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
