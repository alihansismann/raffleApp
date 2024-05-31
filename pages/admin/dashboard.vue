<template>
  <UContainer class="max-w-xl mt-5 text-center">
    <template v-if="loaded">
      <UDivider label="ÇEKİLİŞE KATILANLAR LİSTE" />
      <UTable :rows="joinRows" :columns="columns" />
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="pageUser" :page-count="pageCount" :total="people?.length ?? 0" />
      </div>
      <div class="pb-5">
        <UButton label="Çekiliş Yap!" @click="cekilis" />
      </div>
      <UDivider label="KAZANANLAR" class="pt-5" />
      <UTable loading :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Yükleniyor...' }"
        :progress="{ color: 'primary', animation: 'carousel' }" :rows="winnerRows" :columns="winColumns" />
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="pageWinner" :page-count="pageCount" :total="winnersList.length" />
      </div>
      <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

          <UDivider label="Kazanan Belirleniyor..." />
          <UCardBody>
            <!-- User random interval -->
            <span class="text-2xl font-bold">Kazanan: </span>
            <span v-text="randomUserInterval" />
            <br>
            <!-- User random interval -->
            <span class="text-xl font-bold">Hediye: </span>
            <span v-text="randomGiftInterval" />
          </UCardBody>
        </UCard>
      </UModal>
    </template>
    <template v-else>
      Yükleniyor...
    </template>
  </UContainer>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { doc, collection, addDoc, getDocs, query, where, DocumentSnapshot, onSnapshot, type DocumentData, QueryDocumentSnapshot, QuerySnapshot, } from 'firebase/firestore'
import { useFirestore } from 'vuefire';

const db = useFirestore();
const route = useRouter();
const loaded = ref(false);
const isOpen = ref(false)

const columns = [{
  key: 'name',
  label: 'İsim'
}, {
  key: 'surname',
  label: 'Soyisim'
}]

const winColumns = [{
  key: 'id',
  label: 'Sıra'
}, {
  key: 'name',
  label: 'İsim'
}, {
  key: 'surname',
  label: 'Soyisim'
}, {
  key: 'gift',
  label: 'Hediye'
}]

const pageUser = ref(1)
const pageWinner = ref(1)
const pageCount = 5

const joinRows = computed(() => {
  return people.value?.slice((pageUser.value - 1) * pageCount, (pageUser.value) * pageCount) || [];
})

const winnerRows = computed(() => {
  return winnersList.value.slice((pageWinner.value - 1) * pageCount, (pageWinner.value) * pageCount)
})


const giftsDocs = ref<DocumentSnapshot[]>([]);
const usersDocs = ref<DocumentSnapshot[]>([]);
const winnerDocs = ref<DocumentSnapshot[]>([]);

onMounted(async () => {
  await new Promise<void>((resolve) => {
    onSnapshot(collection(db, 'gifts'), (snapshot) => {
      giftsDocs.value = snapshot.docs;

      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    onSnapshot(collection(db, 'winners'), (snapshot) => {
      winnerDocs.value = snapshot.docs;

      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    onSnapshot(collection(db, 'user'), (snapshot) => {
      usersDocs.value = snapshot.docs;

      resolve();
    });
  });

  loaded.value = true;
});

const users = query(
  collection(db, 'user')
);

const people = computed(() => usersDocs.value?.map((doc) => {
  return {
    name: doc.data()?.name,
    surname: doc.data()?.surname,
    email: doc.data()?.email,
  }
}));

const winnersList = computed(() => winnerDocs.value.map((doc) => {
  return {
    id: doc.data()?.id,
    name: doc.data()?.name,
    surname: doc.data()?.surname,
    gift: doc.data()?.gift,
  }
}));

let usedGifts: DocumentSnapshot[] = [];
let winners: DocumentSnapshot[] = [];

function selectRandomUser() {
  const filteredUsers = usersDocs.value?.filter(user => !winners.find(winner => winner.id === user.id)) || [];
  const randomIndex = Math.floor(Math.random() * filteredUsers.length);
  const randomUser = filteredUsers[randomIndex];
  return randomUser;
}

function selectRandomGift() {
  const filteredGifts = giftsDocs.value.filter(gift => !usedGifts.find(usedGift => usedGift.id === gift.id));
  const randomGiftIndex = Math.floor(Math.random() * filteredGifts.length);
  const randomGift = filteredGifts[randomGiftIndex];
  return randomGift;
}

const randomUserInterval = ref('');
const randomGiftInterval = ref('');

let id = 0;
async function cekilis() {
  if (id === giftsDocs.value.length) {
    alert('Hediye kalmadı.');
    return;
  }

  isOpen.value = true;

  const randomUserIntervalHandler = setInterval(() => {
    randomUserInterval.value = selectRandomUser().data()?.name + ' ' + selectRandomUser().data()?.surname;
  }, 50);

  let randomUser: DocumentSnapshot;
  let randomGift: DocumentSnapshot;

  randomGift = selectRandomGift();
  randomGiftInterval.value = randomGift.data()?.label;

  // Select random user
  setTimeout(async () => {
    // Clear interval
    clearInterval(randomUserIntervalHandler);
    // Select random user
    randomUser = selectRandomUser();
    // Set random user
    randomUserInterval.value = randomUser.data()?.name + ' ' + randomUser.data()?.surname;

    winners.push(randomUser);
    usedGifts.push(randomGift);

    // Add winner to database
    try {
      id = id + 1;
      await addDoc(collection(db, 'winners'), {
        id: id,
        name: randomUser.data()?.name ?? '',
        surname: randomUser.data()?.surname ?? '',
        gift: randomGift.data()?.label ?? '',
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      alert('Çekiliş başarısız, lütfen bilgilerinizi kontrol edin.');
    }

  }, 5000);
}
</script>
