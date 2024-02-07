import type { Ref } from 'vue'

import type { UndoRedoStack } from '@/undo-redo-stack'
import type { Command } from '@/command'

import type { Shape } from './Shape'
import { Rect } from './Rect'

class BaseCommand {
  #undoRedoStack: Ref<UndoRedoStack>
  #store: Ref<Shape[]>

  constructor(
    undoRedoStack: Ref<UndoRedoStack>,
    store: Ref<Shape[]>,
  ) {
    this.#undoRedoStack = undoRedoStack
    this.#store = store
  }

  get undoRedoStack() {
    return this.#undoRedoStack.value
  }

  get store() {
    return this.#store.value
  }

  set store(value: Shape[]) {
    this.#store.value = value
  }
}

export class CreateRectangleCommand extends BaseCommand implements Command {
  caption = 'Create rectangle'
  enabled = true

  execute() {
    if (this.enabled) {
      const rect = new Rect().initialize()
      rect.on('resize', () => { this.undoRedoStack.snapshot(this.store, 'Resize') })
      rect.on('move', () => { this.undoRedoStack.snapshot(this.store, 'Move') })
      this.store.push(rect)
      this.undoRedoStack.snapshot(this.store, 'Create rectangle')
    }
  }
}

export class UndoCommand extends BaseCommand implements Command {
  caption = 'Undo'

  get enabled() {
    return this.undoRedoStack.canUndo
  }

  execute() {
    if (this.enabled) this.store = this.undoRedoStack.undo()
  }
}

export class RedoCommand extends BaseCommand implements Command {
  caption = 'Redo'

  get enabled() {
    return this.undoRedoStack.canRedo
  }

  execute() {
    if (this.enabled) this.store = this.undoRedoStack.redo()
  }
}
