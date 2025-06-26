<template>
  <div class="p-7">
    <!-- Заголовок + Поиск -->
    <div class="flex justify-between items-center">
      <!-- Заголовок scaled to 1.2x original -->
      <h1 class="text-[1.8rem] font-semibold">Список студентов</h1>
      <div class="relative w-1/3">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск"
          clearable
          class="w-full bg-purple-50 border border-purple-200 rounded-xl pl-12 pr-5 py-4 text-[1.2rem]"
          @clear="applyFilters"
          @keyup.enter="applyFilters"
        >
          <template #prefix>
            <Search class="text-purple-400 text-[1.2rem]" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- Кнопки Добавить / Фильтр / Сохранить в Excel -->
    <div class="mt-4 flex items-center space-x-3 bg-purple-50 p-5 rounded-xl">
      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 px-5 py-4 rounded-xl text-[1.2rem]"
        @click="onAddStudent"
      >
        <img :src="addStudentLogo" alt="Добавить" class="w-6 h-6 mr-2" />
        Добавить студента
      </el-button>
      <el-button
        :class="[
          'flex items-center px-5 py-4 rounded-xl text-[1.2rem]',
          showFilter
            ? 'bg-purple-500 border-purple-500 text-white'
            : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-100'
        ]"
        @click="showFilter = !showFilter"
      >
        <img :src="filterLogo" alt="Фильтр" class="w-6 h-6 mr-2" />
        Фильтр
      </el-button>
      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 px-5 py-4 rounded-xl text-[1.2rem]"
        @click="onSaveExcel"
      >
        <Document class="mr-2 text-[1.2rem]" />
        Сохранить в Excel
      </el-button>
    </div>

    <!-- Панель фильтров -->
    <el-card
      v-if="showFilter"
      class="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-5"
      shadow="never"
    >
      <div class="flex flex-wrap gap-6 items-center text-[1.2rem]">
        <div>
          <el-select
            v-model="filter.course"
            placeholder="Выбрать курс"
            clearable
            class="w-60"
          >
            <el-option
              v-for="c in courses"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </div>
        <div>
          <el-select
            v-model="filter.stream"
            placeholder="Выбрать поток"
            clearable
            class="w-60"
          >
            <el-option
              v-for="s in streams"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </div>
        <el-checkbox v-model="filter.topStudent" class="text-[1.2rem]">
          Top Student
        </el-checkbox>
        <el-button
          type="primary"
          @click="onResetFilters"
          class="px-6 py-4 rounded-xl text-[1.2rem]"
        >
          Сбросить
        </el-button>
      </div>
    </el-card>

    <!-- Таблица студентов -->
    <div class="mt-6 overflow-auto bg-white border border-purple-200 rounded-xl">
      <table class="min-w-full">
        <thead class="bg-purple-50">
          <tr>
            <th class="px-10 py-7 text-purple-700 text-left text-[1.2rem]"></th>
            <th class="px-10 py-7 text-purple-700 text-left text-[1.2rem] font-semibold">Студент</th>
            <th class="px-10 py-7 text-purple-700 text-left text-[1.2rem] font-semibold">ИИН</th>
            <th class="px-10 py-7 text-purple-700 text-left text-[1.2rem] font-semibold">Email</th>
            <th class="px-10 py-7 text-purple-700 text-left text-[1.2rem] font-semibold">Номер телефона</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(s, idx) in filteredList"
            :key="s.id"
            class="cursor-pointer hover:bg-gray-100 even:bg-purple-50"
            @click="goToProfile(s.id)"
          >
            <td class="px-10 py-7">
              <span class="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-md text-[1.2rem]">
                {{ idx + 1 }}
              </span>
            </td>
            <td class="px-10 py-7 text-gray-900 text-[1.2rem]">{{ s.name }}</td>
            <td class="px-10 py-7 text-gray-900 text-[1.2rem]">{{ s.iin }}</td>
            <td class="px-10 py-7 text-gray-900 text-[1.2rem]">{{ s.email }}</td>
            <td class="px-10 py-7 text-gray-900 text-[1.2rem]">{{ s.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import { Search, Document } from '@element-plus/icons-vue'
import addStudentLogo from '@/assets/logos/addstudent.png'
import filterLogo from '@/assets/logos/filter.png'

const router = useRouter()
const store = useStudentStore()

// Поиск и фильтры
const searchQuery = ref('')
const showFilter  = ref(false)
const filter = ref({
  course: '' as string,
  stream: '' as string,
  topStudent: false,
})

// Опции фильтров
const courses = [
  'Data Science', 'Generative AI', 'IT право',
  'Введение в программирование', 'Вэб-разработка',
  'Графический и UI/UX дизайн', 'Машинное обучение и ИИ',
  'Мобильная разработка', 'Разработка игр',
  'Сети и информационная безопасность',
]
const streams = ['A1', 'B2', 'C3', 'D4']

// Загрузка данных
onMounted(async () => {
  await store.fetchStudents()
})

// Навигация
function onAddStudent() {
  router.push({ name: 'NewStudent' })
}
function goToProfile(id: number) {
  router.push({ name: 'StudentDetail', params: { id } })
}

// Экспорт в Excel
function onSaveExcel() {
  store.exportToExcel()
}

// Фильтрация и поиск
function applyFilters() {}
function onResetFilters() {
  filter.value = { course: '', stream: '', topStudent: false }
  searchQuery.value = ''
}

// Итоговый список
const filteredList = computed<Student[]>(() =>
  store.list.filter((s) => {
    const bySearch =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.iin.includes(searchQuery.value)
    const byCourse = !filter.value.course || s.course === filter.value.course
    const byStream = !filter.value.stream || s.stream === filter.value.stream
    const byTop = !filter.value.topStudent || s.topStudent
    return bySearch && byCourse && byStream && byTop
  })
)
</script>

<style scoped>
/* Дополнительные сти */
</style>