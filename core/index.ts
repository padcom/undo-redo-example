#!/usr/bin/env -S npx ts-node

import chalk from 'chalk'
import { UndoRedoStack } from "./undo-redo-stack"

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
    this.store.data = this.value
    this.undoRedoStack.initialize(this.store.data)
  }
}

interface Store {
  data: number
}

class IncrementValueCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
    private amount: number,
  ) {}

  execute() {
    console.log(`CMD: ${chalk.blue('increment by ' + this.amount)}`)
    this.store.data += this.amount
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

const undoRedoStack = new UndoRedoStack()

const store: Store = {
  data: 1
}

const initialize = new InitializeCommand(undoRedoStack, store, 0)
const increment1 = new IncrementValueCommand(undoRedoStack, store, 1)
const decrement1 = new IncrementValueCommand(undoRedoStack, store, -1)
const undo = new UndoCommand(undoRedoStack, store)
const redo = new RedoCommand(undoRedoStack, store)

const commands = [
  initialize,
  increment1,
  decrement1,
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
})






function debug() {
  const state = chalk.yellow(JSON.stringify(store.data))
  console.log(`DEBUG: state: ${state}; ${undoRedoStack.debug}`)
}

