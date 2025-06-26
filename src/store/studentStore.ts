// store/studentStore.ts

import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'

export type Student = {
  id: number
  name: string
  iin: string
  course: string
  stream: string
  topStudent: boolean
  email?: string
  phone?: string
  status?: string
  financing?: string
}

export const useStudentStore = defineStore('student', {
  state: () => ({
    list: [] as Student[],
    loading: false,
  }),
  actions: {
    /** Загрузить список студентов (симуляция) */
    async fetchStudents() {
      this.loading = true
      await new Promise(r => setTimeout(r, 300))
      if (!this.list.length) {
        this.list = [
          { id: 1,  name: 'Ахметова Айдана Данибековна',    iin: '990101350128', course: 'Data Science',                     stream: 'A1', topStudent: false, email: 'aidana@example.com', phone: '+7 700 000 00 01' },
          { id: 2,  name: 'Талгатов Али Ермекович',          iin: '870213400917', course: 'Generative AI',                   stream: 'B2', topStudent: true,  email: 'ali@example.com',    phone: '+7 700 000 00 02' },
          { id: 3,  name: 'Файзулла Мухамед Ахметович',      iin: '950624300675', course: 'Вэб-разработка',                   stream: 'C3', topStudent: false, email: 'muhamed@example.com', phone: '+7 700 000 00 03' },
          { id: 4,  name: 'Мейыржанов Асыл Райымбекович',    iin: '010501600338', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false, email: 'asil@example.com',    phone: '+7 700 000 00 04' },
          { id: 5,  name: 'Кулжанова Салтанат Айдаровна',    iin: '980315240512', course: 'Мобильная разработка',               stream: 'A1', topStudent: false, email: 'saltanat@example.com',phone: '+7 700 000 00 05' },
          { id: 6,  name: 'Нургазиев Ерлан Серикович',      iin: '900712560123', course: 'Машинное обучение и ИИ',             stream: 'B2', topStudent: true,  email: 'erlan@example.com',   phone: '+7 700 000 00 06' },
          { id: 7,  name: 'Сейткалиев Ербол Ахметович',      iin: '921023470987', course: 'IT право',                           stream: 'C3', topStudent: false, email: 'erbol@example.com',   phone: '+7 700 000 00 07' },
          { id: 8,  name: 'Тайырова Жанна Ермековна',        iin: '991110110223', course: 'Data Science',                     stream: 'D4', topStudent: false, email: 'zhanna@example.com',  phone: '+7 700 000 00 08' },
          { id: 9,  name: 'Базарбаев Мади Талгатович',       iin: '890405670543', course: 'Разработка игр',                     stream: 'A1', topStudent: false, email: 'madi@example.com',     phone: '+7 700 000 00 09' },
          { id: 10, name: 'Ибраева Аида Данияровна',         iin: '000101330123', course: 'Вэб-разработка',                   stream: 'B2', topStudent: true,  email: 'aida@example.com',     phone: '+7 700 000 00 10' },
          { id: 11, name: 'Жумабаев Азат Серикович',         iin: '940825780654', course: 'Сети и информационная безопасность', stream: 'C3', topStudent: false, email: 'azat@example.com',     phone: '+7 700 000 00 11' },
          { id: 12, name: 'Рахимова Лаура Кайратовна',       iin: '970709450321', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false, email: 'laura@example.com',    phone: '+7 700 000 00 12' },
        ]
      }
      this.loading = false
    },

    /** Добавить нового студента */
    async createStudent(data: Omit<Student, 'id'>) {
      const newId = this.list.length
        ? Math.max(...this.list.map(s => s.id)) + 1
        : 1
      this.list.push({ id: newId, ...data })
    },

    /** Обновить существующего студента */
    async updateStudent(id: number, data: Partial<Student>) {
      const idx = this.list.findIndex(s => s.id === id)
      if (idx !== -1) this.list[idx] = { ...this.list[idx], ...data }
    },

    /** Экспорт списка студентов в Excel */
    exportToExcel() {
      // Формируем данные для экспорта
      const data = this.list.map(s => ({
        Студент:       s.name,
        ИИН:           s.iin,
        Email:         s.email ?? '',
        'Телефон':     s.phone ?? '',
      }))

      // Создаём новый лист и книгу
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook  = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Студенты')

      // Инициируем скачивание файла
      XLSX.writeFile(workbook, 'students.xlsx')
    },
  },
})
