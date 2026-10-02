import { Appointment } from '../../domain/entities/appointment.entity';
import { CountryCode } from '../../domain/enums/country-code.enum';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { AppointmentConfirmationPublisher } from '../../application/ports/appointment-confirmation.publisher';
import { AppointmentProcessingStrategy } from '../../application/ports/appointment-processing.strategy';

export class PeruAppointmentStrategy
  implements AppointmentProcessingStrategy
{
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly confirmationPublisher: AppointmentConfirmationPublisher,
  ) {}

  public supports(country: CountryCode): boolean {
    return country === CountryCode.PE;
  }

  public async process(
    appointment: Appointment,
  ): Promise<void> {

    await this.appointmentRepository.save(appointment);

    await this.confirmationPublisher.publish(appointment);


    console.log('Appointment processed for Peru', {
      appointmentId: appointment.getId(),
      insuredId: appointment.getInsuredId().getValue(),
      scheduleId: appointment.getScheduleId().getValue(),
    });
  }
}