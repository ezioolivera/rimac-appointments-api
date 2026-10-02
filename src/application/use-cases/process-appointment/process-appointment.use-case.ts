import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentStrategyFactory } from '../../factories/appointment-strategy.factory';

export class ProcessAppointmentUseCase {
  constructor(
    private readonly strategyFactory: AppointmentStrategyFactory,
  ) {}

  public async execute(
    appointment: Appointment,
  ): Promise<void> {
    const strategy = this.strategyFactory.create(
      appointment.getCountry().getValue(),
    );

    await strategy.process(appointment);
  }
}