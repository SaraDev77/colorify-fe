<template>
 
     <div class="min-w-screen min-h-screen flex flex-col justify-center place-items-center">
      <Form :validationSchema="validationSchema" @submit="userLogin">
        <div class="flex flex-col gap-2 w-96 place-items-center">
        <div class="min-w-96" v-if="message.length"><Message severity="error" class="!flex-1" closable>{{ message }}</Message></div>

        <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
          
          <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
            <i class="pi pi-palette pr-2 text-sky-400"></i>
            Login To Colorify
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
              @click="userLogin"
              :loading="isLoading"
            >
              Login
            </Button>
          </div>
        </div></div>
      </Form>
      <div
        class="mt-6 text-md text-sky-600 bg-slate-100 rounded-md p-4 bg-opacity-30 w-96 flex justify-center place-items-center gap-2"
      >
        <span class="flex justify-center place-items-center">No Account ? <RouterLink to="/register"><p class="font-bold underline px-2">Register</p></RouterLink></span>
      </div>     

    </div> 
  </template>
  
  <script lang="ts" setup>
  import { Button,Message } from 'primevue'
  import { Field, Form, useForm } from 'vee-validate'
  import type { formData } from '../../models/auth.model'
  import { ref, watch } from 'vue'
  import { useAuthStore } from '../../stores/auth.store'
  import { authSchema } from '../../schemas/auth-form.schema'
  import { toTypedSchema } from '@vee-validate/zod'
  import { RouterLink } from 'vue-router'
  import type { BackendErrorResponse } from '@/models/error.model'
  
  const formInputs = ref<formData>({ email: '', password: '' })
  const authStore = useAuthStore()
  const validationSchema = toTypedSchema(authSchema)
  const { errors, defineField, setFieldError } = useForm({
    validationSchema: toTypedSchema(authSchema),
    initialValues: formInputs.value,
  })
  const [email, emailAttrs] = defineField('email')
  const [password, passwordAttrs] = defineField('password')
  const message = ref('')
  const isLoading=ref(false)

  watch(email, (newValue) => {
    formInputs.value.email = newValue!
  })
  watch(password, (newValue) => {
    formInputs.value.password = newValue!
  })
  
  
    watch(errors, (newErrors) => {
    if (!Object.keys(newErrors).length) {
      message.value = ''; 
    }
  }, { deep: true });
  
    const showMessage = (msg:string, duration = 20000) => {
    message.value = msg; 
    if (msg) {
      setTimeout(() => {
        message.value = '';
      }, duration);
    }
  };
  

  const userLogin = async () => {
    const parsedData = authSchema.safeParse(formInputs.value);
    if (parsedData.success) {
      try {
        isLoading.value = true;
        await authStore.login(formInputs.value)
      }  catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as BackendErrorResponse).response &&
        typeof (err as BackendErrorResponse).response.data === 'object' &&
        'message' in (err as BackendErrorResponse).response.data
      ) {
        const backendMessage = (err as BackendErrorResponse).response.data.message;
        if (typeof backendMessage === 'string') {
          showMessage(backendMessage);
        } else {
          showMessage('An error occurred, but no message was provided.');
        }
      } else {
        showMessage('An unexpected error occurred. Please try again.');
      } } finally {
        isLoading.value = false;
      }
    } else {
      parsedData.error.issues.forEach((issue) => {
        const field = issue.path.join('.') as keyof typeof formInputs.value;
        setFieldError(field, issue.message);
      });
      const errorDetails = parsedData.error.issues.map((err) => err.message).join(', ');
      showMessage(errorDetails);
    }
  };
  </script>
  