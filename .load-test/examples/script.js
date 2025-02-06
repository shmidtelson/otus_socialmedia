import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Custom metric for tracking response time
let responseTime = new Trend('response_time');

// Parameters for your test
const url = 'http://app:3000/api/user/search'; // Change this to your search endpoint
const writeUrl = 'http://app:3000/api/user/register';

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
  scenarios: {
    scenario1: {
      executor: 'constant-arrival-rate', // фиксированная частота запросов
      duration: '1m', // продолжительность теста 1 минута
      rate: 10, // количество запросов в секунду
      preAllocatedVUs: 5, // максимальное количество виртуальных пользователей (VUs)
      timeUnit: '1s', // частота запросов в секунду
    },
    scenario10: {
      executor: 'constant-arrival-rate',
      duration: '1m', // test duration
      rate: 10, // requests to be made according to the TimeUnit we give
      preAllocatedVUs: 5, // maximum VUs to be used for the given rate value in the test
      timeUnit: '1s', // how long the given rate value will be applied
    },
    scenario100: {
      executor: 'constant-arrival-rate',
      duration: '1m', // test duration
      rate: 100, // requests to be made according to the TimeUnit we give
      preAllocatedVUs: 50, // maximum VUs to be used for the given rate value in the test
      timeUnit: '1s', // how long the given rate value will be applied
    },
    scenario1000: {
      executor: 'constant-arrival-rate',
      duration: '1m', // test duration
      rate: 1000, // requests to be made according to the TimeUnit we give
      preAllocatedVUs: 500, // maximum VUs to be used for the given rate value in the test
      timeUnit: '1s', // how long the given rate value will be applied
    },
  },
  // stages: [
  //   { duration: '1m', target: 1 }, // 1 VU for 1 minute
  //   { duration: '1m', target: 10 }, // Ramp-up to 10 VUs in 1 minute
  //   { duration: '1m', target: 100 }, // Ramp-up to 100 VUs in 1 minute
  //   { duration: '1m', target: 1000 }, // Ramp-up to 1000 VUs in 1 minute
  // ],
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
  let firstName = randomString(8);
  let lastName = randomString(10);

  let searchRes = http.get(
    `${url}?first_name=${firstName}&last_name=${lastName}`,
  );
  responseTime.add(searchRes.timings.duration);

  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 2s': (r) => r.timings.duration < 2000,
  });

  let payload = JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1970-01-01',
    gender: 'male',
    interests: ['Some interest'],
    city: 'Moscow',
    password: '1234Abc!',
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let registerRes = http.post(writeUrl, payload, params);

  responseTime.add(registerRes.timings.duration);

  check(registerRes, {
    'register status is 200': (r) => r.status === 200,
    'register response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
