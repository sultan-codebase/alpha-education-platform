<template>
  <div class="p-6 font-inter">
    <button class="close-btn" @click="closeCard">✕</button>
    <!-- Загрузка -->
    <div v-if="!student" class="text-center py-10">Загрузка...</div>
    <div v-else>

      <!-- Аватар + имя -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 mb-3 rounded-full border-2 border-purple-200"></div>
        <h2 class="text-2xl font-bold">{{ student.name }}</h2>
      </div>

      <!-- Блок 1: Информация о студенте -->
      <div class="mb-6 w-full rounded-xl border border-[#E0D7FF] overflow-visible">
        <table class="w-full text-left">
          <thead class="bg-[#F1EFFF] text-sm font-semibold">
            <tr>
              <th class="px-6 py-3 rounded-tl-lg">Данные</th>
              <th class="px-6 py-3 rounded-tr-lg">Информация о студенте</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6E3F1], bg-[#FFFFFF]">
            <tr><td class="px-6 py-2">ИИН</td><td class="px-6 py-2">{{ student.iin }}</td></tr>
            <tr><td class="px-6 py-2">Email</td><td class="px-6 py-2">{{ student.email }}</td></tr>
            <tr><td class="px-6 py-2">Телефон</td><td class="px-6 py-2">{{ student.phone }}</td></tr>

            <!-- Статус -->
            <tr>
              <td class="px-6 py-2">Статус</td>
              <td class="px-6 py-2">
                <div ref="statusDropdownRef" class="relative w-48">
                  <button
                    @click="toggleStatusDropdown"
                    class="filter-select w-full flex justify-between items-center"
                    type="button"
                  >
                    {{ selectedStatus || 'Статус' }}
                    <svg
                      :class="[
                        'w-4 h-4 ml-2 transform transition-transform duration-200',
                        showStatusDropdown ? 'rotate-180' : ''
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    v-if="showStatusDropdown"
                    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
                  >
                    <li
                      v-for="opt in statusOptions"
                      :key="opt"
                      @click="selectStatus(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedStatus === opt }"
                    >
                      {{ opt }}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- Top Student -->
            <tr>
              <td class="px-6 py-2">Top Student</td>
              <td class="px-6 py-2">
                <input
                  type="checkbox"
                  v-model="topStudent"
                  class="h-5 w-5 text-green-500 border-gray-300 rounded"
                />
              </td>
            </tr>

            <!-- Финансирование -->
            <tr>
              <td class="px-6 py-2">Финансирование</td>
              <td class="px-6 py-2">
                <div ref="financingDropdownRef" class="relative w-48">
                  <button
                    @click="toggleFinancingDropdown"
                    class="filter-select w-full flex justify-between items-center"
                    type="button"
                  >
                    {{ selectedFinancing || 'Финансирование' }}
                    <svg
                      :class="[
                        'w-4 h-4 ml-2 transform transition-transform duration-200',
                        showFinancingDropdown ? 'rotate-180' : ''
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    v-if="showFinancingDropdown"
                    class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
                  >
                    <li
                      v-for="opt in financingOptions"
                      :key="opt"
                      @click="selectFinancing(opt)"
                      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFinancing === opt }"
                    >
                      {{ opt }}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


<!-- Блок 2: Сводка платежей -->
  <div class="mb-6 w-full rounded-xl border border-[#E0D7FF] overflow-visible">
    <table class="w-full text-left">
      <thead class="bg-[#F1EFFF] text-sm font-semibold">
        <tr>
          <th class="px-6 py-3 rounded-tl-lg">Оплата за курс</th>
          <th class="px-6 py-3 rounded-tr-lg">{{ student.totalCoursePrice.toLocaleString('ru-RU') }} ₸</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#E6E3F1], bg-[#FFFFFF]">
        <tr>
          <td class="px-6 py-2">Сумма со скидкой {{ student.discountPercent }}%</td>
          <td class="px-6 py-2">{{ student.discountedPrice.toLocaleString('ru-RU') }} ₸</td>
        </tr>
        <tr>
          <td class="px-6 py-2">Период оплаты</td>
          <td class="px-6 py-2">{{ student.paymentPeriod }}</td>
        </tr>
        <tr>
          <td class="px-6 py-2">Сумма оплачено</td>
          <td class="px-6 py-2">{{ student.amountPaid.toLocaleString('ru-RU') }} ₸</td>
        </tr>
        <tr>
          <td class="px-6 py-2">Сумма к оплате</td>
          <td class="px-6 py-2">{{ student.amountDue.toLocaleString('ru-RU') }} ₸</td>
        </tr>
      </tbody>
    </table>
  </div>

