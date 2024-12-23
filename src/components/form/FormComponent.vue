<template>
  <Form :validation-schema="validationSchema" @submit="submitData">
    <slot name="formTitle"></slot>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
       
        <slot name="color"></slot>
        <hr />
      </div>
      <div class="flex flex-col gap-2">
        <label for="quote" class="text-gray-800 text-lg my-2">Quote</label>
        <slot name="quote"></slot>
        <hr />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500"
          @click="props.submitData"
          >Submit</Button
        >
        <Button
          class="!rounded-md !bg-red-600 !border-none hover:!bg-red-500"
          @click="props.closeOverlay"
          >Close</Button
        >
      </div>
    </div>
  </Form>

</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from 'primevue'
import { Form } from 'vee-validate'

const props = defineProps<{
  submitData: () => void
  closeOverlay: () => void
  validationSchema: Zod.AnyZodObject
}>()

const validationSchema = toTypedSchema(props.validationSchema)

</script>
