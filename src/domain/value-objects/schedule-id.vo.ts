export class ScheduleId {
  private constructor(
    private readonly value: number,
  ) {}

  public static create(value: number): ScheduleId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(
        'scheduleId must be a positive integer',
      );
    }

    return new ScheduleId(value);
  }

  public getValue(): number {
    return this.value;
  }
}