<!-- Переключатель режимов -->
  <div class="mt-14 mb-6">
    <div class="bg-[#F1EFFF]  p-2 rounded-lg">
      <div class="flex space-x-3">
        <button
        :class="mode === 'calendar' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
        @click="mode = 'calendar'"
      >
        Календарь платежей
        </button>
        <button
        :class="mode === 'history' ? 'btn-primary flex-1' : 'btn-secondary flex-1'"
        @click="mode = 'history'"
      >
        История платежей
        </button>
      </div>
    </div>
  </div>
       
<!-- Карточки платежей -->
  <div
    v-if="mode === 'calendar'"
    class="mt-6 grid grid-cols-4 gap-4"
  >
  <div
    v-for="(item, i) in student.paymentSchedule"
    :key="i"
    class="flex items-center bg-[rgb(194,189,250)] rounded-lg p-4"
  >

<!-- Блок с галочкой -->
  <div class="p-1 mr-4 flex-shrink-0 bg-[#9085FF] rounded border-2 border-white">
    <svg
      class="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      d="M5 13l4 4L19 7"
    />
    </svg>
  </div>

<!-- Дата и статус -->
  <div class="flex flex-col">
    <div class="text-sm font-semibold leading-tight">{{ formatDate(item.date) }}</div>
    <div class="text-xs text-[#6252FE]">{{ item.paid ? 'Погашен' : 'Не погашен' }}</div>
  </div>

<!-- Сумма -->
  <div class="ml-auto bg-white rounded-lg px-4 py-2 text-sm font-semibold">
      {{ item.amount.toLocaleString('ru-RU') }} ₸
  </div>
  </div>
  </div>

<!--Режим «История платежей» -->
  <div v-else-if="mode === 'history'" class="space-y-6">
<!-- Таблица с историей платежей -->
  <table class="w-full border border-purple-200 rounded-lg overflow-hidden text-left">
    <thead class="bg-[#F1EFFF] text-sm font-semibold">
      <tr>
        <th class="px-4 py-2">Дата платежа</th>
        <th class="px-4 py-2">Комментарий</th>
        <th class="px-4 py-2">Статус</th>
        <th class="px-4 py-2">Сумма</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, i) in student.paymentSchedule"
        :key="i"
        class="border-t bg-white"
      >
        <td class="px-4 py-2">{{ formatDate(item.date) }}</td>
        <td class="px-4 py-2">{{ item.comment || `Платёж ${i + 1}` }}</td>
        <td class="px-4 py-2">
      <span :class="item.paid ? 'status-paid' : 'status-unpaid'">
        {{ item.paid ? 'Оплачен' : 'Не оплачен' }}
      </span>
        </td>
        <td class="px-4 py-2">{{ item.amount.toLocaleString('ru-RU') }} ₸</td>
      </tr>
    </tbody>
  </table>
     
<!-- 1) Кнопка «Добавить платёж» -->
  <div v-if="!showAddPanel" class="flex justify-end">
    <button
      @click="onAddPayment"
      class="add-payment-btn"
      type="button"
    >
      Добавить платёж
    </button>
  </div>
 
<!-- 2) Форма добавления платежа в таблицу -->
  <div
    v-else
    class=" bg-[#F1EFFF] p-6 rounded-lg flex items-center space-x-4"
  >

<!-- Дата платежа -->
  <div class="w-56">
    <Datepicker
      v-model="newPayment.date"
      placeholder="Дата платежа"
      format="dd.MM.yyyy"
      :input-class="'filter-select w-full'"
      :enable-time-picker="false"
    />
  </div>

<!-- Комментарий -->
  <div class="w-56">
    <input
      v-model="newPayment.comment"
      type="text"
      placeholder="Комментарий"
      class="filter-select bg-white w-full focus:outline-none focus:ring-2,"
      style="background-color: #ffffff;"
    />
  </div>

