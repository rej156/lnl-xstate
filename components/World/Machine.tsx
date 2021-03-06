import { assign, Machine } from "xstate";
import { assert } from "chai";
import { waitFor } from "@testing-library/dom";

type Context = {
  world: string;
};

export enum Event {
  changeWorld = "changeWorld",
  submit = "submit",
  retry = "retry",
  finish = "finish",
}

type Events =
  | {
      type: Event.changeWorld;
      world: string;
    }
  | {
      type: Event.submit;
    }
  | {
      type: Event.retry;
    }
  | {
      type: Event.finish;
    };

export enum State {
  inactive = "inactive",
  worldSubmitted = "worldSubmitted",
  worldInvalidInput = "worldInvalidInput",
  worldInvalid = "worldInvalid",
  fetchingWorld = "fetchingWorld",
  worldValid = "worldValid",
  finished = "finished",
}

type StateSchema = {
  states: {
    [State.inactive]: {};
    [State.worldSubmitted]: {
      states: {
        [State.fetchingWorld]: {};
        [State.worldInvalid]: {};
        [State.worldValid]: {};
        [State.finished]: {};
      };
    };
    [State.worldInvalidInput]: {};
  };
};

enum Action {
  handleChangeWorld = "handleChangeWorld",
  resetWorld = "resetWorld",
}

enum Guard {
  validWorld = "validWorld",
}

enum Service {
  fetchWorld = "fetchWorld",
}

const resetWorld = assign((context: Context, event: Events) => {
  return {
    ...context,
    world: "",
  };
});

const handleChangeWorld = assign((context: Context, event: Events) => {
  if (event.type === Event.changeWorld) {
    return {
      ...context,
      world: event.world,
    };
  }
  return { ...context };
});

const validWorld = (context: Context, event: Events) => {
  if (context?.world?.length > 3) {
    return true;
  }
  return false;
};

const fetchWorld = (context: Context) =>
  fetch("/api/hello")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log({ data, context });
      if (data.world === context.world) {
        return true;
      }
      throw new Error("world not valid");
    });

export const machine = Machine<Context, StateSchema, Events>(
  {
    id: "World",
    context: {
      world: "",
    },
    initial: State.inactive,
    states: {
      [State.inactive]: {
        on: {
          [Event.changeWorld]: {
            actions: [Action.handleChangeWorld],
          },
          [Event.submit]: [
            {
              target: State.worldSubmitted,
              cond: Guard.validWorld,
            },
            {
              target: State.worldInvalidInput,
            },
          ],
        },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId("inactive"));
          },
        },
      },
      [State.worldInvalidInput]: {
        on: {
          [Event.retry]: {
            target: State.inactive,
            actions: [Action.resetWorld],
          },
        },
        meta: {
          test: ({ getByTestId }) => {
            assert.ok(getByTestId("invalidInput"));
          },
        },
      },
      [State.worldSubmitted]: {
        initial: State.fetchingWorld,
        on: {
          [Event.retry]: {
            target: State.inactive,
            actions: [Action.resetWorld],
          },
        },
        states: {
          [State.fetchingWorld]: {
            invoke: {
              src: Service.fetchWorld,
              onDone: State.worldValid,
              onError: `${State.worldInvalid}`,
            },
            // meta: {
            //   test: ({ getByTestId }) => {
            //     assert.ok(getByTestId("fetching"));
            //   },
            // },
          },
          [State.worldInvalid]: {
            // meta: {
            //   test: ({ getByTestId }) => {
            //     assert.ok(getByTestId("invalid"));
            //   },
            // },
          },
          [State.worldValid]: {
            on: {
              [Event.finish]: {
                target: State.finished,
              },
            },
            // meta: {
            //   test: ({ getByTestId }) => {
            //     assert.ok(getByTestId("valid"));
            //   },
            // },
          },
          [State.finished]: {
            type: "final",
            // meta: {
            //   test: ({ getByTestId }) => {
            //     assert.ok(getByTestId("finished"));
            //   },
            // },
          },
        },
      },
    },
  },
  {
    actions: {
      [Action.handleChangeWorld]: handleChangeWorld,
      [Action.resetWorld]: resetWorld,
    },
    guards: {
      [Guard.validWorld]: validWorld,
    },
    services: {
      [Service.fetchWorld]: fetchWorld,
    },
  }
);
