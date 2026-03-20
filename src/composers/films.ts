import { ref, watch, type Ref } from 'vue'
import { useAuth } from './auth'
import { STORAGE_KEYS } from '@/utils/storageKeys'

export interface Film {
  id: string
  user: string
  title: string
  description?: string
  rating: number
  year: string
  date: string
  director: string
}

export type FilmFormData = Pick<Film, 'title' | 'rating' | 'year' | 'director' | 'description'>

const INITIAL_FILMS_DATA: Film[] = [
  {
    id: '1',
    user: 'marina',
    title: 'Terminator',
    description: `История противостояния солдата Кайла Риза и киборга-терминатора, прибывших в 1984 год из пост-апокалиптического будущего, где миром правят машины-убийцы, а человечество находится на грани вымирания.`,
    rating: 9.0,
    year: '1984',
    date: '2026.01.21T12:12:12',
    director: 'James Cameron',
  },
  {
    id: '2',
    user: 'marina',
    title: 'Interstellar',
    description: `Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.`,
    rating: 9.5,
    year: '2014',
    date: '2026.01.20T12:12:12',
    director: 'Christopher Nolan',
  },
  {
    id: '3',
    user: 'marina',
    title: 'The Devil Wears Prada',
    description: `Мечтающая стать журналисткой провинциальная девушка Энди по окончании университета получает должность помощницы всесильной Миранды Пристли, деспотичного редактора одного из крупнейших нью-йоркских журналов мод. Энди всегда мечтала о такой работе, не зная, с каким нервным напряжением это будет связано…`,
    rating: 8.5,
    year: '2006',
    date: '2026.01.22T12:12:12',
    director: 'David Frankel',
  },
  {
    id: '4',
    user: 'max',
    title: 'Spider man',
    rating: 8.0,
    date: '2026.01.23T12:12:12',
    year: '2002',
    director: 'Sam Raimi',
  },
  {
    id: '5',
    user: 'max',
    title: "Harry Potter and the Sorcerer's Stone",
    rating: 9.0,
    date: '2026.01.23T12:12:12',
    year: '2001',
    director: 'Chris Columbus',
  },
  {
    id: '6',
    user: 'max',
    title: 'Iron Man',
    rating: 9.5,
    date: '2026.01.23T12:12:12',
    year: '2008',
    director: 'John Favreau',
  },
]

interface FilmsData {
  // Состояние
  error: Ref<string>
  loading: Ref<boolean>

  // Методы
  getUserFilmsList: () => Film[]
  getUserFilmById: (id: string) => Film | null
  addFilm: (filmData: FilmFormData) => void
  editFilm: (filmData: FilmFormData, id: string) => void
  deleteFilm: (id: string) => boolean
}

export function useFilms(): FilmsData {
  const { currentUser } = useAuth()
  const films = ref<Film[]>([])

  const error = ref<string>('')
  const loading = ref<boolean>(false)

  // обновление localStorage при изменении фильмов
  watch(
    films,
    (newFilms) => {
      saveFilmsToLocalStore(newFilms)
    },
    { deep: true },
  )

  /**
   * load films from Storage
   */
  function loadFilms(): void {
    error.value = ''
    loading.value = true

    try {
      const savedFilms = localStorage.getItem(STORAGE_KEYS.FILMS)
      if (savedFilms) {
        films.value = JSON.parse(savedFilms)
      } else {
        films.value = [...INITIAL_FILMS_DATA]
      }
    } catch (err: unknown) {
      console.error('Error initializing films:', err)

      error.value = 'Loading data error'
      films.value = [...INITIAL_FILMS_DATA]
    } finally {
      loading.value = false
    }
  }

  loadFilms()

  /**
   * save films to LocalStore
   * @param newFilms array films for saving
   * @returns undefined
   */
  function saveFilmsToLocalStore(newFilms: Film[]): void {
    error.value = ''

    try {
      localStorage.setItem(STORAGE_KEYS.FILMS, JSON.stringify(newFilms))
    } catch (err: unknown) {
      console.error('Error saving to localStorage:', err)
      error.value = 'Saving data error'
    } finally {
      loading.value = false
    }
  }

  /**
   * method for get film list for current user
   * @returns array of films
   */
  function getUserFilmsList(): Film[] {
    const userLogin: string | undefined = currentUser.value?.login
    if (!userLogin) {
      error.value = 'Authorization required'
      return []
    }

    error.value = ''
    loading.value = true

    try {
      return films.value.filter((film) => film.user === userLogin)
    } catch (err: unknown) {
      error.value = 'An error has occurred'
      console.log(`Films Error: ${err}`)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * method for get film data by id
   * @param id film id
   * @returns film or null
   */
  function getUserFilmById(id: string): Film | null {
    const userLogin: string | undefined = currentUser.value?.login
    if (!userLogin) {
      error.value = 'Authorization required'
      return null
    }

    const film: Film | undefined = films.value.find((film) => film.id === id)

    return film?.user === userLogin ? film : null
  }

  /**
   * method for add new film
   * @param filmData film data for add
   * @returns undefined
   */
  function addFilm(filmData: FilmFormData): void {
    if (!currentUser.value) {
      error.value = 'Authorization required'
      return
    }

    error.value = ''
    loading.value = true

    try {
      const uuid = crypto.randomUUID()
      const newFilm: Film = {
        id: String(uuid),
        user: currentUser.value?.login,
        title: filmData.title,
        rating: filmData.rating,
        date: new Date().toISOString(),
        year: filmData.year,
        director: filmData.director,
      }

      films.value.push(newFilm)
      // фильм добавлен
    } catch (err: unknown) {
      error.value = 'Add film error'
      console.error('Add film error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * method for edit film
   * @param filmData film data for edit
   * @param id id film for edit
   * @returns undefined
   */
  function editFilm(filmData: FilmFormData, id: string): void {
    if (!currentUser.value) {
      error.value = 'Authorization required'
      return
    }

    error.value = ''
    loading.value = true

    try {
      const filmIndex = films.value.findIndex(
        (film) => film.id === id && film.user === currentUser.value?.login,
      )

      if (filmIndex === -1) {
        error.value = 'Can`t find film for edit'
        return
      }

      const currentFilmData: Film | undefined = films.value[filmIndex]

      if (currentFilmData) {
        const newFilmData: Film = {
          ...currentFilmData,
          ...filmData,
          date: new Date().toISOString(),
        }
        films.value[filmIndex] = newFilmData
      }
    } catch (err: unknown) {
      error.value = 'Add film error'
      console.error('Add film error:', err)
    } finally {
      loading.value = false
    }
  }

  function deleteFilm(id: string): boolean {
    if (!currentUser.value) {
      error.value = 'Authorization required'
      return false
    }

    error.value = ''
    loading.value = true

    try {
      const filmIndex: number | undefined = films.value.findIndex(
        (film) => film.id === id && film.user === currentUser.value?.login,
      )

      if (filmIndex === -1) {
        error.value = 'Can`t find film for delete'
        return false
      }

      films.value.splice(filmIndex, 1)
      return true
    } catch (err: unknown) {
      error.value = 'Delete film error'
      console.error('Delete film error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    error,
    loading,

    getUserFilmsList,
    getUserFilmById,
    addFilm,
    editFilm,
    deleteFilm,
  }
}
