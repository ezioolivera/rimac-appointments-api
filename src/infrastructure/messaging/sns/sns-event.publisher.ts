import {
  PublishCommand,
  SNSClient,
} from '@aws-sdk/client-sns';

import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentEventPublisher } from '../../../application/ports/appointment-event.publisher';

export class SnsEventPublisher
  implements AppointmentEventPublisher
{
  private readonly snsClient: SNSClient;

  constructor(
    private readonly topicArn: string,
  ) {
    this.snsClient = new SNSClient({});
  }

  public async publish(
    appointment: Appointment,
  ): Promise<void> {
    const message = {
      appointmentId: appointment.getId(),
      insuredId:
        appointment.getInsuredId().getValue(),
      scheduleId:
        appointment.getScheduleId().getValue(),
      countryISO:
        appointment.getCountry().getValue(),
      status:
        appointment.getStatus(),
      createdAt:
        appointment.getCreatedAt().toISOString(),
    };

  await this.snsClient.send(
    new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(message),

      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue:
            appointment.getCountry().getValue(),
        },
      },
    }),
  );
  }
}