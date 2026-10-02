import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { AppointmentController } from '../interfaces/http/controllers/appointment.controller';
import { CreateAppointmentUseCase } from '../application/use-cases/create-appointment/create-appointment.use-case';
import { GetAppointmentsByInsuredUseCase } from '../application/use-cases/get-appointments-by-insured/get-appointments-by-insured.use-case';

import { AppointmentDynamoDbRepository } from '../infrastructure/persistence/dynamodb/appointment-dynamodb.repository';
import { SnsEventPublisher } from '../infrastructure/messaging/sns/sns-event.publisher';

const appointmentRepository =
  new AppointmentDynamoDbRepository(
    process.env.APPOINTMENTS_TABLE!,
  );

const eventPublisher =
  new SnsEventPublisher(
    process.env.APPOINTMENT_TOPIC_ARN!,
  );

const createAppointmentUseCase =
  new CreateAppointmentUseCase(
    appointmentRepository,
    eventPublisher,
  );

const getAppointmentsByInsuredUseCase =
  new GetAppointmentsByInsuredUseCase(
    appointmentRepository,
  );

const controller =
  new AppointmentController(
    createAppointmentUseCase,
    getAppointmentsByInsuredUseCase,
  );

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // GET /appointments?insuredId=98765
    if (event.httpMethod === 'GET') {
      const insuredId =
        event.queryStringParameters?.insuredId;

      if (!insuredId) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message:
              'insuredId query parameter is required',
          }),
        };
      }

      const result =
        await controller.findByInsuredId(
          insuredId,
        );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      };
    }

    // POST /appointments
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(
        event.body ?? '{}',
      );

      const result =
        await controller.create(body);

      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Method not allowed',
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message:
          error instanceof Error
            ? error.message
            : 'Unexpected error',
      }),
    };
  }
};