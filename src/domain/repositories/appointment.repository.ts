import { Appointment } from '../entities/appointment.entity';
import { InsuredId } from '../value-objects/insured-id.vo';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;

  findById(id: string): Promise<Appointment | null>;

  findByInsuredId(
    insuredId: InsuredId,
  ): Promise<Appointment[]>;
}