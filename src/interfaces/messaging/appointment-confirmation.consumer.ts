import { CompleteAppointmentUseCase } from '../../application/use-cases/complete-appointment/complete-appointment.use-case';

export class AppointmentConfirmationConsumer {
  constructor(
    private readonly completeAppointmentUseCase: CompleteAppointmentUseCase,
  ) {}

  public async consume(
    message: string,
  ): Promise<void> {
    const event = JSON.parse(message);

    const detail =
      typeof event.detail === 'string'
        ? JSON.parse(event.detail)
        : event.detail;

    await this.completeAppointmentUseCase.execute(
      detail.appointmentId,
    );
  }
}