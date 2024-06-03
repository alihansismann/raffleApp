// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ["nuxt-vuefire", "@nuxt/ui"],
  vuefire: {
    config: {
      apiKey: "AIzaSyC_TyMf6pupq3vo4d2gIt6unkrBlbfhFS4",
      authDomain: "jetkolaycekilis.firebaseapp.com",
      projectId: "jetkolaycekilis",
      storageBucket: "jetkolaycekilis.appspot.com",
      messagingSenderId: "164345541183",
      appId: "1:164345541183:web:783b1eef8a656caa42fe8a",
      measurementId: "G-0YH2KP31QG"
    },
  },
  pages: true,
})