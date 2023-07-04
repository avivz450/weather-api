export class BooleanUtility {
  static parseToBoolean(correlationId: string, input: string | number | boolean): boolean {
    if (input) {
      if (typeof input == 'boolean') {
        return input;
      }

      if (input === 'false') {
        return false;
      } else if (input === 'true') {
        return true;
      }

      throw new Error('INVALID_BOOLEAN_TYPE');
    }
  }
}
