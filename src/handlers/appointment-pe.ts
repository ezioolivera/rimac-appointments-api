import { SQSEvent } from 'aws-lambda';

import { AppointmentStrategyFactory } from '../application/factories/appointment-strategy.factory';
import { ProcessAppointmentUseCase } from '../application/use-cases/process-appointment/process-appointment.use-case';

import { PeruAppointmentStrategy } from '../infrastructure/strategies/peru-appointment.strategy';
import { ChileAppointmentStrategy } from '../infrastructure/strategies/chile-appointment.strategy';

import { PeruAppointmentConsumer } from '../interfaces/messaging/peru-appointment.consumer';

import { AppointmentMySqlRepository } from '../infrastructure/persistence/mysql/appointment-mysql.repository';

import { EventBridgeAppointmentConfirmationPublisher } from '../infrastructure/messaging/eventbridge/eventbridge.publisher';


const appointmentRepository =
  new AppointmentMySqlRepository();


const confirmationPublisher =
  new EventBridgeAppointmentConfirmationPublisher(
    process.env.EVENT_BUS_NAME!,
  );


const peruStrategy =
  new PeruAppointmentStrategy(
    appointmentRepository,
    confirmationPublisher,
  );


const chileStrategy =
  new ChileAppointmentStrategy(
    appointmentRepository,
    confirmationPublisher,
  );


const strategyFactory =
  new AppointmentStrategyFactory([
    peruStrategy,
    chileStrategy,
  ]);


const processAppointmentUseCase =
  new ProcessAppointmentUseCase(
    strategyFactory,
  );


const consumer =
  new PeruAppointmentConsumer(
    processAppointmentUseCase,
  );


export const handler = async (
  event: SQSEvent,
): Promise<void> => {

  for (const record of event.Records) {
    await consumer.consume(record.body);
  }

};