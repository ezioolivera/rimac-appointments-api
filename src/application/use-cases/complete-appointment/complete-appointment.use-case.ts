import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

export class CompleteAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  public async execute(
    appointmentId: string,
  ): Promise<void> {
    const appointment =
      await this.appointmentRepository.findById(
        appointmentId,
      );

    if (!appointment) {
      throw new Error(
        `Appointment ${appointmentId} not found`,
      );
    }

    appointment.complete();

    await this.appointmentRepository.save(
      appointment,
    );
  }
}