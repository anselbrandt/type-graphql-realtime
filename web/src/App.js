import React from "react";
import "./App.css";
import { useQuery, useSubscription, gql } from "@apollo/client";

const query = gql`
  {
    hello
  }
`;

const timeSubscription = gql`
  subscription {
    time
  }
`;

const randomSubscription = gql`
  subscription {
    random
  }
`;

function App() {
  const {
    loading: helloLoading,
    error: helloError,
    data: helloData,
  } = useQuery(query);
  const {
    loading: timeLoading,
    error: timeError,
    data: timeData,
  } = useSubscription(timeSubscription);
  const {
    loading: randomLoading,
    error: randomError,
    data: randomData,
  } = useSubscription(randomSubscription);

  return (
    <div className="App">
      <div>{helloData ? helloData.hello : null}</div>
      <div>{timeData ? timeData.time : null}</div>
      <div>{randomData ? randomData.random : null}</div>
    </div>
  );
}

export default App;
