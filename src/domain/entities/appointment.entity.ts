import { randomUUID } from 'node:crypto';

import { AppointmentStatus } from '../enums/appointment-status.enum';
import { Country } from '../value-objects/country.vo';
import { InsuredId } from '../value-objects/insured-id.vo';
import { ScheduleId } from '../value-objects/schedule-id.vo';

export interface CreateAppointmentProps {
  insuredId: InsuredId;
  scheduleId: ScheduleId;
  country: Country;
}

export interface ReconstituteAppointmentProps {
  id: string;
  insuredId: InsuredId;
  scheduleId: ScheduleId;
  country: Country;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  private constructor(
    private readonly id: string,
    private readonly insuredId: InsuredId,
    private readonly scheduleId: ScheduleId,
    private readonly country: Country,
    private status: AppointmentStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(
    props: CreateAppointmentProps,
  ): Appointment {
    const now = new Date();

    return new Appointment(
      randomUUID(),
      props.insuredId,
      props.scheduleId,
      props.country,
      AppointmentStatus.PENDING,
      now,
      now,
    );
  }

  public static reconstitute(
    props: ReconstituteAppointmentProps,
  ): Appointment {
    return new Appointment(
      props.id,
      props.insuredId,
      props.scheduleId,
      props.country,
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }

  public complete(): void {
    this.status = AppointmentStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getInsuredId(): InsuredId {
    return this.insuredId;
  }

  public getScheduleId(): ScheduleId {
    return this.scheduleId;
  }

  public getCountry(): Country {
    return this.country;
  }

  public getStatus(): AppointmentStatus {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}