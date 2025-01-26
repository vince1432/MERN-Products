import Redis from 'redis';

const redisClient = Redis.createClient();

redisClient.on("error", (err) => {
  console.log("error: ". err);
})

await redisClient.connect();

export default redisClient;
