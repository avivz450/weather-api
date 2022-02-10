import ValidationDetails from "../types/validation.types";

const validationCheck = (validationQueue: ValidationDetails[]) => {
    validationQueue.forEach(validationDetail => {
        if(validationDetail[0] === false){
            throw validationDetail[1];
        }
    })
}

export default validationCheck;