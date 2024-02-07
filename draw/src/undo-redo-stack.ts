import clone from 'nanoclone'
import chalk from 'chalk'

interface UndoRedoSnapshot {
  state: any
  name?: string
}

export class UndoRedoStack {
  stack = [] as UndoRedoSnapshot[]
  index = -1

  constructor(initialState: any) {
    this.index = 0
    this.stack = [{ state: this.clone(initialState), name: 'initial' }]
  }

  get initialized() {
    return this.stack.length > 0
  }

  snapshot(state: any, name: string) {
    if (!this.initialized) throw new Error('Not initialized - call initialize(initialState)')
    this.index++
    this.stack = this.stack.slice(0, this.index)
    this.stack.push({ state: this.clone(state), name })
  }

  get canUndo() {
    return this.initialized && this.index > 0
  }

  undo() {
    if (!this.canUndo) throw new Error('Nothing to undo')

    return this.clone(this.stack[--this.index].state)
  }

  get canRedo() {
    return this.initialized && this.stack.length > 0 && this.index < this.stack.length - 1
  }

  redo() {
    if (!this.canRedo) throw new Error('Nothing to redo')

    return this.clone(this.stack[++this.index].state)
  }

  private clone(state: any) {
    const hasCloneMethod = (obj: any) => typeof obj.clone === 'function'

    if (Array.isArray(state)) {
      return state.map(item => hasCloneMethod(item) ? item.clone() : clone(item))
    } else {
      return hasCloneMethod(clone) ? state.clone() : clone(state)
    }
  }

  get debug() {
    const undo = this.canUndo ? chalk.green(true) : chalk.red(false)
    const redo = this.canRedo ? chalk.green(true) : chalk.red(false)
    const index = chalk.white(this.index)
    const buffer = this.stack
      .map(x => JSON.stringify(x))
      .map((x, idx) => idx === this.index ? chalk.green(x) : chalk.gray(x))
      .join(' => ')

    return `canUndo: ${undo}; canRedo: ${redo}; index: ${index}; stack: [${buffer}]`
  }
}
