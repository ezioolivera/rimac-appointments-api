import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';

export class GetAppointmentsByInsuredUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  public async execute(
    insuredId: string,
  ): Promise<Appointment[]> {
    const insuredIdVO = InsuredId.create(insuredId);

    return this.appointmentRepository.findByInsuredId(
      insuredIdVO,
    );
  }
}