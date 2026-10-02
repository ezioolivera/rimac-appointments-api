import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { Country } from '../../../domain/value-objects/country.vo';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../../domain/value-objects/schedule-id.vo';

import { AppointmentEventPublisher } from '../../ports/appointment-event.publisher';
import { CreateAppointmentInput } from './create-appointment.input';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly eventPublisher: AppointmentEventPublisher,
  ) {}

  public async execute(
    input: CreateAppointmentInput,
  ): Promise<Appointment> {
    const insuredId = InsuredId.create(input.insuredId);

    const scheduleId = ScheduleId.create(
      input.scheduleId,
    );

    const country = Country.create(
      input.countryISO,
    );

    const appointment = Appointment.create({
      insuredId,
      scheduleId,
      country,
    });

    await this.appointmentRepository.save(
      appointment,
    );

    await this.eventPublisher.publish(
      appointment,
    );

    return appointment;
  }
}