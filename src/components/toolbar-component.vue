<template>
  <div class="card min-w-full mx-2">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
        <Avatar><img :src="image" /></Avatar>
        <h2 class="font-semibold text-lg text-gray-950">Colorify</h2>
      </template>

      <template #end>
        <div class="border-r-2 border-violet-100 mr-2">
          <Button class="h-12 w-12 mr-4 !bg-violet-400 !bg-opacity-90 !border-0 !rounded-full" @click="openOverlay">
            Add</Button
          >
        </div>
        <Avatar
          shape="circle"
          size="large"
          style="background-color: #ece9fc; color: #2a1261"
          class="!text-xl !font-bold cursor-pointer"
          @click="toggle"
        >
          {{ useAuthStore().user?.email.charAt(0) }}
        </Avatar>
        <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
      </template>
    </Toolbar>
  </div>
</template>

<script lang="ts" setup>
import { Avatar, Button, TieredMenu, Toolbar } from 'primevue'
import { useAuthStore } from '../stores/auth.store'
import { ref } from 'vue'
import image from '../assets/color-palette-vector-illustration.jpg'
const menu = ref()
const signOut = () => useAuthStore().localLogout()

const items = ref([
  {
    label: useAuthStore().user?.email,
    icon: 'pi pi-user',
  },

  {
    label: useAuthStore().user?.role.toLowerCase(),
    icon: 'pi pi-id-card',
  },
  {
    separator: true,
  },
  {
    icon: 'pi pi-sign-out',
    label: 'Logout',
    command: signOut,
  },
])

const toggle = (event: EventListener) => {
  menu.value.toggle(event)
}

const emit = defineEmits<{
  (event: 'openOverlay'): void
}>()

const openOverlay = () => {
  emit('openOverlay')
}

</script>
