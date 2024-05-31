// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-vuefire", "@nuxt/ui"],
  vuefire: {
    config: {
      apiKey: "AIzaSyBgR4pomHxm6sUN0WgKyYKKwyVFeEttga8",
      authDomain: "cekilis-ab2a9.firebaseapp.com",
      projectId: "cekilis-ab2a9",
      storageBucket: "cekilis-ab2a9.appspot.com",
      messagingSenderId: "645012041406",
      appId: "1:645012041406:web:aad152e7ac6a6654adb8ef",
      measurementId: "G-6NTDE522V6"
    },
  },
  pages: true,
})