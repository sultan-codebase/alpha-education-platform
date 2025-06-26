<!-- src/views/StudentForm.vue -->
<template>
  <div class="min-h-screen bg-white flex">
    <!-- Sidebar placeholder (real sidebar lives in Layout.vue) -->
    <div class="w-20"></div>

    <!-- Main area -->
    <div class="flex-1 p-8">
      <!-- Title -->
      <h1 class="text-3xl font-bold mb-6">Добавить студента</h1>

      <!-- Form -->
      <el-form
        ref="formRef"
        :model="form"
        label-width="0"
        class="space-y-4"
      >
        <!-- Upper text fields -->
        <el-input
          v-model="form.surname"
          placeholder="Фамилия"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />
        <el-input
          v-model="form.firstName"
          placeholder="Имя"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />
        <el-input
          v-model="form.patronymic"
          placeholder="Отчество"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />
        <el-input
          v-model="form.iin"
          placeholder="010101345678"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />
        <el-input
          v-model="form.email"
          placeholder="ivanovivan@gmail.com"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />
        <el-input
          v-model="form.phone"
          placeholder="+7(700)-567-78-89"
          size="large"
          clearable
          class="w-full bg-purple-50 placeholder-purple-300 rounded-xl text-lg"
        />

        <!-- Grouped selects (separated by extra top margin) -->
        <div class="mt-6 space-y-4">
          <!-- Course -->
          <el-select
            v-model="form.course"
            placeholder="Курс"
            size="large"
            clearable
            class="w-full bg-purple-50 rounded-xl text-lg"
          >
            <el-option label="Data Science" value="Data Science" />
            <el-option label="Generative AI" value="Generative AI" />
            <el-option
              label="Введение в программирование"
              value="Введение в программирование"
            />
            <!-- …other courses… -->
          </el-select>

          <!-- Status + Top Student -->
          <div class="flex space-x-4">
            <el-select
              v-model="form.status"
              placeholder="Статус"
              size="large"
              clearable
              class="flex-1 bg-purple-50 rounded-xl text-lg shadow-none"
            >
              <el-option label="Студент" value="student" />
              <el-option label="Выпускник" value="graduate" />
            </el-select>
            <div class="flex items-center bg-purple-50 rounded-xl px-4" style="height:3.5rem">
              <span class="text-lg text-gray-700 mr-2">Top Student</span>
              <el-checkbox v-model="form.topStudent" />
            </div>
          </div>

          <!-- Financing + Add Course button -->
          <div class="flex items-center space-x-4">
            <el-select
              v-model="form.financing"
              placeholder="Финансирование"
              size="large"
              clearable
              class="flex-1 bg-purple-50 rounded-xl text-lg"
            >
              <el-option label="Полная оплата" value="full" />
              <el-option label="Со скидкой 30%" value="discount30" />
              <el-option label="Со скидкой 70%" value="discount70" />
              <el-option label="Грант" value="grant" />
            </el-select>
            <el-button
              type="primary"
              icon="Plus"
              size="large"
              class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
              @click="addCourse"
            >
              Добавить курс
            </el-button>
          </div>
        </div>
      </el-form>

      <!-- Payments summary table -->
      <div class="mt-6 rounded-xl border border-purple-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-purple-50">
            <tr>
              <th class="py-3 px-6 text-left text-lg text-gray-800">
                Показатель
              </th>
              <th class="py-3 px-6 text-right text-lg text-gray-800">
                Сумма
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="py-4 px-6">Оплата за курс</td>
              <td class="py-4 px-6 text-right">—</td>
            </tr>
            <tr class="border-t">
              <td class="py-4 px-6">Сумма со скидкой</td>
              <td class="py-4 px-6 text-right">—</td>
            </tr>
            <tr class="border-t">
              <td class="py-4 px-6">Выбор период оплаты</td>
              <td class="py-4 px-6 text-right">
                <el-select
                  v-model="form.paymentPeriod"
                  placeholder="Выбрать"
                  clearable
                  class="w-40 bg-white rounded-lg text-lg"
                >
                  <el-option label="Полная сумма" value="full" />
                  <el-option label="2 месяца" value="2" />
                  <el-option label="3 месяца" value="3" />
                  <el-option label="6 месяцев" value="6" />
                  <el-option label="12 месяцев" value="12" />
                </el-select>
              </td>
            </tr>
            <tr class="border-t">
              <td class="py-4 px-6">Сумма оплачено</td>
              <td class="py-4 px-6 text-right">—</td>
            </tr>
            <tr class="border-t">
              <td class="py-4 px-6">Сумма к оплате</td>
              <td class="py-4 px-6 text-right">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Save button -->
      <div class="flex justify-end mt-6">
        <el-button
          type="primary"
          size="large"
          class="bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
          @click="confirmSave"
        >
          Сохранить профиль
        </el-button>
      </div>

      <!-- Success popup -->
      <el-dialog
        v-model="showSuccess"
        width="320px"
        show-close="false"
        center
        custom-class="success-dialog"
      >
        <div class="text-center p-6">
          <el-icon class="text-green-500 text-4xl mb-2">
            <SuccessFilled />
          </el-icon>
          <h3 class="text-xl font-semibold mb-2">Готово!</h3>
          <p class="text-gray-700 mb-6">
            Аккаунт студента успешно сохранён
          </p>
          <el-button type="primary" size="small" @click="onSuccessContinue">
            Далее
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, SuccessFilled } from '@element-plus/icons-vue'

interface StudentForm {
  surname: string
  firstName: string
  patronymic: string
  iin: string
  email: string
  phone: string
  course: string
  status: string
  topStudent: boolean
  financing: string
  paymentPeriod: string
}

const router = useRouter()
const formRef = ref()
const form = ref<StudentForm>({
  surname: '',
  firstName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  course: '',
  status: '',
  topStudent: false,
  financing: '',
  paymentPeriod: ''
})

// Control success dialog
const showSuccess = ref(false)

function addCourse() {
  ElMessage.success('Курс добавлен')
}

function confirmSave() {
  formRef.value?.validate?.((valid: boolean) => {
    if (valid) {
      showSuccess.value = true
    }
  })
}

function onSuccessContinue() {
  showSuccess.value = false
  router.push({ name: 'Students' })
}
</script>

<style scoped>
.success-dialog .el-dialog__body {
  padding: 0;
}
</style>
