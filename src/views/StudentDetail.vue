<template>
  <div class="p-6 min-h-screen flex flex-col items-center justify-start pt-12 pb-24 relative">
    <!-- X (Закрыть) -->
    <button
      class="absolute top-1 right-1 bg-[#F1EFFF] hover:bg-purple-100 rounded-lg w-7 h-7 flex items-center justify-center shadow"
      @click="goBack"
      aria-label="Закрыть"
    >
      <img src="@/assets/logos/close.png" alt="Закрыть" class="w-6 h-6" />
    </button>

    <!-- Аватар и Имя -->
    <div class="flex flex-col items-center mb-3">
      <div class="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4 overflow-hidden bg-white shadow">
        <img :src="defaultAvatar" class="object-cover w-full h-full" alt="Avatar" />
      </div>
      <h2 class="text-3xl font-bold mb-1 text-center">
        <template v-if="isEditing">
          <input v-model="editForm.name" class="input-basic text-center" />
        </template>
        <template v-else>
          {{ editForm.name }}
        </template>
      </h2>
    </div>

    <!-- Курс + Поток (бокс) -->
    <div class="mb-7 flex flex-col items-center">
      <div class="flex flex-col items-center border-2 border-[#E0D7FF] bg-white rounded-xl px-16 py-4 shadow-sm min-w-[310px]">
        <div class="flex flex-col items-center gap-1">
          <template v-if="isEditing">
            <CustomDropdown
              :options="coursesList"
              v-model="editForm.course"
              class="font-semi-bold text-[16px] w-56"
            />
            <CustomDropdown
              :options="flowsList"
              v-model="editForm.stream"
              class="text-[15px] text-blue-600 mt-1 w-32"
            />
          </template>
          <template v-else>
            <span class="font-bold text-[22px]">{{ editForm.course }}</span>
            <span class="text-[17px] text-blue-600 -mt-1">{{ editForm.stream }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Информация о студенте -->
    <div class="w-full mb-10 rounded-2xl border border-[#E0D7FF] overflow-visible bg-white shadow">
      <table class="w-full text-base">
        <thead class="bg-[#F1EFFF] text-black text-[18px] font-semibold">
          <tr>
            <th class="px-12 py-5 font-semibold text-left rounded-tl-2xl">Данные</th>
            <th class="px-12 py-5 font-semibold text-left rounded-tr-2xl">Информация о студенте</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF] bg-white">
          <tr>
            <td class="px-12 py-3">ИИН</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <input v-model="editForm.iin" class="input-basic" />
              </template>
              <template v-else>
                {{ editForm.iin }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Email</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <input v-model="editForm.email" class="input-basic" />
              </template>
              <template v-else>
                {{ editForm.email }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Телефон</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <input v-model="editForm.phone" class="input-basic" />
              </template>
              <template v-else>
                {{ editForm.phone }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Статус</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <CustomDropdown
                  :options="statusOptions"
                  v-model="editForm.status"
                  class="w-48"
                />
              </template>
              <template v-else>
                {{ editForm.status }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Top Student</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <input
                  type="checkbox"
                  v-model="editForm.topStudent"
                  class="form-checkbox accent-[#38D473] w-5 h-5 border-2 rounded"
                />
              </template>
              <template v-else>
                <input
                  type="checkbox"
                  v-model="editForm.topStudent"
                  class="form-checkbox accent-[#38D473] w-5 h-5 border-2 rounded"
                  disabled
                />
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Финансирование</td>
            <td class="px-12 py-3">
              <template v-if="isEditing">
                <CustomDropdown
                  :options="financingOptions"
                  v-model="editForm.financing"
                  class="w-48"
                />
              </template>
              <template v-else>
                {{ editForm.financing }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="px-12 py-3">Календарь платежей</td>
            <td class="px-12 py-3 flex items-center">
              <template v-if="isEditing">
                <input
                  type="number"
                  v-model="editForm.paymentPeriod"
                  min="1"
                  max="12"
                  class="input-basic w-24"
                  placeholder="Месяцев"
                />
                <span class="ml-2 text-xs text-gray-500">максимальное количество: 12 месяцев</span>
              </template>
              <template v-else>
                {{ editForm.paymentPeriod }} месяцев
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Оплата за курс -->
    <div class="w-full  mb-10 rounded-2xl border border-[#F1EFFF] overflow-hidden bg-white shadow">
      <table class="w-full text-base">
        <thead class="bg-[#F1EFFF] text-sm font-semibold">
          <tr>
            <th class="px-12 py-3 font-semibold text-left rounded-tl-2xl">Оплата за курс</th>
            <th class="px-12 py-3 font-semibold text-right rounded-tr-2xl">
              {{ formatTenge(editForm.totalCoursePrice ?? 0) }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF] bg-white">
          <tr>
            <td class="px-12 py-3">Сумма со скидкой {{ editForm.discountPercent }}%</td>
            <td class="px-12 py-3 text-right">{{ formatTenge(editForm.discountedPrice ?? 0) }}</td>
          </tr>
          <tr>
            <td class="px-12 py-3">Сумма оплачено</td>
            <td class="px-12 py-3 text-right">{{ formatTenge(amountPaid) }}</td>
          </tr>
          <tr>
            <td class="px-12 py-3">Сумма к оплате</td>
            <td class="px-12 py-3 text-right">{{ formatTenge(amountDue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопки -->
    <div class="w-full flex justify-end">
      <button
        v-if="!isEditing"
        @click="startEdit"
        class="bg-[#6252FE] hover:bg-[#4736b3] text-white px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition"
      >
        <svg width="20" height="20" fill="none" class="mr-1">
          <path d="M14.472 2.914a2.34 2.34 0 0 1 3.308 3.307l-1.295 1.296-3.307-3.307 1.294-1.296ZM3 17.5v-3.308l9.273-9.273 3.308 3.307L6.308 17.5H3Z" fill="#fff"/>
        </svg>
        Редактировать профиль
      </button>
      <template v-else>
        <button @click="cancelEdit" class="mr-3 px-6 py-3 rounded-lg border border-[#6252FE] bg-white text-[#6252FE] font-medium transition">Отмена</button>
        <button @click="saveEdit" class="px-6 py-3 rounded-lg bg-[#6252FE] hover:bg-[#4736b3] text-white font-medium transition">Сохранить</button>
      </template>
    </div>

    <!-- Попап -->
    <el-dialog v-model="showSuccess" width="350px" center show-close>
      <div class="text-center p-6">
        <div class="mx-auto rounded-lg bg-[#E7FFE6] w-12 h-12 mb-2 flex items-center justify-center">
          <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#38D473"/><path d="M10 17l4 4 8-8" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Готово!</h3>
        <p class="text-gray-600 mb-6">Изменения успешно сохранены</p>
        <el-button type="primary" @click="goToList" style="background:#17D749;border:none">Далее</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore, StudentFull } from '@/store/studentStore'
import CustomDropdown from '@/components/CustomDropdown.vue'
import defaultAvatar from '@/assets/logos/default-avatar.png'

const router = useRouter()
const route = useRoute()
const store = useStudentStore()
const id = String(route.params.id)

const student = ref<StudentFull | null>(null)
const isEditing = ref(false)
const showSuccess = ref(false)
const editForm = ref<any>({})

const coursesList = [
  'Data Science', 'Generative AI', 'IT право', 'Введение в программирование',
  'Вэб-разработка', 'Графический и UI/UX дизайн', 'Машинное обучение и ИИ', 'Мобильная разработка',
  'Разработка игр', 'Сети и информационная безопасность'
]
const flowsList = ['DSF-1', 'B2', 'A1', 'D4', 'C3', 'DSF-2']
const statusOptions = ['Студент', 'Выпускник']
const financingOptions = [
  'TechOrda', 'Со скидкой 30 %', 'Со скидкой 70 %', 'Полное финансирование (грант)'
]
const paymentPeriodOptions = Array.from({ length: 12 }, (_, i) => `${i + 1} месяца`)

onMounted(async () => {
  if (!store.list.length) await store.fetchStudents()
  student.value = await store.fetchById(id)
  Object.assign(editForm.value, student.value)
  editForm.value.paymentPeriod = `${student.value?.paymentSchedule.length || 4} месяца`
})

const amountPaid = computed(() =>
  student.value
    ? student.value.paymentSchedule.filter(p => p.paid).reduce((s, p) => s + p.amount, 0)
    : 0
)
const amountDue = computed(() =>
  student.value ? student.value.discountedPrice - amountPaid.value : 0
)

function formatTenge(val: number) {
  return val ? val.toLocaleString('ru-RU') + ' тг' : '0 тг'
}
function startEdit() {
  Object.assign(editForm.value, student.value)
  editForm.value.paymentPeriod = `${student.value?.paymentSchedule.length || 4} месяца`
  isEditing.value = true
}
function cancelEdit() {
  isEditing.value = false
}
async function saveEdit() {
  if (!student.value) return
  await store.updateStudent(student.value.id, editForm.value)
  student.value = await store.fetchById(id)
  isEditing.value = false
  showSuccess.value = true
}
function goBack() {
  router.back()
}
function goToList() {
  showSuccess.value = false
  router.push('/students')
}
</script>

<style scoped>
.input-basic {
  border: 1.5px solid #E0D7FF;
  background: #fff;
  font-size: 1rem;
  color: #1a1a1a;
  border-radius: 8px;
  padding: 0.25rem 0.7rem;
  width: 100%;
  transition: border .2s;
}
.input-basic:focus {
  border-color: #6252FE;
  outline: none;
}
</style>
