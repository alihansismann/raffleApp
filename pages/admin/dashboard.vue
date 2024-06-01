<template>
  <UContainer class="max-w-xl mt-5 text-center">
    <template v-if="loaded">
      <UDivider label="ÇEKİLİŞE KATILANLAR LİSTE" />
      <UTable :rows="joinRows" :columns="columns" />
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="pageUser" :page-count="pageCount" :total="people?.length ?? 0" />
      </div>

      <div class="pb-5 flex flex-col items-center">
        <span class="mb-4">Kalan Hediye Sayısı: {{ giftsDocs.length - winnerDocs.length }}</span>
        <UButton label="Çekiliş Yap!" @click="cekilis"
          :disabled="cekilisProcess || giftsDocs.length === winnerDocs.length" v-if="giftsDocs.length !== winnerDocs.length" />
        <UBadge label="HEDİYE KALMADI!" color="rose" v-if="giftsDocs.length === winnerDocs.length" />
      </div>
      <UDivider label="KAZANANLAR" class="pt-5" />
      <UTable :sort="sort" loading :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Yükleniyor...' }"
        :progress="{ color: 'primary', animation: 'carousel' }" :rows="winnersList" :columns="winColumns" />

      <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

          <UDivider :label="`${randomGiftInterval} için kazanan belirleniyor...`" />
          <UCardBody>
            <!-- User random interval -->
            <UBadge label="Kazanan" type="success" color="green" class="mt-4"/>&nbsp;&nbsp;
            <span v-text="randomUserInterval" />
            <br>
            <!-- User random interval -->
            <UBadge label="&nbsp;Hediye&nbsp;" color="yellow" class="mt-2"/>&nbsp;&nbsp;
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
const sort = ref({
  column: 'id',
  direction: 'asc'
})
const columns = [{
  key: 'name',
  label: 'İsim'
}, {
  key: 'surname',
  label: 'Soyisim'
}]

const winColumns = [{
  key: 'id',
  label: 'Sıra',
  sortable: true
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

function selectRandomUser() {
  const filteredUsers = usersDocs.value?.filter(user => !winnerDocs.value.find(winner => winner.data()?.userRef.id === user.id));
  const randomIndex = Math.floor(Math.random() * filteredUsers.length);
  const randomUser = filteredUsers[randomIndex];
  return randomUser;
}

function selectNextGift() {
  const filteredGifts = giftsDocs.value?.filter(gift => !winnerDocs.value.find(winner => winner.data()?.giftRef.id === gift.id));
  const sortedGifts = filteredGifts.sort((a, b) => a.data()?.sort - b.data()?.sort);
  return sortedGifts[0];
}

const randomUserInterval = ref('');
const randomGiftInterval = ref('');
const cekilisProcess = ref(false);
let id = 0;
async function cekilis() {
  cekilisProcess.value = true;
  console.log(giftsDocs.value.length);

  if (winnerDocs.value.length === giftsDocs.value.length) {
    alert('Hediye kalmadı.');
    return;
  }

  isOpen.value = true;

  const randomUserIntervalHandler = setInterval(() => {
    randomUserInterval.value = selectRandomUser().data()?.name + ' ' + selectRandomUser().data()?.surname;
  }, 50);

  let randomUser: DocumentSnapshot;
  let gift: DocumentSnapshot;

  gift = selectNextGift();
  randomGiftInterval.value = gift.data()?.label;

  // Select random user
  setTimeout(async () => {
    // Clear interval
    clearInterval(randomUserIntervalHandler);
    // Select random user
    randomUser = selectRandomUser();
    // Set random user
    randomUserInterval.value = randomUser.data()?.name + ' ' + randomUser.data()?.surname;

    // Add winner to database
    try {
      await addDoc(collection(db, 'winners'), {
        id: winnerDocs.value.length + 1,
        userRef: doc(db, 'user', randomUser.id),
        name: randomUser.data()?.name ?? '',
        surname: randomUser.data()?.surname ?? '',
        gift: gift.data()?.label ?? '',
        giftRef: doc(db, 'gifts', gift.id),
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      alert('Çekiliş başarısız, lütfen bilgilerinizi kontrol edin.');
    }

    cekilisProcess.value = false;
  }, 5000);
}
</script>
