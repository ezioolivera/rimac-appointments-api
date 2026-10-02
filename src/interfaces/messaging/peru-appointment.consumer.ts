import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { Country } from '../../domain/value-objects/country.vo';
import { InsuredId } from '../../domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../domain/value-objects/schedule-id.vo';
import { ProcessAppointmentUseCase } from '../../application/use-cases/process-appointment/process-appointment.use-case';

export class PeruAppointmentConsumer {
  constructor(
    private readonly processAppointmentUseCase: ProcessAppointmentUseCase,
  ) {}

  public async consume(message: string): Promise<void> {
    const snsMessage = JSON.parse(message);

    const data = JSON.parse(snsMessage.Message);

    const appointment = Appointment.reconstitute({
      id: data.appointmentId,
      insuredId: InsuredId.create(data.insuredId),
      scheduleId: ScheduleId.create(data.scheduleId),
      country: Country.create(data.countryISO),
      status: data.status as AppointmentStatus,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.createdAt),
    });

    await this.processAppointmentUseCase.execute(
      appointment,
    );
  }
}