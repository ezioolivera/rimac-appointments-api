import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';
import { getMysqlPool } from './mysql.client';
import {
  AppointmentMysqlMapper,
  AppointmentMysqlRow,
} from './appointment.mapper';

export class AppointmentMySqlRepository
  implements AppointmentRepository
{
  public async save(appointment: Appointment): Promise<void> {
    const pool = getMysqlPool();

    const item =
      AppointmentMysqlMapper.toPersistence(appointment);

    await pool.execute(
    `
        INSERT INTO appointments (
        appointment_id,
        insured_id,
        schedule_id,
        country_iso,
        status,
        created_at,
        updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        updated_at = VALUES(updated_at)
    `,
    [
        item.appointment_id,
        item.insured_id,
        item.schedule_id,
        item.country_iso,
        item.status,
        item.created_at,
        item.updated_at,
    ],
    );
  }

  public async updateStatus(
    appointmentId: string,
    status: string,
    ): Promise<void> {
    const pool = getMysqlPool();

    await pool.execute(
        `
        UPDATE appointments
        SET
            status = ?,
            updated_at = NOW()
        WHERE appointment_id = ?
        `,
        [status, appointmentId],
    );
  }

  public async findById(
    id: string,
  ): Promise<Appointment | null> {
    const pool = getMysqlPool();

    const [rows] = await pool.execute(
      `
        SELECT
          appointment_id,
          insured_id,
          schedule_id,
          country_iso,
          status,
          created_at,
          updated_at
        FROM appointments
        WHERE appointment_id = ?
        LIMIT 1
      `,
      [id],
    );

    const result = rows as AppointmentMysqlRow[];

    if (result.length === 0) {
      return null;
    }

    return AppointmentMysqlMapper.toDomain(result[0]);
  }

  public async findByInsuredId(
    insuredId: InsuredId,
  ): Promise<Appointment[]> {
    const pool = getMysqlPool();

    const [rows] = await pool.execute(
      `
        SELECT
          appointment_id,
          insured_id,
          schedule_id,
          country_iso,
          status,
          created_at,
          updated_at
        FROM appointments
        WHERE insured_id = ?
        ORDER BY created_at DESC
      `,
      [insuredId.getValue()],
    );

    const result = rows as AppointmentMysqlRow[];

    return result.map(
      (row) =>
        AppointmentMysqlMapper.toDomain(row),
    );
  }
}