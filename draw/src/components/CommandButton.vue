<template>
  <button :disabled="!command.enabled" @click="command?.execute()">
    {{ command.caption }}
  </button>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { type Command } from '@/command'

defineProps({
  command: { type: Object as PropType<Command>, required: true },
})
</script>
