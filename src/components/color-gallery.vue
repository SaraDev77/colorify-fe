<template>
   <ActionsToolbar/>
  <div class="flex flex-col justify-around py-4">
  
    <div class="flex justify-center">
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mx-4">
        <div
          v-for="(color, index) in data?.colors"
          :key="index"
          class="flex flex-col justify-center place-items-center gap-2"
        >
          <div
            class="w-32 h-32 rounded-full hover:animate-bounce shadow-md"
            :style="{ backgroundColor: color?.color }"
          ></div>
          <Message severity="contrast">"{{ color?.quote }}"</Message>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <PaginatorComponent
        :current-page="currentPage"
        :page-size="pageSize"
        :total-records="totalRecords!"
        :onPageChange="pageChange"
      />
    </div>
    
  </div>
 
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from 'primevue'
import PaginatorComponent from './paginator-component.vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { colorsService } from '../utils/colorRequests.util'
import type { PaginatorEvent } from '../models/paginator.model'
import ActionsToolbar from './actions-toolbar.vue'

const page = ref(1)
const perPage = ref(10)
const currentPage = ref(1)
const pageSize = ref(10)
const queryClient = useQueryClient()
const { data } = useQuery({
  queryKey: ['colors', { page: currentPage.value + 1, limit: perPage.value }],
  queryFn: () => colorsService.fetchColors(page.value, perPage.value),
})

const pagination = computed(() => data?.value?.pagination ?? {})
const totalRecords = computed(() => pagination.value.total ?? 0)


const pageChange = (event: PaginatorEvent) => {
  currentPage.value = event.page+1
  perPage.value = event.rows
  pageSize.value = event.rows
  page.value = currentPage.value
  queryClient.invalidateQueries({ queryKey: ['colors'] })
}

</script>
