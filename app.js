const express = require('express');
const axios = require('axios');
const redis = require('redis');

const app = express();
// const redisClient = redis.createClient();

const redisPassword = "123456789" ; 
const redisClient = redis.createClient({
          host : '127.0.0.1',
          port : 6379,
          no_ready_check: true,
          auth_pass: redisPassword,                                                                                                                                                           
});                  

app.get('/', (req, res) => {
  const username = req.query.username || 'arsarawut';

  const url = `https://api.github.com/users/${username}`;

  redisClient.get(username, async (err, reply) => {
    if (reply) {
      return res.json(JSON.parse(reply));
    }

    const response = await axios.get(url);
    redisClient.setex(username, 60, JSON.stringify(response.data));

    return res.json(response.data);
  });
});

app.listen(3000, () => {
  console.log('running');
});
