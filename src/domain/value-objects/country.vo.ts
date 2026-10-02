import { CountryCode } from '../enums/country-code.enum';

export class Country {
  private constructor(
    private readonly value: CountryCode,
  ) {}

  public static create(value: string): Country {
    if (!Object.values(CountryCode).includes(value as CountryCode)) {
      throw new Error(
        'countryISO must be PE or CL',
      );
    }

    return new Country(value as CountryCode);
  }

  public getValue(): CountryCode {
    return this.value;
  }
}