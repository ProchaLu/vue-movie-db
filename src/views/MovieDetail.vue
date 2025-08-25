<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <div class="hero">
      <img :src="getPosterUrl(movie.poster_path)" alt="Poster" />
      <div class="info">
        <p><strong>Bewertung:</strong> {{ movie.vote_average }} / 10</p>
        <p><strong>Genres:</strong> {{ movie.genres.map((g) => g.name).join(', ') }}</p>
        <p><strong>Laufzeit:</strong> {{ movie.runtime }} min</p>
        <p><strong>Release:</strong> {{ movie.release_date }}</p>
        <p><strong>Tagline:</strong> {{ movie.tagline }}</p>
        <p>
          <strong>Produktionsfirmen:</strong>
          {{ movie.production_companies.map((c) => c.name).join(', ') }}
        </p>
      </div>
    </div>
    <p>{{ movie.overview }}</p>
    <h2>Schauspieler</h2>
    <div class="cast-list">
      <div v-for="actor in cast" :key="actor.id" class="actor-card">
        <img v-if="actor.profile_path" :src="getActorImg(actor.profile_path)" :alt="actor.name" />
        <div v-else class="no-img">Kein Bild</div>
        <div>
          <strong>{{ actor.name }}</strong
          ><br />
          <span>{{ actor.character }}</span>
        </div>
      </div>
    </div>
    <router-link to="/">Zurück</router-link>
  </div>
  <div v-else>
    <p>Lade Filmdaten ...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

type Genre = { id: number; name: string }
type Company = { id: number; name: string }
type MovieDetail = {
  id: number
  title: string
  poster_path: string | null
  overview: string
  release_date: string
  vote_average: number
  genres: Genre[]
  runtime: number
  tagline: string
  production_companies: Company[]
}
type Actor = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

const route = useRoute()
const movie = ref<MovieDetail | null>(null)
const cast = ref<Actor[]>([])

function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}
function getActorImg(path: string) {
  return `https://image.tmdb.org/t/p/w185${path}`
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=${apiKey}&language=de-DE`,
  )
  movie.value = await res.json()
  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/movie/${route.params.id}/credits?api_key=${apiKey}&language=de-DE`,
  )
  const credits = await creditsRes.json()
  cast.value = credits.cast.slice(0, 12)
})
</script>

<style scoped>
img {
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
