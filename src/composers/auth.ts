import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface User {
  login: string
  password: string
  name: string
}

export type UserData = Omit<User, 'password'>

export interface AuthData {
  login: Ref<string>
  password: Ref<string>
  error: Ref<string>
  loading: Ref<boolean>

  currentUser: Ref<UserData | null>
  isAuthenticated: ComputedRef<boolean>

  handleAuth: () => void
  handleLogout: () => void
}

//Зарегистрированные пользователи. Хранить на сервере
const users: User[] = [
  { login: 'marina', password: 'pa$$123', name: 'Marina' },
  { login: 'max', password: 'pass123', name: 'Max' },
]

export function useAuth(): AuthData {
  const router = useRouter()

  const login = ref<string>('')
  const password = ref<string>('')
  const error = ref<string>('')
  const loading = ref<boolean>(false)

  const currentUser = ref<UserData | null>(null)

  const isAuthenticated = computed<boolean>(() => !!localStorage.getItem('token'))

  function initUser(): void {
    const savedUser = localStorage.getItem('user')

    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser)
      } catch {
        cleanAuthData()
      }
    }
  }

  initUser()

  function generateToken(login: string): string {
    return btoa(`${login}_${Date.now()}_${Math.random()}`)
  }

  async function handleAuth(): Promise<void> {
    error.value = ''
    loading.value = true

    try {
      // имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 500))

      // поиск пользователя
      const foundUser = users.find(
        (item) => item.login === login.value.toLowerCase() && item.password === password.value,
      )

      if (foundUser) {
        const userData: UserData = {
          login: foundUser.login,
          name: foundUser.name,
        }
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', generateToken(login.value))

        currentUser.value = userData

        cleanFormData()

        // Редирект
        router.push('/')
      } else {
        error.value = 'Incorrect login and password'
      }
    } catch (err: unknown) {
      error.value = 'An error has occurred'
      console.log(`Auth Error: ${err}`)
    } finally {
      loading.value = false
    }
  }

  async function handleLogout(): Promise<void> {
    loading.value = true

    try {
      // имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 300))

      cleanAuthData()
      cleanFormData()

      // Редирект
      router.push('/login')
    } catch {
    } finally {
      loading.value = false
    }

    cleanFormData()
    currentUser.value = null
  }

  function cleanFormData(): void {
    login.value = ''
    password.value = ''
    error.value = ''
  }

  function cleanAuthData(): void {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    login,
    password,
    error,
    loading,

    currentUser,

    isAuthenticated,
    handleAuth,
    handleLogout,
  }
}
