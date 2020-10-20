const Joi = require('joi');

//game parameters validation schema with joi
const newGameSchema = Joi.object({
    height: Joi.number().integer().min(3).max(100).required(),
    width: Joi.number().integer().min(3).max(100).required(),
    mines: Joi.number().integer().min(2).max(Joi.ref('totalSquares')),
    totalSquares: Joi.number().integer()
});

const validateNewGameReqBody = (req, res, next)=>{
    req.body.totalSquares = req.body.height * req.body.width;
    const {error} =newGameSchema.validate(req.body);
    if(error){
        res.status(500).json({error:error.message})
    }
    else{
        return next();
    }
}

//game id validation schema
const gameIdSchema = Joi.object({
    gameId: Joi.string().length(24).required()
});

const validateGameIdReqBody = (req, res, next)=>{
    const {error} = gameIdSchema.validate(req.params);
    if(error){
        res.status(500).json({error:error.message})
    }
    else{
        return next();
    }
}

//game id validation schema
const squareBodySchema = Joi.object({
    posY: Joi.number().integer().min(1).required(),
    posX: Joi.number().integer().min(1).required(),
    action: Joi.string().valid('reveal','question_mark', 'red_flag', "clean").required()
});

const validateBoxUpdateParamsAndBody = (req, res, next)=>{
    let {error} = squareBodySchema.validate(req.body)
    if(error){
        res.status(500).json({error:error.message})
    }
    else{
        return next();
    }
}


module.exports = {
    validateNewGameReqBody,
    validateGameIdReqBody,
    validateBoxUpdateParamsAndBody
}