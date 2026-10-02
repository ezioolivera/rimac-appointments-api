import { CountryCode } from '../../domain/enums/country-code.enum';
import { AppointmentProcessingStrategy } from '../ports/appointment-processing.strategy';

export class AppointmentStrategyFactory {
  constructor(
    private readonly strategies: AppointmentProcessingStrategy[],
  ) {}

  public create(
    country: CountryCode,
  ): AppointmentProcessingStrategy {
    const strategy = this.strategies.find(
      (strategy) => strategy.supports(country),
    );

    if (!strategy) {
      throw new Error(
        `No strategy configured for country ${country}`,
      );
    }

    return strategy;
  }
}