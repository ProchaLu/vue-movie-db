<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <img :src="getPosterUrl(movie.poster_path)" alt="Poster" />
    <p>{{ movie.overview }}</p>
    <p><strong>Release:</strong> {{ movie.release_date }}</p>
    <router-link to="/">Zurück</router-link>
  </div>
  <div v-else>
    <p>Lade Filmdaten ...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

type MovieDetail = {
  id: number
  title: string
  poster_path: string | null
  overview: string
  release_date: string
}

const route = useRoute()
const movie = ref<MovieDetail | null>(null)

function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/movie/${route.params.id}?api_key=${apiKey}&language=de-DE`)
  movie.value = await res.json()
})
</script>

<style scoped>
img {
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
