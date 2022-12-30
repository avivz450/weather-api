import validator from 'validator';

export class EmailUtility {
  static isValidEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    let result = validator.isEmail(email);
    return result;
  }
}
