import joi from '@hapi/joi';

const adminSchema = joi.object().keys({
  roleId: joi.number().positive().valid(1, 2).required()
    .label('Please enter a valid role id'),
  adminKey: joi.string().required()
    .label('Admin key must be a string'),
});

export default adminSchema;