<!-- Статус оплаты (в выпадающем списке) -->
<div class="relative w-40">
  <button
    @click="toggleNewStatusDropdown"
    class="filter-select w-full flex justify-between items-center"
    type="button"
    style="background-color: #ffffff;"
  >
    {{ newPayment.status || 'Статус' }}
    <svg
      :class="[
        'w-4 h-4 ml-2 transform transition-transform duration-200',
        showNewStatusDropdown ? 'rotate-180' : ''
      ]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
  <ul
    v-if="showNewStatusDropdown"
    class="absolute z-50 mt-2 w-full bg-white border border-purple-200
           rounded-lg shadow-lg overflow-hidden"
  >
    <li
      @click="selectNewStatus('Оплачен')"
      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
      :class="{ 'text-[rgb(98,82,254)] font-medium': newPayment.status === 'Оплачен' }"
    >
      Оплачен
    </li>
    <li
      @click="selectNewStatus('Не оплачен')"
      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
      :class="{ 'text-[rgb(98,82,254)] font-medium': newPayment.status === 'Не оплачен' }"
    >
      Не оплачен
    </li>
  </ul>
</div>

<!-- Сумма -->
  <div class="w-56">
    <input
      v-model.number="newPayment.amount"
      type="number"
      placeholder="Сумма"
      class="filter-select w-full focus:outline-none"
      style="background-color: #ffffff;"
    />
  </div>

<!-- Кнопки Сохранить / Отмена -->
  <div class="flex space-x-2 ml-auto">
    <button
      @click="saveNewPayment"
      class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      type="button"
    >
      Сохранить
    </button>
    <button
      @click="showAddPanel = false"
      class="bg-white text-gray-700 py-2 px-4 rounded hover:bg-[#D77A7A]"
      type="button"
    >
      Отмена
    </button>
    </div>
  </div>
  </div>
  </div>
  </div>
</template>


<!-- Scripts -->
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import Datepicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import { useRouter } from 'vue-router'


interface ScheduleItem {
  date: string
  amount: number
  paid: boolean
  comment?: string
}

interface Student {
  id: number
  name: string
  iin: string
  stream: string
  status: string
  email: string
  phone: string
  totalCoursePrice: number
  discountPercent: number
  discountedPrice: number
  paymentPeriod: string
  amountPaid: number
  amountDue: number
  sampleDate: string
  sampleStatus: string
  sampleAmount: number
  paymentSchedule: ScheduleItem[]
}

interface RouteProps { id: string }
const props = defineProps<RouteProps>()
const showNewPaymentForm = ref(false)
const showAddPanel = ref(false)
const store = useStudentStore()
const student = ref<Student | null>(null)
const mode = ref<'calendar' | 'history'>('calendar')

const router = useRouter()

const statusDropdownRef = ref<HTMLElement | null>(null)
const financingDropdownRef = ref<HTMLElement | null>(null)

const statusOptions = ['Студент', 'Выпускник']
const selectedStatus = ref<string>('')
const showStatusDropdown = ref(false)

const financingOptions = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант', 'Польная оплата']
const selectedFinancing = ref<string>('')
const showFinancingDropdown = ref(false)

const topStudent = ref(false)
const historyStatusOptions = ['Оплачен', 'Не оплачен']
const showNewStatusDropdown = ref(false)

const newPayment = reactive<{
  date?: Date
  comment: string
  status: string
  amount: number | null
}>({
  date: undefined,
  comment: '',
  status: '',
  amount: null
})

function toggleStatusDropdown() {
  showStatusDropdown.value = !showStatusDropdown.value
  if (showStatusDropdown.value) showFinancingDropdown.value = false
}
function selectStatus(opt: string) {
  selectedStatus.value = opt
  showStatusDropdown.value = false
}
function toggleFinancingDropdown() {
  showFinancingDropdown.value = !showFinancingDropdown.value
  if (showFinancingDropdown.value) showStatusDropdown.value = false
}
function selectFinancing(opt: string) {
  selectedFinancing.value = opt
  showFinancingDropdown.value = false
}

