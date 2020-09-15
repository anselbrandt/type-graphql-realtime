import React from "react";
import "./App.css";
import { useQuery, useSubscription, gql } from "@apollo/client";

const query = gql`
  {
    hello
  }
`;

const subscription = gql`
  subscription {
    time
  }
`;

function App() {
  const { loading: qloading, error: qerror, data: qdata } = useQuery(query);
  const { loading: sloading, error: serror, data: sdata } = useSubscription(
    subscription
  );

  return (
    <div className="App">
      <div>{qdata ? qdata.hello : null}</div>
      <div>{sdata ? sdata.time : null}</div>
    </div>
  );
}

export default App;
