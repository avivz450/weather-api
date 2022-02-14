import ValidationDetails from '../types/validation.types';

const validationCheck = (validationQueue: ValidationDetails[]): void => {
  while (validationQueue.length !== 0) {
    const validationDetail = validationQueue.shift() as ValidationDetails;

    if (validationDetail[0] === false) {
      throw validationDetail[1];
    }
  }
};

export default validationCheck;
