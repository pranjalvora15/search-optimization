
# search-optimzation

 Attach debouncing and throttling to your search box in just one line of code where you can choose to cache the search result or not.


## Features

- This npm package provides two hooks namely useDebounce and useThrottle. Using this hooks you can apply debouncing and throttling to your search box

- You can control the delay time of debouncing and throttling.
- You can also decide whether you want to cache the result or not (it stores 10 results to save network call).


## Installation

With npm:

```bash
  npm i search-optimization
```
With yarn
```bash
  yarn add search-optimization
```
## Demo

- [codesandbox demo link](https://codesandbox.io/s/search-optimization-o852up?file=/src/App.js)

To see useDebounce really working please click [here](https://usedebounce-with-caching-demo.netlify.app/) ( the demo is fully automated ) and open network tab and observe network call happening. In this example the caching is on.


## Usage

Create the async function which is fetching data. Function must return the response. Also your input or search box must be controlled by React.

useDebounce and useThrottle both hook accepts 4 arguments and they are an apiCallFunction, delay, a state variable that is controlling the input or search box and flag which is boolean value to make caching on and off.

useDebounce returns one object that has _**data**_ and _**error**_ property.  _**data**_ contains the returned result from fetch call and _**error**_ contains error if API call fails. You can also give custom error in your async function as it is shown in below example.

useThrottle returns one object that has _**data**_, _**error**_ and _**timerID**_ property.  _**data**_ contains the returned result from fetch call and _**error**_ contains error if API call fails. You can also give custom error in your async function as it is shown in below example. _**timerID**_ is given because let say someone is applying on search box which is displaying the fetched result from API call in dropdown where clicking on anyone of those fetched result will redirected to another page and in this scenario if someone has provided delay of _2000_ or more milliseconds (which is not the ideal case) and in that two seconds result are fetched and displayed and user has clicked on any one of those fetched result and redirected to another page. Now at this point of time unmounting of that component of the current page will happen as user is redirected to another page and one must take care of clearing the things while unmounting of the component. For this particular reason everytime _**timerID**_ is returned so that at time of unmounting you can clear it. 


```javascript
import { useState } from "react";
import { useDebounce } from "search-optimization";
export default function App() {
  const [query, setQuery] = useState("Bangalore");
  const { data, error } = useDebounce(fetchData, 500, query, true);
  async function fetchData() {
    const url = `https://api.api-ninjas.com/v1/weather?city=${query}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_NINJA_API_KEY
      }
    });

    /* Manytimes irrespective of bad response, say 404 or 500,
     api call will still fulfill the promise to avoid that 
     one can check response.ok if it is false one can throw
     their own error
     If you don't do this explicitly then promise get fullfilled
     and it will pass error to data instead of passing it to
     error  */

    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const apiData = await response.json();
    // api call must return data
    return apiData;
  }

  const handleChange = (e) => {
    console.log(e?.target?.value);
    setQuery(e?.target?.value);
  };
  return (
    <div className="App">
      <input type="text" value={query} onChange={handleChange} />
      {data && (
        <div className="table">
          <span>Temperature:</span>
          <span>{data.temp}</span>
          <span>Feels Like:</span>
          <span>{data.feels_like}</span>
          <span>Humidity:</span>
          <span>{data.humidity}</span>
          <span>Wind speed:</span>
          <span>{data.wind_speed}</span>
        </div>
      )}
      {error && <p>{error.message}</p>}
    </div>
  );
}

```

You can clear _timerID_ in following way as shown below
```javascript
//....
const {data,error,timerID} = useThrottle(fetchData, 2000, value, true);

//....

useEffect(() => {
    return () => clearTimeout(timerID);
  }, []);

//.....

return (
    {/* ... */}
)

```
## Things to keep in mind💡

- If you do not pass the first argument or first argument as function then hook will throw error in console.
- If forget to pass second argument i.e. delay argument then by default delay time will be _zero_.
- If you forget to return the fetched data from api call then hook will give error in _**error**_ property of returned object from useDebounce or useThrottle hook. 
- If you forget to pass third argument i.e. state variable which is controlling input or search box it will throw an error in console.
- If you forget to pass the fourth argument i.e. flag which turns on and off caching of the result fetched from an API call, by default caching value will be set to false.