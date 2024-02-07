#!/usr/bin/env -S npx ts-node

import chalk from 'chalk'
import { UndoRedoStack } from "./undo-redo-stack"

interface Store {
  data: string
}

interface Command {
  execute(): void
}

class InitializeCommand implements Command {
  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
    private value: string,
  ) {}

  execute(): void {
    console.log(`CMD: ${chalk.blue('initialize')}`)
    this.store.data = this.value
    this.undoRedoStack.initialize(this.store.data)
  }
}

class TypeCommand implements Command {
  private static timer: NodeJS.Timeout | null = null

  constructor(
    private undoRedoStack: UndoRedoStack,
    private store: Store,
  ) {}

  public character: string = ''

  execute(): void {
    if (this.character) {
      console.log(`CMD: ${chalk.blue('type')}`)
      this.store.data += this.character
      this.character = ''
      this.scheduleSnapshot()
    }
  }

  private scheduleSnapshot() {
    if (TypeCommand.timer) {
      clearTimeout(TypeCommand.timer)
      TypeCommand.timer = setTimeout(() => {
        TypeCommand.timer = null
        this.undoRedoStack.snapshot(this.store.data)
      }, 1000)
    }
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

class EndCommand implements Command {
  execute() {
    process.exit(0)
  }
}

const undoRedoStack = new UndoRedoStack()

const store: Store = {
  data: ''
}

const input = process.stdin

const CTRL_C = '\u0003'
const CTRL_D = '\u0004'
const CTRL_Z = '['
const CTRL_Y = ']'

const COMMANDS: Record<string, Command> = {
  'INITIALIZE': new InitializeCommand(undoRedoStack, store, ''),
  'TYPE': new TypeCommand(undoRedoStack, store),
  CTRL_C: new EndCommand(),
  CTRL_D: new EndCommand(),
  CTRL_Z: new UndoCommand(undoRedoStack, store),
  CTRL_Y: new RedoCommand(undoRedoStack, store),
}

input.setRawMode(true)
input.setEncoding('utf8')
input.resume()

COMMANDS['INITIALIZE'].execute()

input.on('data', (char: string, ...args: any[]) => {
  const cmd = COMMANDS[char] || COMMANDS['TYPE'] as Command
  if (cmd instanceof TypeCommand) {
    cmd.character = char
  }
  cmd.execute()

  // if (char === CTRL_C || char === CTRL_D) process.exit()
  // switch (char) {
  //   case CTRL_C:
  //   case CTRL_D:
  //     process.exit()
  //     break;
  //   case CTRL_Z:
  //     if (undoRedoStack.canUndo) {
  //       data = undoRedoStack.undo()
  //       console.log('UNDO:', data)
  //     }
  //     break
  //   case CTRL_Y:
  //     if (undoRedoStack.canRedo) {
  //       data = undoRedoStack.redo()
  //       console.log('REDO:', data)
  //     }
  //     break
  //   default:
  //     console.log('INPUT:', char.charCodeAt(0))
  //     data += char
  //     lastInput = Date.now()
  //   }
})
