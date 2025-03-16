/// subscribes to jetstream events, and decides when to publish or retract labels

export class Subscriber {
  constructor(private fn: Function) {}

  // triggers a check
  async trigger() {
    await this.fn();
  }
}
