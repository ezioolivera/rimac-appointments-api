import { Appointment } from '../../../src/domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../src/domain/enums/appointment-status.enum';
import { AppointmentMapper } from '../../../src/infrastructure/persistence/dynamodb/appointment.mapper';
import { Country } from '../../../src/domain/value-objects/country.vo';
import { InsuredId } from '../../../src/domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../../src/domain/value-objects/schedule-id.vo';

describe('AppointmentMapper', () => {
  it('should map domain entity to DynamoDB item', () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('01234'),
      scheduleId: ScheduleId.create(123),
      country: Country.create('PE'),
    });

    const item = AppointmentMapper.toPersistence(
      appointment,
    );

    expect(item.id).toBe(appointment.getId());
    expect(item.insuredId).toBe('01234');
    expect(item.scheduleId).toBe(123);
    expect(item.countryISO).toBe('PE');
    expect(item.status).toBe('PENDING');
  });

  it('should map DynamoDB item to domain entity', () => {
    const item = {
      id: 'appointment-123',
      insuredId: '01234',
      scheduleId: 123,
      countryISO: 'PE',
      status: 'COMPLETED',
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-01T10:05:00.000Z',
    };

    const appointment =
      AppointmentMapper.toDomain(item);

    expect(appointment.getId()).toBe(
      'appointment-123',
    );

    expect(
      appointment.getInsuredId().getValue(),
    ).toBe('01234');

    expect(
      appointment.getScheduleId().getValue(),
    ).toBe(123);

    expect(
      appointment.getCountry().getValue(),
    ).toBe('PE');

    expect(appointment.getStatus()).toBe(
      AppointmentStatus.COMPLETED,
    );
  });
});