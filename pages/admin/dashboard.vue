<template>
  <UContainer class="max-w-9xl mt-5 text-center">
    <template v-if="loaded">
      <UCard>
        <img src="/jetkolay.png" alt="logo" class="w-32 mx-auto" />
      </UCard>
      <UCard :ui="{ body: { base: 'flex' } }">
        <div class="space-y-4 flex-auto ">
          <!-- delete all users-->
          <div class="text-end">
            <UButton label="Sıfırla" @click="deleteAllUsers" />
          </div>
          <UDivider label="ÇEKİLİŞE KATILANLAR LİSTE" />
          <UInput v-model="search" placeholder="Ara..." class="mt-5" />
          <UTable :rows="filteredJoinRows" :columns="columns" />
          <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="pageUser" :page-count="pageCount" :total="people?.length ?? 0" />
          </div>

          <div class="pb-5 flex flex-col items-center">
            <span class="mb-4">Kalan Hediye Sayısı: {{ giftsDocs.length - winnerDocs.length }}</span>
            <UButton label="Çekiliş Yap!" class="w-64 h-12 justify-center" @click="cekilis"
              :disabled="cekilisProcess || giftsDocs.length === winnerDocs.length"
              v-if="giftsDocs.length !== winnerDocs.length" />
            <UBadge label="HEDİYE KALMADI!" color="rose" v-if="giftsDocs.length === winnerDocs.length" />
          </div>
          <UDivider label="KAZANANLAR" class="pt-5" />
          <div class="text-end">
            <UButton label="Sıfırla" @click="deleteAllWinners" />
          </div>
          <UTable :sort="sort" loading
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Yükleniyor...' }"
            :progress="{ color: 'primary', animation: 'carousel' }" :rows="winnersList" :columns="winColumns" />

          <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-[1200px]' }">

            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

              <UDivider :label="`${randomGiftInterval} için kazanan belirleniyor...`" />
              <div class="text-center space-y-4">
                <!-- User random interval -->
                <span v-text="randomUserInterval" style="font-size: 90px;" />
                <br>
                <!-- User random interval -->
                <span v-text="randomGiftInterval" style="font-size: 90px;" />
              </div>
            </UCard>
          </UModal>
        </div>

        <UDivider orientation="vertical" class="flex-initial w-32" />

        <div class="space-y-4 flex-initial w-4/12 text-center">
          <img src="/frame.png" alt="Desert" class="w-full object-cover" />
          <!-- list gifts not use table-->
          <UDivider label="HEDİYELER" />
          <div class="space-y-4">
            <div v-for="gift in gifts" :key="gift.label" class="flex justify-between items-center">
              <span>{{ gift.sort }}</span>
              <span>{{ gift.label }}</span>
              <UButton label="Sil" @click="deleteGift(gift.label)" />
            </div>

          </div>

          <UForm @submit="addGift" class="space-y-4">
            <UFormGroup label="Hediye Ekle" name="gift">
              <UInput v-model="gift" type="text" />
            </UFormGroup>
            <UButton type="submit" label="Hediye Ekle" />
          </UForm>
        </div>
      </UCard>

    </template>
    <template v-else>
      Yükleniyor...
    </template>
  </UContainer>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { set } from 'firebase/database';
import { doc, collection, addDoc, getDocs, query, where, deleteDoc, DocumentSnapshot, onSnapshot, type DocumentData, QueryDocumentSnapshot, QuerySnapshot, } from 'firebase/firestore'
import { useFirestore } from 'vuefire';

const db = useFirestore();
const route = useRouter();
const loaded = ref(false);
const isOpen = ref(false);
const isWinnerWon = ref(false);
const selected = ref('');
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

const search = ref('')
const joinRows = computed(() => {
  return people.value?.slice((pageUser.value - 1) * pageCount, (pageUser.value) * pageCount) || [];
})
const filteredJoinRows = computed(() => {
  return joinRows.value?.filter((row) => {
    return row.name.toLowerCase().includes(search.value.toLowerCase()) || row.surname.toLowerCase().includes(search.value.toLowerCase())
  })
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

const gifts = computed(() => {
  return giftsDocs.value
    .map((doc) => {
      return {
        label: doc.data()?.label,
        sort: doc.data()?.sort,
      }
    })
    .sort((a, b) => a.sort - b.sort);
});


//delete all users with check confirm
async function deleteAllUsers() {
  if (confirm('Tüm kullanıcılar silinecek, emin misiniz?')) {
    try {
      usersDocs.value.forEach(async (user) => {
        await deleteDoc(doc(db, 'user', user.id));
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  }
}
async function deleteAllWinners() {
  if (confirm('Tüm kazananlar silinecek, emin misiniz?')) {
    try {
      winnerDocs.value.forEach(async (winner) => {
        await deleteDoc(doc(db, 'winners', winner.id));
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  }
}





//add gift
const gift = ref('');
async function addGift() {
  try {
    await addDoc(collection(db, 'gifts'), {
      label: gift.value,
      sort: giftsDocs.value.length + 1,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    alert('Bir hata oluştu, lütfen tekrar deneyin.');
  }
}
//delete gift
async function deleteGift(label: string) {
  try {
    const giftDoc = giftsDocs.value.find(gift => gift.data()?.label === label);
    if (!giftDoc) {
      return;
    }
    await deleteDoc(doc(db, 'gifts', giftDoc.id));

  } catch (error) {
    console.error("Error deleting document: ", error);
    alert('Bir hata oluştu, lütfen tekrar deneyin.');
  }
}



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
  if (usersDocs.value.length === 0) {
    alert('Çekilişe katılan kullanıcı bulunamadı.');
    return;
  }
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
  setTimeout(() => {
    isWinnerWon.value = true;
  }, 5200);
}
</script>
