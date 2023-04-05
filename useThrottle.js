import { useEffect, useState } from "react";

export function useThrottle(
  apiCallFunction = undefined,
  delay = 0,
  query = undefined,
  isCached = false
) {
  const [result, setResult] = useState({
    data: null,
    error: null,
    timerID: null,
  });
  const [flag, setFlag] = useState(true);
  const [cache, setCache] = useState({});

  if (apiCallFunction === undefined) {
    throw new Error("Please provide first argument in useThrottle hook");
  }
  if (typeof apiCallFunction !== "function") {
    throw new Error(
      "Please provide first argument in useThrottle hook as a function which must be API call"
    );
  }

  if (query === undefined) {
    throw new Error("Please provide query argument in useThrottle hook");
  }

  useEffect(() => {
    (async () => {
      try {
        if (flag) {
          if (isCached && cache[query]) {
            // returning the result from cache
            // at this point of time search result is already served from cache
            // so need to apply throttling
            setFlag(false);
            let timerID = setTimeout(() => setFlag(true), delay);
            setResult({ data: cache[query], error: null, timerID });
          } else {
            if (isCached && Object.keys(cache).length === 10) {
              // if cache length is 10 then removing one result from top of the cache
              const key = Object.keys(cache)[0];
              delete cache[key];
            }
            // making api call
            setFlag(false);
            const response = await apiCallFunction();

            // apiCallFunction must return data if api call succeeded not undefined otherwise throw error
            if (response === undefined) {
              throw new Error("Please return data from API call");
            }

            if (isCached && query) {
              // if the searched keyword is not there in cache,add that keyword with obtained result
              setCache({ ...cache, [query]: response });
            }

            let timerID = setTimeout(() => setFlag(true), delay);
            setResult({ data: response, error: null, timerID });
          }
        }
      } catch (error) {
        setResult({ data: null, error, timerID: null });
      }
    })();
  }, [query]);

  return result;
}
