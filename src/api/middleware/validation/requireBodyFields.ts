const ApiHttpException = require('../../../infrastructure/api/errors/ApiHttpException');

function requireBodyFields(fields = []) {
    return (req, res, next) => {
        const missingFields = fields.filter((field) => {
            const value = req.body?.[field];
            return value === undefined || value === null || value === '';
        });

        if (missingFields.length > 0) {
            return next(new ApiHttpException({
                status: 400,
                code: 'INVALID_BODY',
                message: 'Required request body fields are missing.',
                fields: missingFields.reduce((acc, field) => {
                    acc[field] = 'required';
                    return acc;
                }, {}),
            }));
        }

        return next();
    };
}

module.exports = {
    requireBodyFields,
};