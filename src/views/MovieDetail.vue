<template>
  <div v-if="movie">
    <div
      class="tmdb-hero"
      :style="
        movie.backdrop_path
          ? `background-image: url(https://image.tmdb.org/t/p/original${movie.backdrop_path}); background-size: cover; background-position: center;`
          : ''
      "
    >
      <div class="tmdb-hero-dark"></div>
      <div class="tmdb-hero-content">
        <div class="tmdb-poster">
          <img :src="getPosterUrl(movie.poster_path)" alt="Poster" />
        </div>
        <div class="tmdb-info">
          <h1>{{ movie.title }}</h1>
          <div class="tmdb-meta-row">
            <span class="tmdb-rating">★ {{ movie.vote_average }} / 10</span>
            <span>{{ movie.genres.map((g) => g.name).join(', ') }}</span>
            <span>{{ movie.runtime }} min</span>
            <span>{{ movie.release_date }}</span>
          </div>
          <div class="tmdb-firms">
            <strong>Produktionsfirmen:</strong>
            {{ movie.production_companies.map((c) => c.name).join(', ') }}
          </div>
          <div class="tmdb-extra-row">
            <span v-if="movie.original_title"
              ><strong>Originaltitel:</strong> {{ movie.original_title }}</span
            >
            <span v-if="movie.original_language"
              ><strong>Sprache:</strong> {{ movie.original_language }}</span
            >
            <span v-if="movie.budget"
              ><strong>Budget:</strong> {{ movie.budget.toLocaleString('de-DE') }} $</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="tmdb-overview">
      <h2>Handlung</h2>
      <p>{{ movie.overview }}</p>
    </div>
    <h2 class="tmdb-cast-title">Schauspieler</h2>
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
    <router-link to="/" class="back-link">Zurück</router-link>
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
  backdrop_path: string | null
  original_title: string
  original_language: string
  budget: number
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
.hero {
  display: flex;
  gap: 2rem;
  background: linear-gradient(90deg, #222 60%, #333 100%);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  .hero img {
    width: 220px;
    height: 330px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
  .hero .info {
    flex: 1;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    justify-content: center;
  }

  .hero p {
    color: #ddd;
    font-size: 1.1rem;
  }
  .tmdb-hero {
    position: relative;
    min-height: 420px;
    background-size: cover;
    background-position: center;
    border-radius: 0 0 32px 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    margin-bottom: 2.5rem;
    overflow: hidden;
  }
  .tmdb-hero-dark {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(30, 30, 30, 0.92) 60%, rgba(30, 30, 30, 0.98) 100%);
    z-index: 1;
  }
  .tmdb-hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    gap: 2.5rem;
    padding: 3rem 2rem 2rem 2rem;
    align-items: flex-end;
  }
  .tmdb-poster {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 0 0 260px;
  }
  .tmdb-poster img {
    width: 260px;
    height: 390px;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(229, 9, 20, 0.25);
    border: 3px solid #e50914;
  }
  .tmdb-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    justify-content: flex-start;
  }
  .tmdb-info h1 {
    color: #fff;
    font-size: 2.7rem;
    margin-bottom: 0.2rem;
    font-weight: 700;
    text-shadow: 0 2px 12px #000;
  }
  .tmdb-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    font-size: 1.15rem;
    color: #ffb700;
    margin-bottom: 0.5rem;
  }
  .tmdb-rating {
    color: #e50914;
    font-weight: bold;
    font-size: 1.25rem;
  }
  .tmdb-firms {
    font-size: 1rem;
    color: #f3f3f3;
  }
  .tmdb-extra-row {
    font-size: 1rem;
    color: #bbb;
    margin-top: 0.5rem;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .tmdb-overview {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    margin: 2rem 2rem 1rem 2rem;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(229, 9, 20, 0.1);
    font-size: 1.18rem;
    color: #fff;
    text-shadow: 0 1px 6px #000;
  }
  .tmdb-overview h2 {
    color: #e50914;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }
  .tmdb-cast-title {
    margin: 2rem 2rem 0.5rem 2rem;
    color: #fff;
    font-size: 1.35rem;
    font-weight: 700;
    text-shadow: 0 1px 6px #000;
  }
  .cast-list {
    display: flex;
    gap: 2rem;
    margin: 0 2rem 2rem 2rem;
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  .actor-card {
    background: rgba(255, 255, 255, 0.13);
    color: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(229, 9, 20, 0.1);
    padding: 1rem;
    text-align: center;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
    backdrop-filter: blur(2px);
  }
  .actor-card:hover {
    transform: translateY(-4px) scale(1.07);
    box-shadow: 0 8px 32px rgba(229, 9, 20, 0.25);
  }
  .actor-card img {
    width: 90px;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 8px rgba(229, 9, 20, 0.18);
    border: 2px solid #e50914;
  }
  .no-img {
    width: 90px;
    height: 120px;
    background: #888;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #222;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
  .back-link {
    display: inline-block;
    margin: 0 2rem;
    color: #fff;
    background: #e50914;
    padding: 0.7rem 1.5rem;
    border-radius: 10px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(229, 9, 20, 0.18);
    transition: background 0.2s;
    font-size: 1.1rem;
  }
  .back-link:hover {
    background: #b0060f;
  }
  @media (max-width: 900px) {
    .tmdb-hero {
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      min-height: unset;
    }
    .tmdb-hero-overlay {
      flex-direction: column;
      gap: 1.2rem;
      padding: 1.2rem 1rem;
    }
    .tmdb-poster img {
      width: 160px;
      height: 240px;
    }
    .tmdb-info {
      padding: 1.2rem 1rem;
    }
    .tmdb-overview,
    .tmdb-cast-title,
    .cast-list {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
    .cast-list {
      gap: 1rem;
    }
  }
}
.meta .rating {
  color: #e50914;
  font-weight: bold;
  font-size: 1.2rem;
}
.firms {
  font-size: 0.95rem;
  color: #bbb;
}
.overview {
  background: rgba(40, 40, 40, 0.7);
  border-radius: 12px;
  margin: 2rem 2rem 1rem 2rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  font-size: 1.15rem;
}
.overview h2 {
  color: #e50914;
  margin-bottom: 0.5rem;
}
.cast-title {
  margin: 2rem 2rem 0.5rem 2rem;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
}
.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin: 0 2rem 2rem 2rem;
}
.actor-card {
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(229, 9, 20, 0.1);
  padding: 1rem;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(1.5px);
}
.actor-card:hover {
  transform: translateY(-4px) scale(1.06);
  box-shadow: 0 8px 32px rgba(229, 9, 20, 0.25);
}
.actor-card img {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 8px rgba(229, 9, 20, 0.18);
}
.no-img {
  width: 80px;
  height: 110px;
  background: #444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  margin-bottom: 0.5rem;
}
.back-link {
  display: inline-block;
  margin: 0 2rem;
  color: #fff;
  background: #e50914;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(229, 9, 20, 0.18);
  transition: background 0.2s;
}
.back-link:hover {
  background: #b0060f;
}
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
  .hero img {
    width: 160px;
    height: 240px;
  }
  .overview,
  .cast-title,
  .cast-list {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
</style>
