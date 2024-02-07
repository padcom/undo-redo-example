class SayHelloCommand implements Command {
  constructor(private message: string) {}

  execute() {
    console.log('SayHelloCommand:', this.message)
  }
}

