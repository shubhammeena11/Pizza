
class CustomErrorHandler extends Error{
    constructor(status, message){
        super(message);
        this.status = status;
        this.message = message;
    }

    static alreadyExists(message){
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message){
        return new CustomErrorHandler(401, message);
    }

    static unAuthorization(message = "unAuthorization"){
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = "user not Found"){
        return new CustomErrorHandler(404, message);
    }

    static badRequest(message = "Bad Request"){
        return new CustomErrorHandler(400, message);
    }

    static serverError(message = "Server Error"){
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;
