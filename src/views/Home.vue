<template>
  <main>
    <section>
      <h1>Neueste Filme</h1>
      <div class="movie-list">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <router-link :to="`/movie/${movie.id}`">
            <img :src="getPosterUrl(movie.poster_path)" alt="Poster" />
            <h2>{{ movie.title }}</h2>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type Movie = {
  id: number
  title: string
  poster_path: string | null
}

const movies = ref<Movie[]>([])

function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=de-DE&page=1`)
  const data = await res.json()
  movies.value = data.results.slice(0, 20)
})
</script>

<style scoped>
main {
  max-width: 1200px;
  margin: 2rem auto;
}
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
}
.movie-card {
  background: #222;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  text-align: center;
}
.movie-card img {
  width: 100%;
  height: 270px;
  object-fit: cover;
}
.movie-card h2 {
  font-size: 1rem;
  margin: 0.5rem 0;
}
</style>
