import joi from '@hapi/joi';
import { PermissionsData } from '../utils';

const { all } = PermissionsData;

export const superAdminSchema = joi.object().keys({
  adminKey: joi.string().required()
    .label('Admin key must be a string'),
});

export const rolesSchema = joi.object().keys({
  roleId: joi.number().positive().valid(all).required()
    .label('Please enter a valid role id'),
  email: joi.string().email().required()
    .label('Please enter a valid email address')
});
