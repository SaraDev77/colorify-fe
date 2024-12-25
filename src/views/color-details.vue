<template>
  
  <div v-if="isLoading" class="min-h-screen min-w-full flex justify-center items-center ">
    <LoaderComponent />
  </div> 
  <div 
    v-else
    class="min-h-screen min-w-full flex justify-center items-center rounded-lg"
    :style="{ backgroundColor: '#' + data?.color }"
  >
    <div class="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-96 text-center">
      <h1 class="text-2xl font-bold mb-4">Your Color Information</h1>
      <p class="text-gray-700 mb-2"><strong>Hex Code:</strong> #{{ data?.color }}</p>
      <p class="text-gray-700"><strong>Quote:</strong> "{{ data?.quote }}"</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Color } from '@/models/color.model';
import { colorsService } from '@/utils/color-requests.util';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router'
import LoaderComponent from '../components/loader/loader-component.vue'

const route = useRoute()
const colorId = route.params.id

const { data, isLoading } = useQuery({
  queryKey: ['colors', colorId],
  queryFn: () => colorsService.fetchSingleColor(String(colorId)),
  select: (data: Color) => {
    return {
    color:data.color,
    quote:data.quote
    }
  },
})
</script>
