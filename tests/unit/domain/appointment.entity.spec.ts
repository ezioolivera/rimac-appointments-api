import { Appointment } from '../../../src/domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../src/domain/enums/appointment-status.enum';
import { Country } from '../../../src/domain/value-objects/country.vo';
import { InsuredId } from '../../../src/domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../../src/domain/value-objects/schedule-id.vo';

describe('Appointment', () => {
  it('should create an appointment with PENDING status', () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('01234'),
      scheduleId: ScheduleId.create(123),
      country: Country.create('PE'),
    });

    expect(appointment.getStatus()).toBe(
      AppointmentStatus.PENDING,
    );
  });

  it('should generate a unique id', () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('01234'),
      scheduleId: ScheduleId.create(123),
      country: Country.create('PE'),
    });

    expect(appointment.getId()).toBeDefined();
    expect(appointment.getId()).not.toBe('');
  });

  it('should store appointment information', () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('01234'),
      scheduleId: ScheduleId.create(123),
      country: Country.create('PE'),
    });

    expect(appointment.getInsuredId().getValue()).toBe('01234');
    expect(appointment.getScheduleId().getValue()).toBe(123);
    expect(appointment.getCountry().getValue()).toBe('PE');
  });

  it('should complete the appointment', () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('01234'),
      scheduleId: ScheduleId.create(123),
      country: Country.create('PE'),
    });

    appointment.complete();

    expect(appointment.getStatus()).toBe(
      AppointmentStatus.COMPLETED,
    );
  });
});