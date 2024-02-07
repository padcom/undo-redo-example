import { describe, it, expect } from 'vitest'

import { UndoRedoStack } from './undo-redo-stack'

describe('UndoRedoStack', () => {
  it('will create empty UndoStack', () => {
    const instance = new UndoRedoStack()
    expect(instance.canUndo).toBe(false)
    expect(instance.canRedo).toBe(false)
  })

  it('will store state', () => {
    const instance = new UndoRedoStack()
    instance.initialize({ x: 1 })
    expect(instance.canUndo).toBe(false)
    expect(instance.canRedo).toBe(false)
  })

  it('will undo state', () => {
    const instance = new UndoRedoStack()
    instance.initialize({ x: 1 })
    instance.snapshot({ x: 2 })
    const state = instance.undo()
    expect(instance.canUndo).toBe(false)
    expect(instance.canRedo).toBe(true)
    expect(state).toEqual({ x: 1 })
  })

  it('will be able to redo', () => {
    const instance = new UndoRedoStack()
    instance.initialize({ x: 1 })
    instance.snapshot({ x: 2 })
    instance.undo()
    const state = instance.redo()
    expect(instance.canUndo).toBe(true)
    expect(instance.canRedo).toBe(false)
    expect(state).toEqual({ x: 2 })
  })
})
