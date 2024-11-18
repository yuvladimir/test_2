const Joi = require("joi");

const dateRegexp =
  /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/i;

const actions = [
  "createProduct",
  "createStocks",
  "incrementOnShelfStocks",
  "decrementOnShelfStocks",
  "incrementInOrdersStocks",
  "decrementInOrdersStocks",
];

const createHistoryRecordBody = {
  body: Joi.object().keys({
    plu: Joi.number().integer().required(),
    shopId: Joi.number().integer().required(),
    action: Joi.string()
      .valid(...actions)
      .required(),
  }),
};

const getHistoryRecordsQuery = {
  query: Joi.object().keys({
    page_size: Joi.number().integer().max(100),
    page_after: Joi.string(),
    page_before: Joi.string(),
    plu: Joi.number().integer(),
    shop_id: Joi.number().integer(),
    action: Joi.string().valid(...actions),
    date_from: Joi.string().pattern(dateRegexp),
    date_to: Joi.string().pattern(dateRegexp),
  }),
};

module.exports = {
  createHistoryRecordBody,
  getHistoryRecordsQuery,
};
