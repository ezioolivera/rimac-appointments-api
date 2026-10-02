import { Appointment } from '../../domain/entities/appointment.entity';

export interface AppointmentConfirmationPublisher {
  publish(appointment: Appointment): Promise<void>;
}