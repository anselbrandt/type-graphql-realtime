import React from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  {
    hello
  }
`;

function App() {
  const { loading, error, data } = useQuery(query);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data.hello);

  return <div className="App">{data ? data.hello : null}</div>;
}

export default App;
