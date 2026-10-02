import { Appointment } from '../../src/domain/entities/appointment.entity';
import { Country } from '../../src/domain/value-objects/country.vo';
import { InsuredId } from '../../src/domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../src/domain/value-objects/schedule-id.vo';
import { AppointmentMySqlRepository } from '../../src/infrastructure/persistence/mysql/appointment-mysql.repository';

describe('AppointmentMySqlRepository', () => {
  const repository = new AppointmentMySqlRepository();

  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3306';
    process.env.DB_NAME = 'rimac_appointments';
    process.env.DB_USER = 'rimac';
    process.env.DB_PASSWORD = 'rimac123';
  });

  it('debe guardar y recuperar una cita desde MySQL', async () => {
    const appointment = Appointment.create({
      insuredId: InsuredId.create('00001'),
      scheduleId: ScheduleId.create(1050),
      country: Country.create('PE'),
    });

    await repository.save(appointment);

    const result = await repository.findById(
      appointment.getId(),
    );

    expect(result).not.toBeNull();

    expect(result?.getId()).toBe(
      appointment.getId(),
    );

    expect(
      result?.getInsuredId().getValue(),
    ).toBe('00001');

    expect(
      result?.getScheduleId().getValue(),
    ).toBe(1050);

    expect(
      result?.getCountry().getValue(),
    ).toBe('PE');
  });
});