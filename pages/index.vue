<template>
  <UContainer class="max-w-xl mt-5">
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
const usersDataAll = [
  {
    "name": "Ayşe",
    "surname": "Yılmaz",
    "email": "ayse.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Mehmet",
    "surname": "Kaya",
    "email": "mehmet.kaya@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Fatma",
    "surname": "Şahin",
    "email": "fatma.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Mustafa",
    "surname": "Arslan",
    "email": "mustafa.arslan@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Emine",
    "surname": "Yıldız",
    "email": "emine.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ahmet",
    "surname": "Çelik",
    "email": "ahmet.celik@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Zeynep",
    "surname": "Koç",
    "email": "zeynep.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ali",
    "surname": "Demir",
    "email": "ali.demir@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hülya",
    "surname": "Yılmaz",
    "email": "hulya.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Osman",
    "surname": "Aydın",
    "email": "osman.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hatice",
    "surname": "Kurt",
    "email": "hatice.kurt@example.com",
    "phone": "+90555******"
  },
  {
    "name": "İbrahim",
    "surname": "Kaya",
    "email": "ibrahim.kaya@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Gül",
    "surname": "Öztürk",
    "email": "gul.ozturk@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hakan",
    "surname": "Şahin",
    "email": "hakan.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Sultan",
    "surname": "Yılmaz",
    "email": "sultan.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Serkan",
    "surname": "Koç",
    "email": "serkan.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Şerife",
    "surname": "Yıldız",
    "email": "serife.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "İsmail",
    "surname": "Aydın",
    "email": "ismail.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Nur",
    "surname": "Yılmaz",
    "email": "nur.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ayşegül",
    "surname": "Kurt",
    "email": "aysegul.kurt@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Mert",
    "surname": "Kaya",
    "email": "mert.kaya@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Sevilay",
    "surname": "Aydın",
    "email": "sevilay.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Cem",
    "surname": "Yıldız",
    "email": "cem.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Pınar",
    "surname": "Şahin",
    "email": "pinar.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Kerem",
    "surname": "Yılmaz",
    "email": "kerem.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ebru",
    "surname": "Koç",
    "email": "ebru.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Murat",
    "surname": "Kurt",
    "email": "murat.kurt@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hilal",
    "surname": "Yılmaz",
    "email": "hilal.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Yusuf",
    "surname": "Şahin",
    "email": "yusuf.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Gizem",
    "surname": "Kaya",
    "email": "gizem.kaya@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Şule",
    "surname": "Demir",
    "email": "sule.demir@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ömer",
    "surname": "Aydın",
    "email": "omer.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Esra",
    "surname": "Şahin",
    "email": "esra.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Berkay",
    "surname": "Yılmaz",
    "email": "berkay.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Feride",
    "surname": "Koç",
    "email": "feride.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Kadir",
    "surname": "Arslan",
    "email": "kadir.arslan@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Aslı",
    "surname": "Kurt",
    "email": "asli.kurt@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Tolga",
    "surname": "Yıldız",
    "email": "tolga.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Aylin",
    "surname": "Demir",
    "email": "aylin.demir@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Can",
    "surname": "Şahin",
    "email": "can.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Nazlı",
    "surname": "Koç",
    "email": "nazli.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Uğur",
    "surname": "Aydın",
    "email": "ugur.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Seda",
    "surname": "Yılmaz",
    "email": "seda.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Oğuz",
    "surname": "Şahin",
    "email": "oguz.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Derya",
    "surname": "Kurt",
    "email": "derya.kurt@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ercan",
    "surname": "Yıldız",
    "email": "ercan.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Büşra",
    "surname": "Aydın",
    "email": "busra.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Berk",
    "surname": "Koç",
    "email": "berk.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hande",
    "surname": "Yılmaz",
    "email": "hande.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ozan",
    "surname": "Şahin",
    "email": "ozan.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Şeyma",
    "surname": "Demir",
    "email": "seyma.demir@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Sercan",
    "surname": "Yıldız",
    "email": "sercan.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Ceren",
    "surname": "Koç",
    "email": "ceren.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Hüseyin",
    "surname": "Aydın",
    "email": "huseyin.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Gamze",
    "surname": "Yılmaz",
    "email": "gamze.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "İsmet",
    "surname": "Şahin",
    "email": "ismet.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "İlayda",
    "surname": "Demir",
    "email": "ilayda.demir@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Eren",
    "surname": "Koç",
    "email": "eren.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Pelin",
    "surname": "Yıldız",
    "email": "pelin.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Onur",
    "surname": "Aydın",
    "email": "onur.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Selma",
    "surname": "Yılmaz",
    "email": "selma.yilmaz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Yasin",
    "surname": "Şahin",
    "email": "yasin.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Selin",
    "surname": "Koç",
    "email": "selin.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Deniz",
    "surname": "Yıldız",
    "email": "deniz.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Okan",
    "surname": "Aydın",
    "email": "okan.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Begüm",
    "surname": "Şahin",
    "email": "begum.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Tolga",
    "surname": "Koç",
    "email": "tolga.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Zeynep",
    "surname": "Yıldız",
    "email": "zeynep.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Şükrü",
    "surname": "Aydın",
    "email": "sukru.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Cansu",
    "surname": "Şahin",
    "email": "cansu.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Kaan",
    "surname": "Koç",
    "email": "kaan.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Sibel",
    "surname": "Yıldız",
    "email": "sibel.yildiz@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Barış",
    "surname": "Aydın",
    "email": "baris.aydin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Nihal",
    "surname": "Şahin",
    "email": "nihal.sahin@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Burak",
    "surname": "Koç",
    "email": "burak.koc@example.com",
    "phone": "+90555******"
  },
  {
    "name": "Elif",
    "surname": "Yıldız",
    "email": "elif.yildiz@example.com",
    "phone": "+90555******"
  }

]


for (let index = 0; index < usersDataAll.length; index++) {
  addDoc(collection(db, 'user'), {
    name: usersDataAll[index].name,
    surname: usersDataAll[index].surname,
    phone: usersDataAll[index].phone,
    email: usersDataAll[index].email
  });

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
