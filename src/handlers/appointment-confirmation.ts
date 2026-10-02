import { SQSEvent } from 'aws-lambda';

import { CompleteAppointmentUseCase } from '../application/use-cases/complete-appointment/complete-appointment.use-case';

import { AppointmentDynamoDbRepository } from '../infrastructure/persistence/dynamodb/appointment-dynamodb.repository';

import { AppointmentConfirmationConsumer } from '../interfaces/messaging/appointment-confirmation.consumer';

const appointmentRepository =
  new AppointmentDynamoDbRepository(
    process.env.APPOINTMENTS_TABLE!,
  );

const completeAppointmentUseCase =
  new CompleteAppointmentUseCase(
    appointmentRepository,
  );

const consumer =
  new AppointmentConfirmationConsumer(
    completeAppointmentUseCase,
  );

export const handler = async (
  event: SQSEvent,
): Promise<void> => {
  for (const record of event.Records) {
    await consumer.consume(record.body);
  }
};