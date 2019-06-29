const coreError = [
    'Error',
    'EvalError',
    'InternalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError'
]
const mongooseError = [
    `MongooseError`,
    `ObjectExpectedError`,
    `MissingSchemaError`,
    `DisconnectedError`,
    `DivergentArrayError`,
    `MissingSchemaError`,
    `ObjectParameterError`,
    `OverwriteModelError`,
    `ParallelSaveError`,
    `StrictModeError`,
    `VersionError`
]
const mongooseClientError = [
    'CastError',
    `ValidatorError`,
    `ValidationError`
]
const jwtError = [
    'JsonWebTokenError',
    'NotBeforeError',
    'TokenExpiredError'
]


module.exports = function (err, req, res, next) {
    if (coreError.includes(err.name)) {
        err.source = 'core'
        // console.log(err)
        switch (err.message) {
            case "Invalid login input":
                res.status(400).json({
                    err: {
                        name: err.name,
                        source: err.source,
                        message: err.message
                    }
                })
                break;

            case "Invalid register input":
                res.status(400).json({
                    err: {
                        name: err.name,
                        source: err.source,
                        message: err.message
                    }
                })
                break;

            case "Not authenticated":
                res.status(401).json({
                    err: {
                        name: err.name,
                        source: err.source,
                        message: err.message
                    }
                })
                break;

            case "Not authorized":
                res.status(401).json({
                    err: {
                        name: err.name,
                        source: err.source,
                        message: err.message
                    }
                })
                break;

            default:
                // console.log(err)
                res.status(500).json({
                    err: {
                        name: err.name,
                        source: err.source,
                        message: err.message
                    }
                })
                break;;
        }
    } else if (mongooseError.includes(err.name)) {
        err.source = 'mongoose server'
        if (!err.message) {
            err.message = 'database error'
        }
        // console.log(err)
        res.status(500).json({
            err: {
                name: err.name,
                source: err.source,
                message: err.message
            }
        })
    } else if (mongooseClientError.includes(err.name)) {
        err.source = 'mongoose client'
        if (!err.message) {
            err.message = 'bad request, can not be processed in database'
        }
        // console.log(err)
        res.status(400).json({
            err: {
                name: err.name,
                source: err.source,
                message: err.message
            }
        })
    } else if (jwtError.includes(err.name)) {
        err.source = 'jsonwebtoken'
        if (err.message === 'jwt must be provided') {
            res.status(401).json({
                err: {
                    name: err.name,
                    source: err.source,
                    message: err.message
                }
            })
        } else if (!err.message) {
            err.message = 'error in token generate/verify'
        }
        console.log(err.message)
        res.status(500).json({
            err: {
                name: err.name,
                source: err.source,
                message: err.message
            }
        })
    } else {
        err.source = 'unknown'
        if (!err.message) {
            err.message = 'unknown error'
        }
        // console.log(err)
        res.status(500).json({
            err: {
                name: err.name,
                source: err.source,
                message: err.message
            }
        })
    }
}