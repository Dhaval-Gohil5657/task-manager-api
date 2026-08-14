const sendError = (res, statuscode, message) => {
    return res.status(statuscode).json({
        message
    });
};

module.exports = {
    sendError
}