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

export type FilmFormData = Pick<Film, 'title' | 'rating' | 'year' | 'director'>

const filmsData: Film[] = [
  {
    id: '1',
    user: 'marina',
    title: 'Terminator',
    description: `История противостояния солдата Кайла Риза и киборга-терминатора, прибывших в 1984 год из пост-апокалиптического будущего, где миром правят машины-убийцы, а человечество находится на грани вымирания.`,
    rating: 9.0,
    year: '1984',
    date: '2026.01.21T12:12:12',
    director: 'Джеймс Кемерон',
  },
  {
    id: '2',
    user: 'marina',
    title: 'Interstellar',
    description: `Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.`,
    rating: 9.5,
    year: '2014',
    date: '2026.01.20T12:12:12',
    director: 'Кристофер Нолан',
  },
  {
    id: '3',
    user: 'marina',
    title: 'The Devil Wears Prada',
    description: `Мечтающая стать журналисткой провинциальная девушка Энди по окончании университета получает должность помощницы всесильной Миранды Пристли, деспотичного редактора одного из крупнейших нью-йоркских журналов мод. Энди всегда мечтала о такой работе, не зная, с каким нервным напряжением это будет связано…`,
    rating: 8.5,
    year: '2006',
    date: '2026.01.22T12:12:12',
    director: 'Дэвид Фрэнкел',
  },
  {
    id: '4',
    user: 'max',
    title: 'Spider man',
    rating: 8.0,
    date: '2026.01.23T12:12:12',
    year: '2002',
    director: 'Сэм Рэйми',
  },
  {
    id: '5',
    user: 'max',
    title: "Harry Potter and the Sorcerer's Stone",
    rating: 9.0,
    date: '2026.01.23T12:12:12',
    year: '2001',
    director: 'Крис Коламбус',
  },
  {
    id: '6',
    user: 'max',
    title: 'Iron Man',
    rating: 9.5,
    date: '2026.01.23T12:12:12',
    year: '2008',
    director: 'Джон Фавро',
  },
]

interface FilmsData {
  films: Ref<Film[]>

  error: Ref<string>
  loading: Ref<boolean>

  getUserFilmsList: () => Film[]
  getUserFilmById: (id: string) => Film | null
  addFilm: (filmData: FilmFormData) => void
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
      error.value = ''
      loading.value = true

      try {
        localStorage.setItem(STORAGE_KEYS.FILMS, JSON.stringify(newFilms))
      } catch (err: unknown) {
        console.error('Error saving to localStorage:', err)
        error.value = 'Saving data error'
      } finally {
        loading.value = false
      }
    },
    { deep: true },
  )

  function initFilms(): void {
    error.value = ''
    loading.value = true

    try {
      const savedFilms = localStorage.getItem(STORAGE_KEYS.FILMS)
      if (savedFilms) {
        films.value = JSON.parse(savedFilms)
      } else {
        films.value = [...filmsData]
      }
    } catch (err: unknown) {
      console.error('Error initializing films:', err)

      error.value = 'Loading data error'
      films.value = [...filmsData]
    } finally {
      loading.value = false
    }
  }

  initFilms()

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

  function getUserFilmById(id: string): Film | null {
    const userLogin: string | undefined = currentUser.value?.login
    if (!userLogin) {
      error.value = 'Authorization required'
      return null
    }

    const film: Film | undefined = films.value.find((film) => film.id === id)

    return film?.user === userLogin ? film : null
  }

  function addFilm(filmData: FilmFormData): void {
    if (!currentUser.value) {
      error.value = 'Authorization required'
      return
    }

    error.value = ''
    loading.value = true

    try {
      const newFilm: Film = {
        id: String(films.value.length + 1),
        user: currentUser.value?.login,
        title: filmData.title,
        rating: filmData.rating,
        date: new Date().toISOString(),
        year: filmData.year,
        director: filmData.director,
      }

      films.value.push(newFilm)
    } catch (err: unknown) {
      error.value = 'Add film error'
      console.error('Add film error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    films,

    error,
    loading,

    getUserFilmsList,
    getUserFilmById,
    addFilm,
  }
}
