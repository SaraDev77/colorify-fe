<template>
  <div class="min-w-screen min-h-screen flex flex-col justify-between place-items-center bg-slate-200">
    <ToolbarComponent v-if="!$route.meta.hideToolbar" />
    <RouterView />
  </div>
</template>

<script lang="ts" setup>

import ToolbarComponent from './components/toolbar-component.vue'
</script>
