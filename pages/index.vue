<template>
  <UContainer class="max-w-xl mt-5 justify-items-center justify-center">
    <img src="/jetkolay.png" alt="Desert" class=" object-cover justify-center" />
    <UDivider label="KATILIM FORMU" />
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="submitForm">
      <UFormGroup label="Ad" name="name">
        <UInput v-model="state.name" type="text" />
      </UFormGroup>
      <UFormGroup label="Soyad" name="surname">
        <UInput v-model="state.surname" type="text" />
      </UFormGroup>
      <UFormGroup label="Telefon" name="phone">
        <UInput v-model="state.phone" type="text" />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>
      <UFormGroup label="Ünvan" name="title">
        <UInput v-model="state.title" type="text" />
      </UFormGroup>
      <UFormGroup label="İlgilendiğiniz Ürün" name="favoriteProduct">
        <USelectMenu v-model="state.favoriteProduct" :options="options" multiple />
      </UFormGroup>

      <UButton type="submit">
        Çekilişe Katıl
      </UButton>
    </UForm>
  </UContainer>
</template>
<script lang="ts" setup>
import { doc, collection, addDoc, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { useFirestore } from 'vuefire';


import type { FormError, FormSubmitEvent } from '#ui/types'
const db = useFirestore();
const router = useRouter();
const options = ['E-Fatura', 'E-Defter', 'Mükellef Portal', 'E-Belge']
async function submitForm(form: any) {
  try {
    const user = query(
      collection(db, 'user'),
      where('name', '==', form.data.name),
      where('surname', '==', form.data.surname),
      where('email', '==', form.data.email),
    );
    const userDoc = await getDocs(user);
    if (userDoc.empty) {
      addDoc(collection(db, 'user'), {
        name: form.data.name,
        surname: form.data.surname,
        phone: form.data.phone,
        email: form.data.email,
        title: form.data.title ?? '',
        favoriteProduct: form.data.favoriteProduct ?? '',
        timestamp: Timestamp.now(),
      });
      router.push('/info');
    } else {
      alert('Bu isim, soyisim veya E-mail ile kayıtlı bir kullanıcı bulunmaktadır.');
    }

  } catch (error) {
    console.error("Error adding document: ", error);
    alert('Bir hata oluştu, lütfen tekrar deneyin.');
  }
}

const state = reactive({
  name: undefined,
  surname: undefined,
  phone: undefined,
  email: undefined,
  title: undefined,
  favoriteProduct: ref([]),
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Adınızı doldurmanız gerekiyor' })
  if (!state.surname) errors.push({ path: 'surname', message: 'Soyadınızı doldurmanız gerekiyor' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Telefonunuzu doldurmanız gerekiyor' })
  if (!state.email) errors.push({ path: 'email', message: 'E-Mail adresinizi doldurmanız gerekiyor' })
  return errors
}





</script>
