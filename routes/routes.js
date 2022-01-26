const express = require('express');
const Joi = require('@hapi/joi');
const moment = require('moment');
const { getItems } = require('../models/db');

const router = express.Router();

const requestSchema = Joi.object().keys({
    startDate: Joi.date().required(),
    endDate : Joi.date().greater(Joi.ref('startDate')).max('now').required(),
    minCount: Joi.number().integer().min(1).required(),
    maxCount: Joi.number().integer().min(Joi.ref('minCount')).required(),
});


router.post('/records', async (req, res) => {
    const result = requestSchema.validate(req.body);
    let response = {};
    let status = 200;

    if (result.error) {
        status = 400;
        response = {
          "code":status,
          "msg":result.error.details[0].message,
        };
    } else {
          try {
              const records = await getItems();
              const results = reduceRecords(records,req.body);
              response = {
                "code":0,
                "msg":'success',
                'records': results,
              };
          } catch (error) {
              console.log(error);
              status = 500;
              response = {
                "code":status,
                "msg":'internal server error',
              };
          }
  }

  res.status(status).json(response);
});

reduceRecords = (records, {startDate, endDate, minCount, maxCount}) => {
    return records.map((record) => {
      const date = moment(record.createdAt).format('YYYY-MM-DD');
      const totalCount = record.counts.reduce((a,b) => a+b);

      if (new Date(startDate) <= new Date(date) && 
          new Date(date) < new Date(endDate)  && 
          minCount <= totalCount && 
          totalCount <= maxCount) {

        const res = {
          "createdAt": record.createdAt,
          totalCount,
          "key": record.key,
        };
        return res;
      }
  }).filter(record => record !== undefined);
};

module.exports = router
