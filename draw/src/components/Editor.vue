<template>
  <Toolbar>
    <CommandButton :command="createRectangleCommand" />
    <CommandButton :command="undoCommand" />
    <CommandButton :command="redoCommand" />
  </Toolbar>

  <div class="editor">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs"
      style="background-color: #f8f8f8"
      @click="selected = null"
      @mousemove="dragged?.move({ x: $event.clientX, y: $event.clientY })"
    >
      <defs>
        <pattern id="grid" height="20" width="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="20" y2="0" stroke="#aaa" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#aaa" />
        </pattern>
      </defs>

      <!-- background -->
      <rect fill="url(#grid)" x="0" y="0" width="100%" height="100%" />

      <!-- shapes -->
      <component :is="shape.type" v-for="shape in store" :key="shape.id"
        v-bind="shape.attrs"
        @click.stop="selected = shape"
        @mousedown.stop="beginDrag(shape.body, $event.clientX, $event.clientY)"
        @mouseup.stop="endDrag(shape.body)"
      />

      <!-- vertices of selected shape -->
      <circle v-for="vertex in vertices" :key="vertex.id" :class="{ dragging: vertex.dragging }"
        :cx="vertex.x" :cy="vertex.y" r="5"
        stroke="red" :stroke-width="vertex.dragging ? 4 : 2" fill="transparent"
        @click.stop
        @mousedown.stop="beginDrag(vertex, $event.clientX, $event.clientY)"
        @mouseup.stop="endDrag(vertex)"
      />
    </svg>

    <UndoStack :stack="stack" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type Ref } from 'vue'

import Toolbar from './Toolbar.vue'
import CommandButton from './CommandButton.vue'
import UndoStack from './UndoStack.vue'

import type { Shape } from './editor/Shape'
import type { Vertex } from './editor/Vertex'
import { UndoRedoStack } from '@/undo-redo-stack'
import { CreateRectangleCommand, UndoCommand, RedoCommand } from './editor/commands'

const stack = ref(new UndoRedoStack([])) as Ref<UndoRedoStack>

const store = ref([] as Shape[])
const createRectangleCommand = new CreateRectangleCommand(stack, store)
const undoCommand = new UndoCommand(stack, store)
const redoCommand = new RedoCommand(stack, store)

const selected = ref(null as Shape | null)
const vertices = computed(() => selected.value?.vertices)
const dragged = ref(null as Vertex | null)

watch(store, () => {
  selected.value = null
  dragged.value = null
})

function beginDrag(vertex: Vertex | null, x: number, y: number) {
  vertex?.activate({ x, y })
  dragged.value = vertex
}

function endDrag(vertex: Vertex | null) {
  vertex?.deactivate()
  dragged.value = null
}
</script>

<style lang="postcss" scoped>
.editor {
  display: flex;
  height: 300px;
}
</style>
