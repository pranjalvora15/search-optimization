import { useEffect, useState } from "react";

export const useDebounce = (apiCall, delay, query, isCached) => {
  const [cache, setCache] = useState({});
  const [result, setResult] = useState({ data: null, error: null });

  useEffect(() => {
    let timer = setTimeout(async () => {
      if (isCached && cache[query]) {
        // returning the result from cache
        setResult({ data: cache[query], error: null });
        return result;
      } else {
        try {
          if (isCached && Object.keys(cache).length === 10) {
            // if cache length is 10 then removing one result from top of the cache
            const key = Object.keys(cache)[0];
            delete cache[key];
          }
          // making api call
          let response = await apiCall();
          if (isCached && query) {
            // if the searched keyword is not there in cache,add that keyword with obtained result
            setCache({ ...cache, [query]: response });
          }

          setResult({ data: response, error: null });
          return result;
        } catch (error) {
          setResult((prevState) => ({ ...prevState, error }));
          return result;
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [query]);
  return result;
};
