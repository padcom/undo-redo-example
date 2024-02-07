import { v4 as uuid } from 'uuid'
import { BaseShape } from './Shape'
import { BaseVertex } from './Vertex'

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
    this.rect.y = value
  }
}

export class Rect extends BaseShape {
  x = 10
  y = 10
  width = 100
  height = 50

  constructor() {
    super(uuid(), 'rect')
    this.vertices = [new TopLeftRectVertex(this), new BottomRightRectVertex(this)]
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
    const result = new Rect().initialize()
    result.x = this.x
    result.y = this.y
    result.width = this.width
    result.height = this.height

    this.cloneEventListenersTo(result)

    return result
  }
}
