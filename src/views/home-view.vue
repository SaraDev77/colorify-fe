<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center mb-auto mt-24">
    <LoaderComponent />
  </div>
  <div v-else class="flex flex-col min-h-full min-w-full">
    <ActionsToolbar @search-colors="onSearchColors" />
    <div class="flex flex-col gap-5 p-5 flex-1 overflow-hidden">
      <div class="flex flex-col justify-around py-4 flex-1 overflow-hidden">
        <div class="flex justify-center">
          <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mx-4">
            <div
              v-for="(color, index) in data?.colors"
              :key="index"
              class="flex flex-col justify-center place-items-center gap-2"
            >
              <RouterLink :to="`/details/${color._id}`">
                <div
                  class="w-32 h-32 rounded-full hover:animate-bounce shadow-md"
                  :style="{ backgroundColor: '#' + color.color }"
                ></div>
              </RouterLink>
              <div class="flex flex-col">
                <div class="mb-2 flex justify-end gap-2">
                  <i
                    v-if="authStore.user?.role === UserRole.SUPER_ADMIN"
                    @click="displayWarningOverlay(color)"
                    class="pi pi-eraser text-slate-950 hover:!text-red-600 cursor-pointer"
                  ></i>
                  <i
                    @click="displayEditOverlay(color)"
                    class="pi pi-pencil text-slate-950 hover:!text-sky-600 cursor-pointer"
                  ></i>
                </div>
                <Message severity="contrast" class="!flex !justify-center !min-w-48">{{ color?.quote }}</Message>
              </div>
            </div>
          </div>
        </div>
        <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeEditOverlay">
          <EditFormComponent :close-overlay="closeEditOverlay" :previousColorData="selectedColor!" />
        </OverlayComponent>
        <OverlayComponent :is-visible="showWarningOverlay" @closeOverlay="closeWarningOverlay">
          <div class="rounded-md flex flex-col justify-center place-items-center gap-4">
            <h1 class="text-lg text-gray-800 font-semibold">
              Are you sure you want to delete this color?
            </h1>
            <div class="flex gap-2">
              <Button
                @click="confirmDelete(selectedColor?._id!)"
                class="!bg-red-600 !border-none !px-9 hover:!bg-red-500"
              >
                Yes
              </Button>
              <Button
                class="!bg-gray-200 !text-gray-800 !border-none hover:!bg-gray-300"
                @click="closeWarningOverlay"
              >
                Cancel
              </Button>
            </div>
          </div>
        </OverlayComponent>
        <div class="mt-10">
          <PaginatorComponent
            :current-page="currentPage"
            :page-size="pageSize"
            :total-records="totalRecords"
            :onPageChange="pageChange"
          />
        </div>
      </div>
    </div>
  </div>
  <Toaster/>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, Message } from 'primevue';
import PaginatorComponent from '../components/paginator-component.vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { colorsService } from '../utils/color-requests.util';
import type { PaginatorEvent } from '../models/paginator.model';
import ActionsToolbar from '../components/actions-toolbar.vue';
import EditFormComponent from '@/components/form/edit-form.vue';
import OverlayComponent from '@/components/overlay-component.vue';
import type { Color } from '@/models/color.model';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/models/user-role.enum';
import { useDebounceFn, useUrlSearchParams } from '@vueuse/core';
import LoaderComponent from '../components/loader/loader-component.vue'
import { toast,Toaster } from 'vue-sonner';

const perPage = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const queryClient = useQueryClient();
const params = useUrlSearchParams();
const searchQuery = ref(params.search || '');

const onSearchColors = useDebounceFn((value: string) => {
  searchQuery.value = value;
  currentPage.value = 1;
  queryClient.invalidateQueries({ queryKey: ['colors'] })
}, 500);

const { data, isLoading } = useQuery({
  queryKey: ['colors', searchQuery, currentPage, perPage],
  queryFn: () => colorsService.fetchColors(currentPage.value, perPage.value, searchQuery.value as string),
  select: (data) => ({
    colors: data.colors, 
    pagination: data.pagination, 
  }),
});

const totalRecords = computed(() => {
  return searchQuery.value
    ? data?.value?.colors.length || 0
    : data?.value?.pagination?.total || 0;
});

const pageChange = (event: PaginatorEvent) => {
  currentPage.value = event.page + 1;
  perPage.value = event.rows;
  queryClient.invalidateQueries({ queryKey: ['colors'] });
};


watch(currentPage, (newPage) => {
  params.page = String(newPage);
});

watch(searchQuery, (newSearch) => {
  if (newSearch) {
    params.search = newSearch; 
  } else {
    delete params.search;
  }
});

const showWarningOverlay = ref(false);
const showOverlay = ref(false);
const selectedColor = ref<Color>();
const authStore = useAuthStore();

const closeEditOverlay = () => {
  showOverlay.value = false;
  selectedColor.value = undefined;
};

const displayEditOverlay = (color: Color) => {
  selectedColor.value = color;
  showOverlay.value = true;
};

const closeWarningOverlay = () => {
  showWarningOverlay.value = false;
  selectedColor.value = undefined;
};

const displayWarningOverlay = (color: Color) => {
  selectedColor.value = color;
  showWarningOverlay.value = true;
};

const confirmDelete = async (colorId:number) => {
  if (!colorId) return;
  mutate(String(colorId));
};

const { mutate } = useMutation({
  mutationFn: async (colorId: string) => colorsService.deleteColor(colorId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['colors'] });
    closeWarningOverlay();
    toast.success("Color Deleted Successfully")
  },
});

</script>
