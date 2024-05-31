<template>
  <UContainer class="max-w-xl mt-5">
    <UDivider label="Admin Giriş" />
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="login">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Şifre" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit">
        Giriş
      </UButton>
    </UForm>
  </UContainer>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'
import { doc, collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { useFirestore } from 'vuefire';
const db = useFirestore();
const route = useRouter();

const state = reactive({
  email: undefined,
  password: undefined
})
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}
async function login(form:any) {
  try {
    //check if the user is an admin
    const admin = query(
      collection(db, 'admin'),
      where('email', '==', form.data.email),
    );
    const adminDoc = await getDocs(admin);
    if (adminDoc.empty) {
      alert('Bu email adresiyle kayıtlı bir admin bulunamadı.');
      return;
    }
    route.push('/admin/dashboard');
  } catch (error) {
    console.error("Error signing in: ", error);
    alert('Giriş başarısız, lütfen bilgilerinizi kontrol edin.');
  }
}
</script>
