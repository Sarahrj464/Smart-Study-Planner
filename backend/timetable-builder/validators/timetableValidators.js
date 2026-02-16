const { body, param } = require('express-validator');

const idString = (name) => body(name).isString().notEmpty().withMessage(`${name} is required`);

const createValidator = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('columns')
    .isArray({ min: 1 })
    .withMessage('Columns array is required'),
  body('columns.*.day').isString().notEmpty().withMessage('Column day is required'),
  body('columns.*.items').isArray().withMessage('Column items must be an array'),
  body('columns.*.items.*.id').isString().notEmpty(),
  body('columns.*.items.*.title').isString().notEmpty(),
  body('columns.*.items.*.start').isString().notEmpty(),
  body('columns.*.items.*.end').isString().notEmpty()
];

const updateValidator = [
  param('id').isMongoId().withMessage('Invalid timetable id'),
  ...createValidator
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid timetable id')];

module.exports = { createValidator, updateValidator, idParamValidator };