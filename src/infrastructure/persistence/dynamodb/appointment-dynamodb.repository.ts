import {
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { InsuredId } from '../../../domain/value-objects/insured-id.vo';

import { dynamoDBDocumentClient } from './dynamodb.client';
import {
  AppointmentDynamoItem,
  AppointmentMapper,
} from './appointment.mapper';

export class AppointmentDynamoDbRepository
  implements AppointmentRepository
{
  constructor(
    private readonly tableName: string,
  ) {}

  public async save(
    appointment: Appointment,
  ): Promise<void> {
    const item =
      AppointmentMapper.toPersistence(
        appointment,
      );

    await dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
  }

  public async findById(
    id: string,
  ): Promise<Appointment | null> {
    const result =
      await dynamoDBDocumentClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: {
            id,
          },
        }),
      );

    if (!result.Item) {
      return null;
    }

    return AppointmentMapper.toDomain(
      result.Item as AppointmentDynamoItem,
    );
  }

  public async findByInsuredId(
    insuredId: InsuredId,
  ): Promise<Appointment[]> {
    const result =
      await dynamoDBDocumentClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'insuredId-index',
          KeyConditionExpression:
            'insuredId = :insuredId',
          ExpressionAttributeValues: {
            ':insuredId': insuredId.getValue(),
          },
        }),
      );

    return (result.Items ?? []).map(
      (item) =>
        AppointmentMapper.toDomain(
          item as AppointmentDynamoItem,
        ),
    );
  }
}