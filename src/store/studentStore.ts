import { defineStore } from 'pinia'

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
    async fetchStudents() {
      this.loading = true
      await new Promise(r => setTimeout(r, 300))
      if (!this.list.length) {
        this.list = [
          { id: 1,  name: 'Ахметова Айдана Данибековна',    iin: '990101350128', course: 'Data Science',                     stream: 'A1', topStudent: false },
          { id: 2,  name: 'Талгатов Али Ермекович',          iin: '870213400917', course: 'Generative AI',                   stream: 'B2', topStudent: true  },
          { id: 3,  name: 'Файзулла Мухамед Ахметович',      iin: '950624300675', course: 'Вэб-разработка',                   stream: 'C3', topStudent: false },
          { id: 4,  name: 'Мейыржанов Асыл Райымбекович',    iin: '010501600338', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false },
          { id: 5,  name: 'Кулжанова Салтанат Айдаровна',    iin: '980315240512', course: 'Мобильная разработка',               stream: 'A1', topStudent: false },
          { id: 6,  name: 'Нургазиев Ерлан Серикович',      iin: '900712560123', course: 'Машинное обучение и ИИ',             stream: 'B2', topStudent: true  },
          { id: 7,  name: 'Сейткалиев Ербол Ахметович',      iin: '921023470987', course: 'IT право',                           stream: 'C3', topStudent: false },
          { id: 8,  name: 'Тайырова Жанна Ермековна',        iin: '991110110223', course: 'Data Science',                     stream: 'D4', topStudent: false },
          { id: 9,  name: 'Базарбаев Мади Талгатович',       iin: '890405670543', course: 'Разработка игр',                     stream: 'A1', topStudent: false },
          { id: 10, name: 'Ибраева Аида Данияровна',         iin: '000101330123', course: 'Вэб-разработка',                   stream: 'B2', topStudent: true  },
          { id: 11, name: 'Жумабаев Азат Серикович',         iin: '940825780654', course: 'Сети и информационная безопасность', stream: 'C3', topStudent: false },
          { id: 12, name: 'Рахимова Лаура Кайратовна',       iin: '970709450321', course: 'Графический и UI/UX дизайн',         stream: 'D4', topStudent: false },
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
  },
})
