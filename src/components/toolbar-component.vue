<template>
  <div class="card w-full ">
    <Toolbar style=" padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
      <RouterLink to="/home" class="flex gap-3"> <Avatar><img :src="image" /></Avatar>
        <h2 class="font-semibold text-lg text-gray-950">Colorify</h2></RouterLink> 
      </template>
      <template #end>
        <Avatar
          shape="circle"
          size="large"
          class="!text-xl !font-semi-bold cursor-pointer !bg-sky-600 !text-slate-50"
          @click="toggle"
        >
          {{ useAuthStore().user?.email.charAt(0).toUpperCase() }}
        </Avatar>
        <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
      </template>
    </Toolbar>
  </div>
</template>

<script lang="ts" setup>
import { Avatar, TieredMenu, Toolbar } from 'primevue'
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


</script>
