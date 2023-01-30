const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs().tz('Asia/Seoul');

const dayjsTime = () => {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  return now;
};

const dayjsChatTime = () => {
  const now = dayjs().format('h:ss A');
  return now;
};

const dayjsAddDays = (start_date, days) => {
  const date = dayjs(start_date);
  const end_date = date.add(days, 'day').format('YYYY-MM-DD HH:mm:ss');
  return end_date;
};

const dayjsIsSuspended = (end_date) => {
  const now = dayjs();
  const date = dayjs(now);
  const sameOrBefore = date.isSameOrBefore(end_date, 'day');
  console.log(sameOrBefore);
  return sameOrBefore;
};

module.exports = {
  dayjsTime,
  dayjsChatTime,
  dayjsAddDays,
  dayjsIsSuspended,
};
