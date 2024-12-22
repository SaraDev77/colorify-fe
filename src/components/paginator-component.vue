<template>
  <div class="card">
    <Paginator
      :totalRecords="totalRecords"
      :rows="pageSize"
      :first="(currentPage - 1) * pageSize"
      @page="onPageChange"
      :pt="{ root: { class: ' !bg-transparent' } }"
    ></Paginator>
  </div>
</template>

<script setup lang="ts">
import { Paginator } from 'primevue'
import type { PaginatorEvent } from '../models/paginator.model';
defineProps<{
  totalRecords: number
  pageSize: number
  currentPage: number
  onPageChange: (event:PaginatorEvent) => void
}>()
</script>
