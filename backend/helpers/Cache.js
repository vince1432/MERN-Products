import redisClient from "../util/redisClient.js"

export const getCache = async (key) => {
  const data = await redisClient.get(key);
  
  return JSON.parse(data);
};

export const setCache = async (key, data, expire = 60) => {
  redisClient.setEx(key, expire, JSON.stringify(data));
};

export const removeOneCache = async (key, id) => {
  const data = await getCache(key)
  if(data) {
    const filteredData = data.filter(element => element._id !== id);
    setCache(key, filteredData);
  }
};

export const addOneCache = async (key, newData) => {
  const data = await getCache(key)
  if(data) {
    data.push(newData);
    setCache(key, data);
  }
};

export const updateOneCache = async (key, id, newData) => {
  const data = await getCache(key)
  if(data) {
    const newArr = data.map(element => {
      if(element._id === id) {
        element = newData;
      }

      return element;
    });
    
    setCache(key, newArr);
  }
};