<template>
    <div v-if="isLoading" class="min-h-full min-w-full flex justify-center mb-auto mt-24">
    <LoaderComponent />
  </div>
  <div v-else class="min-w-screen min-h-screen overflow-y-hidden justify-center place-items-center " :style="{ backgroundColor: '#' + data?.color }" >
    <div class="w-full h-full bg-gray-900 bg-opacity-20 flex flex-col justify-self-start p-14 rounded-md shadow-sm" 
    >
     <p class="text-xl text-slate-950">Your Color Hex Code Is : #{{ data?.color }}</p>
     <p class="text-xl text-slate-950">Your Quote For The Color : " {{ data?.quote }} "</p>
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
