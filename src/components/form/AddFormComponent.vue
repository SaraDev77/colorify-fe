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
      <label for="color" class="text-gray-800 text-lg my-2">Color</label>
      <Field
        name="color"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-bind="colorAttrs"
      >
        <ColorPicker v-model="color"  format="hex" inline />
      </Field>
      <p class="!text-red-500 !text-sm">{{ errors.color }}</p>
    </template>
    <template #quote>
      <Field
        name="quote"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-model="quote"
        v-bind="quoteAttrs"
      />
      <p class="!text-red-500 !text-sm">{{ errors.quote }}</p>
    </template>
  </FormComponent>
  <Toaster/>
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Field, useForm } from 'vee-validate'
import { ref } from 'vue'
import FormComponent from './FormComponent.vue'
import { toTypedSchema } from '@vee-validate/zod'
import type { colorRequest } from '../../models/color.model'
import { addSchema } from '../../schemas/color.schema'
import { colorsService } from '../../utils/colorRequests.util'
import { ColorPicker } from 'primevue'
import { watch } from 'vue'
import { toast, Toaster } from 'vue-sonner';

const queryClient = useQueryClient()

const props = defineProps<{
  closeOverlay: () => void
}>()


const formData = ref<colorRequest>({
  color: '',  
  quote: ''   
})

const { defineField, setFieldError, errors } = useForm({
  validationSchema: toTypedSchema(addSchema),
  initialValues: formData.value,
})

const [color, colorAttrs] = defineField('color')
const [quote, quoteAttrs] = defineField('quote')

watch(color, (newValue) => {
  formData.value.color = newValue!
})
watch(quote, (newValue) => {
  formData.value.quote = newValue!
})

const { mutate } = useMutation({
  mutationFn: (color:colorRequest) => {
    return colorsService.createColor(color)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['colors'] })
    setTimeout(() => {
      props.closeOverlay()
    }, 1000)
    toast.success('New Color Has Been Added Successfully , Yay ! ')
  },
})

const submitData = () => {
  const parsed = addSchema.safeParse(formData.value)
    if (parsed.success) {
    mutate(formData.value)
  } else {
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.') as keyof typeof formData.value
      if (field === 'color' || field === 'quote') {
        setFieldError(field, issue.message)
      }
    })
    toast.error('Recheck Your Entered Data, Please!')
    toast.error(parsed.error)
  }
}
</script>
