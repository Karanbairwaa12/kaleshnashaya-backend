const handleResponse = (res, statusCode, result, message, data = {}, specificError=null) => {
    return res.status(statusCode).send({
        result,
        message,
        specificError, 
        data,
    });
};

module.exports = handleResponse;