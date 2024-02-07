export interface Command {
  caption: string
  enabled: boolean
  execute(): void
}
