<template>
  <div class="min-w-screen max-h-screen min-h-screen flex flex-col justify-between items-center bg-slate-200 overflow-hidden ">
    <ToolbarComponent v-if="!$route.meta.hideToolbar" />
    <RouterView />
  </div>
</template>

<script lang="ts" setup>

import ToolbarComponent from './components/toolbar-component.vue'
</script>
