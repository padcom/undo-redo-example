<template>
  <div class="stack">
    <div v-for="(entry, index) in entries" :key="index" :class="{ current: currentIndex === index }">
      {{ entry.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import type { UndoRedoStack } from '@/undo-redo-stack'

const props = defineProps({
  stack: { type: Object as PropType<UndoRedoStack>, required: true },
})

const entries = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initial, ...rest] = props.stack.stack

  return rest
})

const currentIndex = computed(() => props.stack.index - 1)
</script>

<style lang="postcss" scoped>
.stack {
  height: 100%;
  width: 200px;
  padding-left: 1rem;
  overflow: auto;

  & .current {
    font-weight: bold;
  }
}
</style>