function handleClickOutsideDropdowns(event: MouseEvent) {
  // Статус
  if (
    showStatusDropdown.value &&
    statusDropdownRef.value &&
    !statusDropdownRef.value.contains(event.target as Node)
  ) {
    showStatusDropdown.value = false
  }
  // Финансирование
  if (
    showFinancingDropdown.value &&
    financingDropdownRef.value &&
    !financingDropdownRef.value.contains(event.target as Node)
  ) {
    showFinancingDropdown.value = false
  }
}

function toggleNewStatusDropdown() {
  showNewStatusDropdown.value = !showNewStatusDropdown.value
}
function selectNewStatus(opt: string) {
  newPayment.status = opt
  showNewStatusDropdown.value = false
}

// Формат даты
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function formatDateIso(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric'
  })
}

function closeCard() {
  if (window.history.length > 1) router.back()
  else router.push('/finance/payments')
}

async function saveNewPayment() {
  if (!student.value || !newPayment.date || !newPayment.amount || !newPayment.status) {
    return
  }
  student.value.paymentSchedule.unshift({          
    date: newPayment.date.toISOString().slice(0,10),
    amount: newPayment.amount,
    paid: newPayment.status === 'Оплачен',
    comment: newPayment.comment
  })
  newPayment.date = undefined
  newPayment.comment = ''
  newPayment.status = ''
  newPayment.amount = null
  mode.value = 'history'
  showNewPaymentForm.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutsideDropdowns)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideDropdowns)
})

function onAddPayment() {
  showAddPanel.value = !showAddPanel.value
}

function addPayment() {
  showNewPaymentForm.value = true
}

onMounted(async () => {
  if (!store.list.length) await store.fetchStudents()
  const s = store.list.find(x => x.id === +props.id)
  if (!s) return
  student.value = {
    ...s,
    email: 'example@mail.com',
    phone: '+7(777)-111-11-11',
    totalCoursePrice: 850000,
    discountPercent: 30,
    discountedPrice: 595000,
    paymentPeriod: '8 месяца',
    amountPaid: 595000,
    amountDue: 0,
    sampleDate: '24.06.2025',
    sampleStatus: 'Погашен',
    sampleAmount: 595000,
    paymentSchedule: [],
    status: s.status || 'Активен'
  }

  if (!student.value) return

  const period = student.value.paymentPeriod
  if (period === 'Оплачена полная сумма') {
    student.value.paymentSchedule = [{
      date: student.value.sampleDate,
      amount: student.value.discountedPrice,
      paid: true
    }]
  } else {
    const months = parseInt(period) || 1
    const perMonth = Math.round(student.value.discountedPrice / months)
    student.value.paymentSchedule = Array.from({ length: months }, (_, i) => ({
      date: `Месяц ${i + 1}`,
      amount: perMonth,
      paid: i < Math.floor(student.value!.amountPaid)
    }))
  }

  selectedStatus.value = s.status === 'graduated' ? 'Выпускник' : 'Студент'
  topStudent.value = !!(s as any).topStudent
})
</script>

<!-- Styles -->
<style scoped>
.filter-select {
  background: #F1EFFF;
  color: #6252FE;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.btn-primary {
  background: #6252fe;
  color: #FFFFFF;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
}
.btn-secondary {
  background: #FFFFFF;
  color: #6252FE;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
}

table {
  border-collapse: collapse;
}

/* Стили для статуса (зеленый фон) */
.status-paid {
  display: inline-block;
  border: 1px solid #22C55E;    
  color: #22C55E;               
  background: transparent;      
  padding: 2px 8px;             
  border-radius: 9999px;        
  font-size: 12px;
  font-weight: 500;
}

/* Стили для статуса (красный фон) */
.status-unpaid {
  display: inline-block;
  border: 1px solid #EF4444;    
  color: #EF4444;              
  background: transparent;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.add-payment-btn {
  background-color: #6252FE;
  color: #FFFFFF;
  font-weight: 500;
  padding: 8px 24px;    
  border-radius: 8px;
  transition: background-color 0.2s;
}
.add-payment-btn:hover {
  background-color: #5140E5;
}

.add-payment-input {
  background-color: #FFFFFF;
  
}
.close-btn {
  position: absolute;
  top: 75px;
  right: 26px;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  color: #836eff; cursor: pointer;
  z-index: 99;
}
</style>

