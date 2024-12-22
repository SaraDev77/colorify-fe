
<template>
    <div class="card place-self-start bg-transparent ">
        <Toolbar class="!bg-transparent">
            <template #start>
                <Button icon="pi pi-plus" class="mr-2 !bg-teal-200 !text-blue-950 !rounded-full" severity="secondary" text />
            </template>

            <template #center>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" />
                </IconField>
            </template>

            <template #end> <SplitButton label="Save" :model="items"></SplitButton></template>
        </Toolbar>
    </div>
</template>

<script setup lang="ts">
import { Button, IconField, InputIcon, InputText, Toolbar } from 'primevue';
import { ref } from 'vue';

const items = ref([
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-times'
    }
])
</script>
