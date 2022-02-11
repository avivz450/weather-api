import ValidationDetails from "../types/validation.types";

const validationCheck = (validationQueue: ValidationDetails[]) => {
    validationQueue.forEach(validationDetail => {
<<<<<<< HEAD
        if(!validationDetail[0]){
=======
        if(validationDetail[0] === false){
>>>>>>> a8734b93e851f8adf2079241157d94973ac8c2ff
            throw validationDetail[1];
        }
    })
}

export default validationCheck;