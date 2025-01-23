import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Custom metric for tracking response time
let responseTime = new Trend('response_time');

// Parameters for your test
const url = 'http://otus_app:3000/api/user/search'; // Change this to your search endpoint

function randomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Configure the virtual users (VUs) and duration for the test
export let options = {
  // scenarios: {
  //   scenario1: {
  //     executor: 'constant-arrival-rate', // фиксированная частота запросов
  //     duration: '1m', // продолжительность теста 1 минута
  //     rate: 10, // количество запросов в секунду
  //     preAllocatedVUs: 5, // максимальное количество виртуальных пользователей (VUs)
  //     timeUnit: '1s', // частота запросов в секунду
  //   },
  //   scenario10: {
  //     executor: 'constant-arrival-rate',
  //     duration: '1m', // test duration
  //     rate: 10, // requests to be made according to the TimeUnit we give
  //     preAllocatedVUs: 5, // maximum VUs to be used for the given rate value in the test
  //     timeUnit: '1s', // how long the given rate value will be applied
  //   },
  //   scenario100: {
  //     executor: 'constant-arrival-rate',
  //     duration: '1m', // test duration
  //     rate: 100, // requests to be made according to the TimeUnit we give
  //     preAllocatedVUs: 50, // maximum VUs to be used for the given rate value in the test
  //     timeUnit: '1s', // how long the given rate value will be applied
  //   },
  //   scenario1000: {
  //     executor: 'constant-arrival-rate',
  //     duration: '1m', // test duration
  //     rate: 1000, // requests to be made according to the TimeUnit we give
  //     preAllocatedVUs: 500, // maximum VUs to be used for the given rate value in the test
  //     timeUnit: '1s', // how long the given rate value will be applied
  //   },
  // },
  stages: [
    { duration: '1m', target: 1 }, // 1 VU for 1 minute
    { duration: '1m', target: 10 }, // Ramp-up to 10 VUs in 1 minute
    { duration: '1m', target: 100 }, // Ramp-up to 100 VUs in 1 minute
    { duration: '1m', target: 1000 }, // Ramp-up to 1000 VUs in 1 minute
  ],
  // stages: [
  //   { duration: '1m', target: 60 }, // 1 VU for 1 minute
  //   { duration: '1m', target: 600 }, // Ramp-up to 10 VUs in 1 minute
  //   { duration: '1m', target: 6000 }, // Ramp-up to 100 VUs in 1 minute
  //   { duration: '1m', target: 60000 }, // Ramp-up to 1000 VUs in 1 minute
  // ],
  // thresholds: { http_req_duration: ['avg<150'] },
  // noConnectionReuse: true,
  // summaryTrendStats: ['avg', 'min', 'max', 'count'],
};

export default function () {
  let firstName = randomString(8); // Generate a random string of 8 characters for first name
  let lastName = randomString(10);

  let urlPath = `${url}?first_name=${firstName}&last_name=${lastName}`;

  // Perform a search request
  let res = http.get(`${urlPath}`);

  // Track response time
  responseTime.add(res.timings.duration);

  // Check if the response status is 200
  // check(res, {
  // 'status is 200': (r) => r.status === 200,
  // 'response time is acceptable': (r) => r.timings.duration < 2000, // Less than 2 seconds
  // });

  // Simulate user think time (time between requests)
  //   check(res, {
  //       'is status 200': (r) => r.status == 200,
  //   });
}
