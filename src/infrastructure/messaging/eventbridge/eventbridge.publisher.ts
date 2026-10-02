import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentConfirmationPublisher } from '../../../application/ports/appointment-confirmation.publisher';

export class EventBridgeAppointmentConfirmationPublisher
  implements AppointmentConfirmationPublisher
{
  private readonly eventBridgeClient: EventBridgeClient;

  constructor(
    private readonly eventBusName: string,
  ) {
    this.eventBridgeClient = new EventBridgeClient({});
  }

  public async publish(
    appointment: Appointment,
  ): Promise<void> {
    const event = {
      appointmentId: appointment.getId(),
      insuredId: appointment.getInsuredId().getValue(),
      scheduleId: appointment.getScheduleId().getValue(),
      countryISO: appointment.getCountry().getValue(),
      status: appointment.getStatus(),
    };

    await this.eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: this.eventBusName,
            Source: 'rimac.appointments',
            DetailType: 'AppointmentConfirmed',
            Detail: JSON.stringify(event),
          },
        ],
      }),
    );
  }
}