import { AppointmentStrategyFactory } from '../../src/application/factories/appointment-strategy.factory';
import { ProcessAppointmentUseCase } from '../../src/application/use-cases/process-appointment/process-appointment.use-case';

import { PeruAppointmentStrategy } from '../../src/infrastructure/strategies/peru-appointment.strategy';
import { ChileAppointmentStrategy } from '../../src/infrastructure/strategies/chile-appointment.strategy';

import { AppointmentMySqlRepository } from '../../src/infrastructure/persistence/mysql/appointment-mysql.repository';

import { PeruAppointmentConsumer } from '../../src/interfaces/messaging/peru-appointment.consumer';

describe('Peru appointment flow', () => {
  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3306';
    process.env.DB_NAME = 'rimac_appointments';
    process.env.DB_USER = 'rimac';
    process.env.DB_PASSWORD = 'rimac123';
  });

  it('debe procesar una cita PE y guardarla en MySQL', async () => {
    const appointmentRepository =
      new AppointmentMySqlRepository();

    const peruStrategy =
      new PeruAppointmentStrategy(
        appointmentRepository,
      );

    const chileStrategy =
      new ChileAppointmentStrategy();

    const strategyFactory =
      new AppointmentStrategyFactory([
        peruStrategy,
        chileStrategy,
      ]);

    const processAppointmentUseCase =
      new ProcessAppointmentUseCase(
        strategyFactory,
      );

    const consumer =
      new PeruAppointmentConsumer(
        processAppointmentUseCase,
      );

    const appointmentId =
      '11111111-1111-1111-1111-111111111111';

    const message = JSON.stringify({
      Type: 'Notification',
      Message: JSON.stringify({
        appointmentId,
        insuredId: '00054',
        scheduleId: 1050,
        countryISO: 'PE',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      }),
    });

    await consumer.consume(message);

    const result =
      await appointmentRepository.findById(
        appointmentId,
      );

    expect(result).not.toBeNull();

    expect(result?.getId()).toBe(
      appointmentId,
    );

    expect(
      result?.getInsuredId().getValue(),
    ).toBe('00054');

    expect(
      result?.getScheduleId().getValue(),
    ).toBe(1050);

    expect(
      result?.getCountry().getValue(),
    ).toBe('PE');

    expect(
      result?.getStatus(),
    ).toBe('PENDING');
  });
});