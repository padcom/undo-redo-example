import EventEmitter from 'eventemitter3'
import { type Vertex } from './Vertex'

export interface Shape extends EventEmitter {
  id: string | number
  type: string
  attrs: Record<string, string | number>;
  vertices: Vertex[]
  body: Vertex | null
}

export class BaseShape extends EventEmitter implements Shape {
  vertices: Vertex[] = []
  body: Vertex | null = null

  constructor(
    public id: string | number,
    public type: string,
  ) {
    super()
  }

  get attrs(): Record<string, string | number> {
    throw new Error('Method not implemented.')
  }

  initialize() {
    this.vertices.forEach(vertex => vertex.on('update', () => this.emit('resize')))
    this.body?.on('update', () => this.emit('move'))

    return this
  }

  protected cloneEventListenersTo(target: Shape) {
    this.eventNames().forEach(eventName => {
      this.listeners(eventName).forEach(handler => {
        target.on(eventName, handler)
      })
    })
  }
}
