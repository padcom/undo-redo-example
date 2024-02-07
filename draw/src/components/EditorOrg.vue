<template>
  <div>
    <button @click="undo">Undo</button>
    <button @click="redo">Redo</button>
  </div>

  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs"
    style="background-color: #f8f8f8"
    @click="selected = null"
    @mousemove="dragged?.move({ x: $event.clientX, y: $event.clientY })"
  >
    <defs />
    <component :is="shape.type" v-for="shape in shapes" :key="shape.id"
      v-bind="shape.attrs"
      @click.stop="selected = shape"
      @mousedown.stop="shape.body.activate({ x: $event.clientX, y: $event.clientY }); dragged = shape.body"
      @mouseup.stop="shape.body.deactivate(); dragged = null"
    />
    <circle v-for="vertex in vertices" :key="vertex.id" :class="{ dragging: vertex.dragging }"
      :cx="vertex.x" :cy="vertex.y" r="5"
      stroke="red" :stroke-width="vertex.dragging ? 4 : 2" fill="transparent"
      @click.stop
      @mousedown.stop="vertex.activate({ x: $event.clientX, y: $event.clientY }); dragged = vertex"
      @mouseup.stop="vertex.deactivate(); dragged = null"
    />
  </svg>
  <pre><code>{{ toJSON(shapes) }}</code></pre>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import { toJSON } from 'flatted'
import { UndoRedoStack } from '../undo-redo-stack'

interface Coords {
  x: number
  y: number
}

interface Vertex {
  id: string
  x: number
  y: number
  dragging: boolean

  activate(coords: Coords): void
  move(coords: Coords): void
  update(delta: Coords): void
  deactivate(): void
}

interface Shape {
  id: string | number
  get type(): string
  get attrs(): Record<string, string | number>;
  get vertices(): Vertex[]
  get body(): Vertex
}

class BaseShape {
  constructor(
    public id: string | number,
    public type: string,
  ) {}
}

abstract class BaseVertex implements Vertex {
  private modified = false

  id = uuid()

  get x() {
    return 0
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set x(value: number) {
  }

  get y() {
    return 0
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set y(value: number) {
  }

  dragging = false
  origin: Coords | null = null

  activate(origin: Coords) {
    console.log(`${this.constructor.name}.activate()`)
    this.origin = origin
    this.dragging = true
  }

  move(coords: Coords) {
    // console.log(`${this.constructor.name}.move()`, this.dragging)

    if (this.dragging) {
      const delta = {
        x: coords.x - this.origin!.x,
        y: coords.y - this.origin!.y,
      }
      this.update(delta)
      this.origin = coords
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: Coords) {
    console.log(`${this.constructor.name}.update()`)

    this.x = this.x + delta.x
    this.y = this.y + delta.y

    this.modified = true
  }

  deactivate() {
    console.log(`${this.constructor.name}.deactivate()`)

    this.dragging = false
    this.origin = null

    if (this.modified) {
      undoRedoStack.snapshot(shapes.value, 'Changed')
    }
  }
}

class TopLeftRectVertex extends BaseVertex {
  constructor(private rect: Rect) {
    super()
  }

  get x() {
    return this.rect.x
  }

  set x(value: number) {
    const delta = value - this.rect.x
    this.rect.x = value
    this.rect.width = this.rect.width - delta
  }

  get y() {
    return this.rect.y
  }

  set y(value: number) {
    const delta = value - this.rect.y
    this.rect.y = value
    this.rect.height = this.rect.height - delta
  }
}

class BottomRightRectVertex extends BaseVertex {
  constructor(private rect: Rect) {
    super()
  }

  get x() {
    return this.rect.x + this.rect.width
  }

  set x(value: number) {
    this.rect.width = value - this.rect.x
  }

  get y() {
    return this.rect.y + this.rect.height
  }

  set y(value: number) {
    this.rect.height = value - this.rect.y
  }
}

class BodyRectVertex extends BaseVertex {
  constructor(private rect: Rect) {
    super()
  }

  get x() {
    // eslint-disable-next-line no-extra-parens
    return this.rect.x
  }

  set x(value: number) {
    this.rect.x = value
  }

  get y() {
    return this.rect.y
  }

  set y(value: number) {
    console.log('BodyVertex set y')
    this.rect.y = value
  }
}

class Rect extends BaseShape implements Shape {
  x = 10
  y = 10
  width = 100
  height = 50
  vertices: Vertex[]
  body: Vertex

  constructor() {
    super(uuid(), 'rect')

    this.vertices = [
      new TopLeftRectVertex(this),
      new BottomRightRectVertex(this),
    ]
    this.body = new BodyRectVertex(this)
  }

  get attrs() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  clone() {
    const result = new Rect()
    result.x = this.x
    result.y = this.y
    result.width = this.width
    result.height = this.height

    return result
  }
}

const shapes = ref([new Rect()] as Shape[])

const selected = ref(null as Shape | null)
const vertices = computed(() => selected.value?.vertices)
const dragged = ref(null as Vertex | null)

const undoRedoStack = new UndoRedoStack(shapes.value)

function undo() {
  if (undoRedoStack.canUndo) {
    selected.value = null
    dragged.value = null
    shapes.value = undoRedoStack.undo()
  }
}

function redo() {
  if (undoRedoStack.canRedo) {
    selected.value = null
    dragged.value = null
    shapes.value = undoRedoStack.redo()
  }
}
</script>
