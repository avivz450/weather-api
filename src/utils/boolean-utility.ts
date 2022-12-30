export class BooleanUtility {
  static parseToBoolean(correlation_id: string, input: string | number | boolean): boolean {
    if (!input) {
      return false;
    }

    if (typeof input == 'boolean') {
      return input;
    }

    if (input === '0' || input === '-0' || input === 0 || input === -0) {
      return false;
    }
    return true;
  }
}
