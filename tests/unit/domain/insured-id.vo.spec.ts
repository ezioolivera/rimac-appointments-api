import { InsuredId } from '../../../src/domain/value-objects/insured-id.vo';

describe('InsuredId', () => {
  it('should create a valid insured id', () => {
    const insuredId = InsuredId.create('01234');

    expect(insuredId.getValue()).toBe('01234');
  });

  it('should preserve leading zeros', () => {
    const insuredId = InsuredId.create('00001');

    expect(insuredId.getValue()).toBe('00001');
  });

  it('should reject an insured id with less than 5 digits', () => {
    expect(() => InsuredId.create('1234')).toThrow();
  });

  it('should reject an insured id with more than 5 digits', () => {
    expect(() => InsuredId.create('123456')).toThrow();
  });

  it('should reject an insured id with non-numeric characters', () => {
    expect(() => InsuredId.create('12ABC')).toThrow();
  });
});