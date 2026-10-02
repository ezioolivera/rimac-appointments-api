export class InsuredId {
  private constructor(
    private readonly value: string,
  ) {}

  public static create(value: string): InsuredId {
    if (!/^\d{5}$/.test(value)) {
      throw new Error(
        'insuredId must contain exactly 5 numeric digits',
      );
    }

    return new InsuredId(value);
  }

  public getValue(): string {
    return this.value;
  }
}