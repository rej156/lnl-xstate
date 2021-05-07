import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import React, { useEffect } from "react";
import { Event, machine, State } from "./Machine";

const World = () => {
  const [current, send] = useMachine(machine, { devTools: true });
  useEffect(() => {
    inspect({
      // url: "https://statecharts.io/inspect",
      iframe: false,
    });
  }, []);

  if (current.matches(State.inactive)) {
    return (
      <div className="container">
        <p>{`Context: ${JSON.stringify(current.context)}`}</p>
        <p>Inactive state</p>
        <input
          type="text"
          onChange={({ target: { value } }) =>
            send(Event.changeWorld, { world: value })
          }
          placeholder="changeWorld"
        />
        <button type="submit" onClick={() => send(Event.submit)}>
          Submit
        </button>
      </div>
    );
  }
  if (current.matches(State.worldInvalid)) {
    return (
      <div className="container">
        <p>World Invalid state</p>
        <p>Please try again</p>
        <button type="button" onClick={() => send(Event.retry)}>
          Retry
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.fetchingWorld] })) {
    return (
      <div className="container">
        <p>World Submitted: Fetching world...</p>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.worldInvalid] })) {
    return (
      <div className="container">
        <p>World Submitted: Invalid state</p>
        <p>Please try again</p>
        <button type="button" onClick={() => send(Event.retry)}>
          Retry
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.worldValid] })) {
    return (
      <div className="container">
        <p>Flat World valid</p>
        <button type="button" onClick={() => send(Event.finish)}>
          Finish
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.finished] })) {
    return (
      <div className="container">
        <p>Finished</p>
      </div>
    );
  }
  return <div>Some other state</div>;
};

export { World };
