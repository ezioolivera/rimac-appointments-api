import { ScheduleId } from '../../../src/domain/value-objects/schedule-id.vo';

describe('ScheduleId', () => {
  it('should create a valid schedule id', () => {
    const scheduleId = ScheduleId.create(123);

    expect(scheduleId.getValue()).toBe(123);
  });

  it('should reject zero', () => {
    expect(() => ScheduleId.create(0)).toThrow();
  });

  it('should reject negative numbers', () => {
    expect(() => ScheduleId.create(-1)).toThrow();
  });

  it('should reject decimal numbers', () => {
    expect(() => ScheduleId.create(1.5)).toThrow();
  });
});