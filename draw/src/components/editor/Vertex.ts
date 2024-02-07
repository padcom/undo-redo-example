import EventEmitter from 'eventemitter3'
import { v4 as uuid } from 'uuid'

export interface Coordinates {
  x: number
  y: number
}

export interface Delta {
  dx: number
  dy: number
}

export interface Vertex extends EventEmitter {
  id: string
  x: number
  y: number
  dragging: boolean

  activate(coords: Coordinates): void
  move(coords: Coordinates): void
  update(delta: Delta): void
  deactivate(): void
}

export abstract class BaseVertex extends EventEmitter implements Vertex {
  private modified = false

  id = uuid()
  dragging = false
  origin: Coordinates | null = null

  activate(origin: Coordinates) {
    console.log(`${this.constructor.name}.activate()`)
    this.origin = origin
    this.dragging = true
  }

  move(coords: Coordinates) {
    // console.log(`${this.constructor.name}.move()`, this.dragging)

    if (this.dragging) {
      const delta: Delta = {
        dx: coords.x - this.origin!.x,
        dy: coords.y - this.origin!.y,
      }
      this.update(delta)
      this.origin = coords
    }
  }

  update(delta: Delta) {
    console.log(`${this.constructor.name}.update()`)

    this.x = this.x + delta.dx
    this.y = this.y + delta.dy

    this.modified = true
  }

  deactivate() {
    console.log(`${this.constructor.name}.deactivate()`)

    this.dragging = false
    this.origin = null

    if (this.modified) this.emit('update')
  }

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
}
