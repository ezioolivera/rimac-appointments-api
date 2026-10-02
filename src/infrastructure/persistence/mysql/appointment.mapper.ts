import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';
import { Country } from '../../../domain/value-objects/country.vo';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';
import { ScheduleId } from '../../../domain/value-objects/schedule-id.vo';

export interface AppointmentMysqlRow {
  appointment_id: string;
  insured_id: string;
  schedule_id: number;
  country_iso: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class AppointmentMysqlMapper {
  public static toPersistence(
    appointment: Appointment,
  ): AppointmentMysqlRow {
    return {
      appointment_id: appointment.getId(),
      insured_id: appointment.getInsuredId().getValue(),
      schedule_id: appointment.getScheduleId().getValue(),
      country_iso: appointment.getCountry().getValue(),
      status: appointment.getStatus(),
      created_at: appointment.getCreatedAt(),
      updated_at: appointment.getUpdatedAt(),
    };
  }

  public static toDomain(
    row: AppointmentMysqlRow,
  ): Appointment {
    return Appointment.reconstitute({
      id: row.appointment_id,
      insuredId: InsuredId.create(row.insured_id),
      scheduleId: ScheduleId.create(row.schedule_id),
      country: Country.create(row.country_iso),
      status: row.status as AppointmentStatus,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}