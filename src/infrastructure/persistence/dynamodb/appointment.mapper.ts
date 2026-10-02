import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';
import { Country } from '../../../domain/value-objects/country.vo';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../../domain/value-objects/schedule-id.vo';

export interface AppointmentDynamoItem {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class AppointmentMapper {
  public static toPersistence(
    appointment: Appointment,
  ): AppointmentDynamoItem {
    return {
      id: appointment.getId(),
      insuredId: appointment.getInsuredId().getValue(),
      scheduleId: appointment.getScheduleId().getValue(),
      countryISO: appointment.getCountry().getValue(),
      status: appointment.getStatus(),
      createdAt: appointment.getCreatedAt().toISOString(),
      updatedAt: appointment.getUpdatedAt().toISOString(),
    };
  }

  public static toDomain(
    item: AppointmentDynamoItem,
  ): Appointment {
    return Appointment.reconstitute({
      id: item.id,
      insuredId: InsuredId.create(item.insuredId),
      scheduleId: ScheduleId.create(item.scheduleId),
      country: Country.create(item.countryISO),
      status: item.status as AppointmentStatus,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });
  }
}