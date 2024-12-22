<template>
  <FormComponent
    :submit-data="submitData"
    :close-overlay="closeOverlay"
    :validation-schema="addSchema"
  >
    <template #formTitle>
      <h1 class="font-bold text-xl text-slate-950 mb-4">Add New Color</h1>
    </template>
    <template #color>
      <Field
        name="color"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-bind="colorAttrs"
      />
      <p class="!text-red-500 !text-sm">{{ errors.color }}</p>
    </template>
    <template #quote>
      <Field
        name="quote"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-bind="quoteAttrs"
      />
      <p class="!text-red-500 !text-sm">{{ errors.quote }}</p>
    </template>
  </FormComponent>
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Field, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import FormComponent from './FormComponent.vue'
import { toTypedSchema } from '@vee-validate/zod'
import type { Color } from '../../models/color.model'
import { addSchema } from '../../schemas/color.schema'
import { colorsService } from '../../utils/colorRequests.util'

const queryClient = useQueryClient()

const props = defineProps<{
  closeOverlay: () => void
}>()

const formData = ref<Omit<Color, '_id'>>({
  color: '',
  quote: '',
})

const { defineField, setFieldError,errors } = useForm({
  validationSchema: toTypedSchema(addSchema),
  initialValues: formData.value,
})

const [color, colorAttrs] = defineField('color')
const [quote, quoteAttrs] = defineField('quote')

// Sync formData with color and quote fields
watch(color, (newValue) => {
  formData.value.color = newValue!
})
watch(quote, (newValue) => {
  formData.value.quote = newValue!
})

const { mutate } = useMutation({
  mutationFn: (color: Omit<Color, '_id'>) => {
    return colorsService.createColor(color)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['colors'] })
    setTimeout(() => {
      props.closeOverlay()
    }, 1000)
  },
})

const submitData = () => {
  const parsed = addSchema.safeParse(formData.value)
  if (parsed.success) {
    mutate(formData.value)
  } else {
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof typeof formData.value
      if (field === 'color' || field === 'quote') {
        setFieldError(field, issue.message)
      }
    })
    console.error(parsed.error)
  }
}
</script>
