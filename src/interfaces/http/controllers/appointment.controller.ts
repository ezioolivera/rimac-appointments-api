import { CreateAppointmentUseCase } from '../../../application/use-cases/create-appointment/create-appointment.use-case';
import { CreateAppointmentInput } from '../../../application/use-cases/create-appointment/create-appointment.input';
import { GetAppointmentsByInsuredUseCase } from '../../../application/use-cases/get-appointments-by-insured/get-appointments-by-insured.use-case';

export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly getAppointmentsByInsuredUseCase: GetAppointmentsByInsuredUseCase,
  ) {}

  public async create(
    input: CreateAppointmentInput,
  ) {
    const appointment =
      await this.createAppointmentUseCase.execute(input);

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

  public async findByInsuredId(
    insuredId: string,
  ) {
    const appointments =
      await this.getAppointmentsByInsuredUseCase.execute(
        insuredId,
      );

    return appointments.map((appointment) => ({
      id: appointment.getId(),
      insuredId: appointment.getInsuredId().getValue(),
      scheduleId: appointment.getScheduleId().getValue(),
      countryISO: appointment.getCountry().getValue(),
      status: appointment.getStatus(),
      createdAt: appointment.getCreatedAt().toISOString(),
      updatedAt: appointment.getUpdatedAt().toISOString(),
    }));
  }
}