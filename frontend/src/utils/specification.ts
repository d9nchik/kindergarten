import { Event } from './parent';

class EventSpecification {
  public isSatisfiedByEvent(event: Event): boolean {
    return true;
  }
}

export class MaxPriceSpecification extends EventSpecification {
  maxPrice: number;

  constructor(maxPrice: number = global.Infinity) {
    super();
    this.maxPrice = maxPrice;
  }

  public isSatisfiedByEvent({ price }: Event): boolean {
    return price < this.maxPrice;
  }
}

export class NameSpecification extends EventSpecification {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public isSatisfiedByEvent({ name }: Event): boolean {
    return name.includes(this.name);
  }
}
// Pattern Composite
export class AndSpecification extends EventSpecification {
  specificationArray: EventSpecification[] = [];

  public addSpecification(specification: EventSpecification) {
    this.specificationArray.push(specification);
  }

  public removeSpecification(event: EventSpecification) {
    this.specificationArray.splice(this.specificationArray.indexOf(event), 1);
  }

  public isSatisfiedByEvent(event: Event): boolean {
    return this.specificationArray.every((specification) =>
      specification.isSatisfiedByEvent(event),
    );
  }
}
