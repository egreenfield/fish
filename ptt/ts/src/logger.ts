import * as winston from 'winston';
import { inspect } from 'util';
let w:any = winston;

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf((info:any) => {
  let meta = {...info};
  delete meta.timestamp;
  delete meta.label;
  delete meta.level;
  delete meta.message;
  if(Object.keys(meta).length == 0)
    return `${info.timestamp} ${info.level}: ${info.message}`;
  else
    return `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(meta)}`;
});


export const logger = winston.createLogger({
  level: 'info',
  // format: combine(
  //   timestamp(),
  //   myFormat
  // ),
  transports: [
    new winston.transports.Console({
      formatter: combine(
        label({ label: 'right meow!' }),
        timestamp(),
        myFormat
      ),          
    }),
    new winston.transports.File({
      filename: '../../logs/listener.log',
      json: true,
    })
//    new winston.transports.File({ filename: 'combined.log' })
  ]
});



// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


let fixQuery = function() {

  function clone(obj:any) {
      var copy:any = Array.isArray(obj) ? [] : {};
      for (var i in obj) {
          if (Array.isArray(obj[i])) {
              copy[i] = obj[i].slice(0);
          } else if (obj[i] instanceof Buffer) {
              copy[i] = obj[i].slice(0);
          } else if (typeof obj[i] != 'function') {
              copy[i] = obj[i] instanceof Object ? clone(obj[i]) : obj[i];
          } else if (typeof obj[i] === 'function') {
              copy[i] = obj[i];
          }
      }
      return copy;
  }
  require("winston/lib/winston/common").clone = clone;

  let Transport = require("winston-transport");
  Transport.prototype.normalizeQuery = function (options:any) {  //
      options = options || {};

      // limit
      options.rows = options.rows || options.limit || 10;

      // starting row offset
      options.start = options.start || 0;

      // now
      options.until = options.until || new Date;
      if (typeof options.until !== 'object') {
          options.until = new Date(options.until);
      }

      // now - 24
      options.from = options.from || (options.until - (24 * 60 * 60 * 1000));
      if (typeof options.from !== 'object') {
          options.from = new Date(options.from);
      }

      // 'asc' or 'desc'
      options.order = options.order || 'desc';

      // which fields to select
      options.fields = options.fields;

      return options;
  };
  Transport.prototype.formatResults = function (results:any, options:any) {
      return results;
  };    
}



fixQuery();
