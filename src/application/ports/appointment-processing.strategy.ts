import { Appointment } from '../../domain/entities/appointment.entity';
import { CountryCode } from '../../domain/enums/country-code.enum';

export interface AppointmentProcessingStrategy {
  supports(country: CountryCode): boolean;

  process(appointment: Appointment): Promise<void>;
}