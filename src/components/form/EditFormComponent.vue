<template>
  <FormComponent
    :submit-data="submitData"
    :close-overlay="closeOverlay"
    :validation-schema="addSchema"
  >
    <template #formTitle>
      <h1 class="font-bold text-xl text-slate-950 mb-4">Edit Color</h1>
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
  previousColorData: Color
}>()

const formData = ref<Omit<Color, '_id'>>({
  color: props.previousColorData.color,
  quote: props.previousColorData.quote,
})

const { defineField, setFieldError, errors } = useForm({
  validationSchema: toTypedSchema(addSchema),
  initialValues: formData.value,
})

const [quote, quoteAttrs] = defineField('quote')

watch(quote, (newValue) => {
  formData.value.quote = newValue!
})

const { mutate } = useMutation({
  mutationFn: (color: Omit<Color, '_id'>) => {
    return colorsService.updateColor(color, props.previousColorData._id)
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
