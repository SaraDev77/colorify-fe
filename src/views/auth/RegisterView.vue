<template>
  <div class="flex flex-col justify-center place-items-center">
    <Form :validationSchema="validationSchema" @submit="userRegister">
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-palette pr-2 text-sky-400"></i>
          Register To Colorify
        </h2>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-gray-800 text-lg my-2">Email</label>
            <Field
              name="email"
              class="w-full h-14 border border-slate-200 p-4 block rounded-md text-gray-950"
              v-model="email"
              v-bind="emailAttrs"
            />
            <p class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="text-gray-800 text-lg my-2">Password</label>
            <Field
              name="password"
              class="w-full h-14 border border-slate-200 p-4 block rounded-md text-gray-950"
              type="password"
              v-model="password"
              v-bind="passwordAttrs"
            />
            <p class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>
          <Button
            class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500"
            type="submit"
            @click="userRegister"
          >
            Register
          </Button>
        </div>
      </div>
    </Form>
    <div
      class="mt-6 text-md text-sky-600 bg-slate-100 rounded-md p-4 bg-opacity-30 w-96 flex justify-center place-items-center gap-2"
    >
      <span class="flex justify-center place-items-center">Already Have An Account ? <RouterLink to="/login"><p class="font-bold underline px-2">Login</p></RouterLink></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from 'primevue'
import { Field, Form, useForm } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { authSchema } from '../../schemas/authForm.schema'
import { toTypedSchema } from '@vee-validate/zod'
import { RouterLink } from 'vue-router'

const formInputs = ref<formData>({ email: '', password: '' })
const authStore = useAuthStore()
const validationSchema = toTypedSchema(authSchema)

const { errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(authSchema),
  initialValues: formInputs.value,
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

watch(email, (newValue) => {
  formInputs.value.email = newValue!
})
watch(password, (newValue) => {
  formInputs.value.password = newValue!
})

const userRegister = async () => {
  try {
    const parsedData = authSchema.safeParse(formInputs.value)
    if (parsedData.success) {
      await authStore.register(formInputs.value)
    } else {
      parsedData.error.issues.forEach((issue) => {
        const field = issue.path.join('.') as keyof typeof formInputs.value
        setFieldError(field, issue.message)
      })
      const errorDetails = parsedData.error.issues.map((err) => err.message).join(', ')
      console.log(`Validation Error: ${errorDetails}`)
    }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const responseErr = err as { response: { data: { message: string } } }
      console.log(responseErr.response.data.message)
    } else {
      console.log('Unexpected error occurred.')
    }
  }
}
</script>
