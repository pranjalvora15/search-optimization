import { useEffect, useState } from "react";

export const useDebounce = (
  apiCallFunction = undefined,
  delay = 0,
  query = undefined,
  isCached = false
) => {
  const [cache, setCache] = useState({});
  const [result, setResult] = useState({ data: null, error: null });

  if (apiCallFunction === undefined) {
    throw new Error("Please provide first argument in useDebounce hook");
  }

  if (typeof apiCallFunction !== "function") {
    throw new Error(
      "Please provide first argument in useDebounce hook as a function which must be API call"
    );
  }

  if (query === undefined) {
    throw new Error("Please provide query argument in useDebounce hook");
  }

  useEffect(() => {
    let timer = setTimeout(async () => {
      if (isCached && cache[query]) {
        // returning the result from cache
        setResult({ data: cache[query], error: null });
      } else {
        try {
          if (isCached && Object.keys(cache).length === 10) {
            // if cache length is 10 then removing one result from top of the cache
            const key = Object.keys(cache)[0];
            delete cache[key];
          }
          // making api call
          let response = await apiCallFunction();

          // apiCallFunction must return data if api call succeeded not undefined otherwise throw error
          if (response === undefined) {
            throw new Error("Please return data from API call");
          }

          if (isCached && query) {
            // if the searched keyword is not there in cache,add that keyword with obtained result
            setCache({ ...cache, [query]: response });
          }

          setResult({ data: response, error: null });
        } catch (error) {
          setResult({ data: null, error });
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [query]);
  return result;
};
