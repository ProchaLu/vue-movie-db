<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  background: #222;
  color: #fff;
  padding: 1rem;
  display: flex;
  gap: 2rem;
}
.navbar a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}
</style>
