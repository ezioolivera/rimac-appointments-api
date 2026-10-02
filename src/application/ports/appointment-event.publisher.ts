import { Appointment } from '../../domain/entities/appointment.entity';

export interface AppointmentEventPublisher {
  publish(appointment: Appointment): Promise<void>;
}