#!/usr/bin/env -S npx ts-node

import chalk from 'chalk'
import { UndoRedoStack } from "./undo-redo-stack"

interface Data {
  x: number
}

interface Store {
  data: Data
}

interface Command {
  execute(): void
}

class InitializeCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
    private value: number,
  ) {}

  execute(): void {
    console.log(`CMD: ${chalk.blue('initialize')}`)
    this.store.data = { x: this.value }
    this.undoRedoStack.initialize(this.store.data)
  }
}

class IncrementValueCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
    private amount: number,
  ) {}

  execute() {
    console.log(`CMD: ${chalk.blue('increment by ' + this.amount)}`)
    this.store.data.x += this.amount
    this.undoRedoStack.snapshot(this.store.data)
  }
}

class UndoCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
  ) {}

  execute() {
    console.log(`CMD: ${chalk.blue('undo')}`)
    this.store.data = this.undoRedoStack.undo()
  }
}

class RedoCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
  ) {}

  execute() {
    console.log(`CMD: ${chalk.blue('redo')}`)
    this.store.data = this.undoRedoStack.redo()
  }
}

class DebugCommand implements Command {
  constructor(private undoRedoStack: UndoRedoStack, private store: Store) {
  }

  execute() {
    const state = chalk.yellow(JSON.stringify(this.store.data))
    console.log(`DEBUG: state: ${state}; ${this.undoRedoStack.debug}`)
  }
}

const undoRedoStack = new UndoRedoStack()

const store: Store = {
  data: { x: 1 }
}

const increment1 = new IncrementValueCommand(undoRedoStack, store, 1)
const decrement1 = new IncrementValueCommand(undoRedoStack, store, -1)
const initialize = new InitializeCommand(undoRedoStack, store, 0)
const undo = new UndoCommand(undoRedoStack, store)
const redo = new RedoCommand(undoRedoStack, store)
const debug = new DebugCommand(undoRedoStack, store)

const commands = [
  initialize,
  increment1,
  increment1,
  increment1,
  undo,
  undo,
  redo,
  undo,
  increment1,
  undo,
]

commands.forEach(command => {
  command.execute()
  debug.execute()
})
