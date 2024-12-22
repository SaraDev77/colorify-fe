<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted playsinline>
      <source :src="video" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-gray-100">
      <h1 class="text-9xl font-bold opacity-85 border-b-2 border-sky-950">Colorify</h1>
      <p class="text-md font-semibold text-gray-200">your portal to a colorfull world</p>
      <div class="flex flex-col items-center gap-2 mt-4">
        <span
          class="animate-bounce h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center bg-slate-950"
        >
          <i class="pi pi-arrow-down" />
        </span>
      </div>
      <RouterLink to="/register"><p class="text-sky-700 font-semi-bold bg-slate-50 mt-8 p-4 rounded-md">Create An Account ?</p></RouterLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import video from '../assets/videos/video.mp4'
</script>
