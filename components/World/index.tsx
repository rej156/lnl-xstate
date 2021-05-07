import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import React, { useEffect } from "react";
import { Event, machine, State } from "./Machine";

const World = () => {
  const [current, send] = useMachine(machine, { devTools: true });

  if (current.matches(State.inactive)) {
    return (
      <div className="container" data-testid={"inactive"}>
        <p>{`Context: ${JSON.stringify(current.context)}`}</p>
        <p>Inactive state</p>
        <input
          data-testid={"changeWorld"}
          type="text"
          onChange={({ target: { value } }) =>
            send(Event.changeWorld, { world: value })
          }
          placeholder="changeWorld"
        />
        <button
          data-testid={"submit"}
          type="submit"
          onClick={() => send(Event.submit)}
        >
          Submit
        </button>
      </div>
    );
  }
  if (current.matches(State.worldInvalidInput)) {
    return (
      <div className="container">
        <p data-testid={"invalidInput"}>World Invalid state</p>
        <p>Please try again</p>
        <button
          data-testid={"retry"}
          type="button"
          onClick={() => send(Event.retry)}
        >
          Retry
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.fetchingWorld] })) {
    return (
      <div className="container" data-testid="fetching">
        <p>World Submitted: Fetching world...</p>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.worldInvalid] })) {
    return (
      <div className="container" data-testid="fetched">
        <p data-testid="invalid">World Submitted: Invalid state</p>
        <p>Please try again</p>
        <button
          data-testid={"retry"}
          type="button"
          onClick={() => send(Event.retry)}
        >
          Retry
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.worldValid] })) {
    return (
      <div className="container" data-testid="fetched">
        <p data-testid="valid">Flat World valid</p>
        <button
          data-testid={"finish"}
          type="button"
          onClick={() => send(Event.finish)}
        >
          Finish
        </button>
      </div>
    );
  }
  if (current.matches({ [State.worldSubmitted]: [State.finished] })) {
    return (
      <div className="container" data-testid="finished">
        <p>Finished</p>
      </div>
    );
  }
  return <div>Some other state</div>;
};

export { World };
