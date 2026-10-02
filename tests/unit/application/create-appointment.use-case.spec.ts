import { Appointment } from '../../../src/domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../src/domain/repositories/appointment.repository';
import { AppointmentEventPublisher } from '../../../src/application/ports/appointment-event.publisher';
import { CreateAppointmentUseCase } from '../../../src/application/use-cases/create-appointment/create-appointment.use-case';

describe('CreateAppointmentUseCase', () => {
  it('should create and save an appointment', async () => {
    const repository: AppointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    const eventPublisher: AppointmentEventPublisher = {
      publish: jest.fn(),
    };

    const useCase = new CreateAppointmentUseCase(
      repository,
      eventPublisher,
    );

    const result = await useCase.execute({
      insuredId: '01234',
      scheduleId: 123,
      countryISO: 'PE',
    });

    expect(result).toBeInstanceOf(Appointment);

    expect(repository.save).toHaveBeenCalledTimes(1);

    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
  });
  it('should reject an invalid insured id', async () => {
    const repository: AppointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    const eventPublisher: AppointmentEventPublisher = {
      publish: jest.fn(),
    };

    const useCase = new CreateAppointmentUseCase(
      repository,
      eventPublisher,
    );

    await expect(
      useCase.execute({
        insuredId: '1234',
        scheduleId: 123,
        countryISO: 'PE',
      }),
    ).rejects.toThrow();

    expect(repository.save).not.toHaveBeenCalled();

    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });
  it('should reject an invalid insured id', async () => {
    const repository: AppointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    const eventPublisher: AppointmentEventPublisher = {
      publish: jest.fn(),
    };

    const useCase = new CreateAppointmentUseCase(
      repository,
      eventPublisher,
    );

    await expect(
      useCase.execute({
        insuredId: '1234',
        scheduleId: 123,
        countryISO: 'PE',
      }),
    ).rejects.toThrow();

    expect(repository.save).not.toHaveBeenCalled();

    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });
});