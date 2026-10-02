import { Country } from '../../../src/domain/value-objects/country.vo';

describe('Country', () => {
  it('should create a Peru country', () => {
    const country = Country.create('PE');

    expect(country.getValue()).toBe('PE');
  });

  it('should create a Chile country', () => {
    const country = Country.create('CL');

    expect(country.getValue()).toBe('CL');
  });

  it('should reject unsupported countries', () => {
    expect(() => Country.create('AR')).toThrow();
  });

  it('should reject an invalid country code', () => {
    expect(() => Country.create('PER')).toThrow();
  });
});