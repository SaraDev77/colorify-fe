
<template>
    <div class="w-full p-5">
        <div class="!bg-transparent !flex !justify-between" >
          <IconField>
                  <InputIcon>
                      <i class="pi pi-search" />
                  </InputIcon>
                  <InputText placeholder="Search" class="hover:!border-sky-200 focus:!border-sky-300"  v-model="searchQuery" />
              </IconField>
            <Button @click="()=>showOverlay=true" class="mr-2 !bg-sky-200 !text-blue-950 !rounded-full" severity="secondary" text ><i class="pi pi-palette"></i>Add New</Button></div>   
         </div>
    <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay">
      <AddFormComponent :close-overlay="closeOverlay" />
    </OverlayComponent>
</template>

<script setup lang="ts">
import { Button, IconField, InputIcon, InputText,  } from 'primevue';
import { computed, ref } from 'vue';
import { useUrlSearchParams } from '@vueuse/core'
import OverlayComponent from './overlay-component.vue';
import AddFormComponent from './form/add-form.vue';

const showOverlay = ref<boolean>(false)
const params = useUrlSearchParams('history', { removeNullishValues: true })

const searchQuery = computed({
  get: () => {
    const value = params.search
    return Array.isArray(value) ? value.join(', ') : value || ''
  },
  set: (value) => {
    params.search = value || []
    emitSearch()
  },
})

const closeOverlay = () => {
  showOverlay.value = false
}
const emit = defineEmits<{
  (e: 'searchColors', value: string): void
}>()
const emitSearch = () => {
  emit('searchColors', searchQuery.value)
}

</script>
