import type { DecodedToken } from '@/models/decoded-token.model'
import type { User } from '@/models/user.model'
import router from '@/router'
import { defineAbility, type PureAbility } from '@casl/ability'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteMeta } from 'vue-router'
import apiClient from '../interceptors/client'
import { ROLES_DICTIONARY, type Permission } from '../lib/roles-and-permissions/roles'
import type { formData } from '../models/auth.model'
import axios from 'axios'
export const useAuthStore = defineStore(
  'auth-store',
  () => {
    const user = ref<User | null>(null)
    const ability = ref<PureAbility>()
    const isAuthenticated = computed(() => !!user.value)

    const setUser = (newUserValue: User|null) => {
      user.value = newUserValue
      updatePermissions()
    }

    const initializePermissions = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ability.value = defineAbility((_) => {})
      updatePermissions()
    }

    const updatePermissions = () => {
      const userRole = user.value?.role
      if (userRole) {
        ability.value?.update(
          ROLES_DICTIONARY[userRole].map(({ action, resource }) => {
            return { action, subject: resource }
          }),
        )
      }
    }

    const isRouteAuthorized = (routeMeta: RouteMeta) => {
      return (
        !routeMeta.permission ||
        ability.value?.can(
          (routeMeta.permission as Permission).action,
          (routeMeta.permission as Permission).resource,
        )
      )
    }

    const login = async (formData: formData): Promise<void> => {
      try {
        const response = await apiClient.post('/api/auth/login', formData)
        const decodedToken = jwtDecode<DecodedToken>(response.data.accessToken)
        const loggedInUser: User = {
          email: formData.email,
          token: response.data.accessToken,
          role: decodedToken.role,
        }
        setUser(loggedInUser)
        router.replace('/home')
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Login failed:', error.response.data)
          console.error('Error status:', error.response.status)
        } else {
          console.error('Unexpected error:', error)
        }
    
        // Rethrow the error if necessary
        throw error
      }
    }

    const register = async (formData: formData): Promise<void> => {
      try {
        const response = await apiClient.post('/api/auth/register', formData)
        const decodedToken = jwtDecode<DecodedToken>(response.data.accessToken)
        const loggedInUser: User = {
          email: formData.email,
          token: response.data.accessToken,
          role: decodedToken.role,
        }
        setUser(loggedInUser)
        router.replace('/home')
      } catch (error) {
        throw error
      }
    }

    const localLogout = () => {
      resetTheStore()
      router.replace('/')
    }

    const resetTheStore = () => {
      user.value = null
      ability.value?.update([]) 
    }

    return {
      user,
      setUser,
      login,
      register,
      localLogout,
      isRouteAuthorized,
      isAuthenticated,
      initializePermissions,
      ability,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['user'],
    },
  },
)
