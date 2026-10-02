import { ProcessAppointmentUseCase } from '../../application/use-cases/process-appointment/process-appointment.use-case';
import { Appointment } from '../../domain/entities/appointment.entity';
import { InsuredId } from '../../domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../domain/value-objects/schedule-id.vo';
import { Country } from '../../domain/value-objects/country.vo';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export class ChileAppointmentConsumer {
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