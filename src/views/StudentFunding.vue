<template>
  <div class="p-6 font-inter">
    <h2 class="text-2xl font-bold mb-6">Финансирование студентов</h2>

    <!-- Кнопки фильтрации вкладок -->
    <div class="flex space-x-4 bg-[#F1EFFF] p-3 rounded-lg mb-4">
      <router-link
        to="/finance/reports/total-revenue"
        class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/total-revenue' }"
      >Общая выручка</router-link>
      <router-link
        to="/finance/reports/debts"
        class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/debts' }"
      >Задолженности</router-link>
      <router-link
        to="/finance/reports/student-funding"
        class="tab-button"
        :class="{ 'tab-button-active': route.path === '/finance/reports/student-funding' }"
      >Финансирование студентов</router-link>
    </div>

    <!-- Фильтры -->
    <div class="filters-wrapper relative flex flex-wrap gap-3 mb-6 items-center">
      <!-- Тип финансирования -->
      <div class="flex items-center gap-2">
        <div ref="fundingDropdownRef" class="relative w-56">
          <button
            @click="toggleFundingType"
            class="filter-select w-full flex justify-between items-center"
            type="button"
          >
            {{ selectedFundingTypes.length ? selectedFundingTypes.join(', ') : 'Тип финансирования' }}
            <svg
              :class="[
                'w-4 h-4 ml-2 transform transition-transform duration-200',
                showFundingType ? 'rotate-180' : ''
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
            v-if="showFundingType"
            class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
          >
            <li
              v-for="option in fundingTypes"
              :key="option"
              @click.stop="toggleFundingTypeOption(option)"
              class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
            >
              <!-- Текст -->
              <span :class="{ 'text-[rgb(98,82,254)] font-medium': selectedFundingTypes.includes(option) }">
                {{ option }}
              </span>
              <!-- Чекбокс -->
              <span
                class="inline-flex items-center justify-center w-5 h-5 ml-3 rounded border border-[#7C67FE]"
                :style="{
                  background: selectedFundingTypes.includes(option) ? '#f4f0ff' : 'white'
                }"
              >
                <svg v-if="selectedFundingTypes.includes(option)" width="20" height="20" viewBox="0 0 20 20">
                  <polyline
                    points="5,10 9,14 15,6"
                    fill="none"
                    stroke="#7C67FE"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </li>
          </ul>
        </div>
        <button
          class="reset-btn"
          @click="resetFundingTypes"
          v-if="selectedFundingTypes.length"
          type="button"
        >
          Сбросить
        </button>
      </div>
    </div>

    <!-- Таблица студентов -->
    <table class="w-full bg-white text-left border border-purple-200 rounded-lg overflow-hidden">
      <thead class="bg-[#ECE9FF] text-sm font-semibold">
        <tr>
          <th class="px-4 py-2 w-12">№</th>
          <th class="px-4 py-2">Студент</th>
          <th class="px-4 py-2">Тип финансирования</th>
          <th class="px-4 py-2">Процент покрытия</th>
          <th class="px-4 py-2">Стоимость обучения (тг)</th>
          <th class="px-4 py-2">Скидка (тг)</th>
          <th class="px-4 py-2">К оплате (тг)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in filteredStudents" :key="i" class="border-t">
          <!-- Нумерация -->
          <td class="px-4 py-2">
            <div class=" w-6 h-6 rounded-md bg-[#F1ECFF] text-[rgb(98,82,254)] text-xs font-semibold flex items-center justify-center">
              {{ i + 1 }}
            </div>
          </td>
          <td class="px-4 py-2">{{ s.name }}</td>
          <td class="px-4 py-2">{{ s.funding }}</td>
          <td class="px-4 py-2">{{ s.percent }}</td>
          <td class="px-4 py-2">{{ s.total }}</td>
          <td class="px-4 py-2">{{ s.covered }}</td>
          <td class="px-4 py-2">{{ s.pay }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Итоговая таблица -->
    <div class="mt-6 w-full bg-white overflow-hidden rounded-xl border border-[#E0D7FF]">
      <table class="w-full text-sm text-left border-collapse">
        <thead>
          <tr class="bg-[#ECE9FF] font-semibold divide-x divide-[#E0D7FF]">
            <th class="px-4 py-2">Тип финансирования</th>
            <th class="px-4 py-2">Кол-во студентов</th>
            <th class="px-4 py-2">Покрытие (%)</th>
            <th class="px-4 py-2">Общая сумма скидки (тг)</th>
            <th class="px-4 py-2">Всего оплачено студентами (тг)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E0D7FF]">
          <tr v-for="(group,i) in fundingSummary"
            :key="i"
            class="divide-x divide-[#E0D7FF]">
            <td class="px-4 py-2">{{ group.type }}</td>
            <td class="px-4 py-2">{{ group.count }}</td>
            <td class="px-4 py-2">{{ group.percent }}</td>
            <td class="px-4 py-2">{{ group.covered }}</td>
            <td class="px-4 py-2">{{ group.paid }}</td>
          </tr>
          <tr class="bg-[#ECE9FF] font-semibold divide-x divide-[#E0D7FF]">
            <td class="px-4 py-2">Итого</td>
            <td class="px-4 py-2">{{ fundingTotal.count }}</td>
            <td class="px-4 py-2">-</td>
            <td class="px-4 py-2">{{ fundingTotal.covered }}</td>
            <td class="px-4 py-2">{{ fundingTotal.paid }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка Сохранить Excel -->
    <div class="mt-4 flex justify-end">
      <button @click="downloadExcel" class="download-btn">Сохранить в Excel</button>
    </div>
  </div>
</template>


<!-- Scripts -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as XLSX from 'xlsx'
import { useRoute } from 'vue-router'

const route = useRoute()
const fundingTypes = ['TechOrda', 'Скидка 30%', 'Скидка 70%', 'Внутренний грант', 'Польная оплата']
const selectedFundingTypes = ref([])

const selectedFundingType = ref('')
const selectedCoverage = ref('')
const showFundingType = ref(false)
const showCoveragePercent = ref(false)

const fundingDropdownRef = ref(null)

const students = [
  { name: 'Сеитов А.К.', funding: 'Внутренний грант', percent: '100%', total: '600.000', covered: '600.000', pay: '0' },
  { name: 'Муратова И.Н.', funding: 'Скидка 30%', percent: '30%', total: '500.000', covered: '150.000', pay: '350.000' },
  { name: 'Ахметов Е.М.', funding: 'TechOrda', percent: '100%', total: '500.000', covered: '500.000', pay: '0' },
  { name: 'Ким А.С.', funding: 'Скидка 70%', percent: '70%', total: '500.000', covered: '350.000', pay: '150.000' },
  { name: 'Слеимова А.А.', funding: 'Скидка 70%', percent: '70%', total: '500.000', covered: '350.000', pay: '150.000' },
  { name: 'Бахтёров С.А.', funding: 'Скидка 30%', percent: '30%', total: '500.000', covered: '350.000', pay: '150.000' },
  { name: 'Фёдоров А.Т.', funding: 'Внутренний грант', percent: '70%', total: '500.000', covered: '350.000', pay: '150.000' },
  { name: 'Антонов В.С.', funding: 'Скидка 30%', percent: '70%', total: '500.000', covered: '350.000', pay: '150.000' },
]

// Глобальный слушатель(для дропдаунов)
function handleClickOutside(event) {
  if (
    showFundingType.value &&
    fundingDropdownRef.value &&
    !fundingDropdownRef.value.contains(event.target)
  ) {
    showFundingType.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))

const filteredStudents = computed(() => {
  return students.filter(s => {
    return !selectedFundingTypes.value.length || selectedFundingTypes.value.includes(s.funding)
  })
})

function toggleFundingType() {
  showFundingType.value = !showFundingType.value
  showCoveragePercent.value = false
}

function toggleFundingTypeOption(option) {
  const i = selectedFundingTypes.value.indexOf(option)
  if (i === -1) {
    selectedFundingTypes.value.push(option)
  } else {
    selectedFundingTypes.value.splice(i, 1)
  }
}

function resetFundingTypes() {
  selectedFundingTypes.value = []
}

function toggleCoveragePercent() {
  showCoveragePercent.value = !showCoveragePercent.value
  showFundingType.value = false
}

function selectFundingType(option) {
  selectedFundingType.value = option
  showFundingType.value = false
}

function selectCoverage(option) {
  selectedCoverage.value = option
  showCoveragePercent.value = false
}

const fundingSummary = computed(() => {
  const groups = {}
  for (const s of filteredStudents.value) {
    if (!groups[s.funding]) {
      groups[s.funding] = {
        type: s.funding,
        count: 0,
        percent: s.percent,
        covered: 0,
        paid: 0
      }
    }
    groups[s.funding].count++
    groups[s.funding].covered += parseInt(s.covered.replace(/\D/g, '')) || 0
    groups[s.funding].paid += parseInt(s.pay.replace(/\D/g, '')) || 0
  }
  return Object.values(groups).map(g => ({
    ...g,
    covered: g.covered.toLocaleString('ru-RU'),
    paid: g.paid.toLocaleString('ru-RU')
  }))
})

const fundingTotal = computed(() => {
  let count = 0
  let covered = 0
  let paid = 0
  for (const s of filteredStudents.value) {
    count++
    covered += parseInt(s.covered.replace(/\D/g, '')) || 0
    paid += parseInt(s.pay.replace(/\D/g, '')) || 0
  }
  return {
    count,
    covered: covered.toLocaleString('ru-RU'),
    paid: paid.toLocaleString('ru-RU')
  }
})

function downloadExcel() {
  const ws = XLSX.utils.json_to_sheet(filteredStudents.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Финансирование')
  XLSX.writeFile(wb, 'Финансирование.xlsx')
}
</script>


<!-- Styles -->
<style scoped>
.filter-select {
  background: #ffffff;
  color: #836eff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.download-btn {
  background-color: #6252FE;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.tab-button {
  background: #FFFFFF;
  color: #6252FE;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
}
.tab-button-active {
  background: #6252FE;
  color: #FFFFFF;
}

.download-btn:hover {
  background-color: #5140e5;
}

.filters-wrapper {
background-color: #F1EFFF;
  border-radius: 12px;
  padding: 9px;
  margin-bottom: 16px;
  margin-left: 0px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #7C67FE;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: white;
}
.custom-checkbox.checked {
  background: #f4f0ff;
}

.reset-btn {
  background: #fff;
  color: #6252FE;
  border: 1px solid #C5BFFF;
  border-radius: 7px;
  padding: 7px 18px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  transition: background 0.2s, color 0.2s, border 0.2s;
  cursor: pointer;
  outline: none;
}
.reset-btn:hover {
  background: #F1EFFF;
  color: #3b299c;
  border-color: #6252FE;
}
</style>
