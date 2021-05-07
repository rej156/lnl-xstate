import React from "react";
import { createModel } from "@xstate/test";
import { Event, machine, State } from "./Machine";
import {
  render,
  fireEvent,
  cleanup,
  act,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { World } from ".";
import fetchMock from "jest-fetch-mock";

describe("World", () => {
  beforeAll(() => {
    fetchMock.mockResponse(async () => {
      return JSON.stringify({ world: "Flat" });
    });
  });

  const testModel = createModel(machine, {
    events: {
      [Event.changeWorld]: {
        exec: async ({ getByTestId }, event) => {
          act(() => {
            fireEvent.change(getByTestId("changeWorld"), {
              target: {
                value: (event as any).value,
              },
            });
          });
        },
        cases: [{ value: "EK" }, { value: "Invalid" }, { value: "Flat" }],
      },
      [Event.submit]: async ({ getByTestId }, event) => {
        act(() => {
          fireEvent.click(getByTestId("submit"));
        });
      },
      [Event.retry]: async ({ getByTestId }) => {
        act(() => {
          fireEvent.click(getByTestId("retry"));
        });
      },
      [Event.finish]: async ({ getByTestId }) => {
        act(() => {
          fireEvent.click(getByTestId("finish"));
        });
      },
    },
  });

  const testPlans = testModel.getShortestPathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      afterEach(cleanup);

      plan.paths.forEach((path) => {
        it(path.description, () => {
          const rendered = render(<World />);
          return path.test(rendered);
        });
      });
    });
  });

  it("coverage", () => {
    testModel.testCoverage({
      filter: (stateNode) => !!stateNode?.meta,
    });
  });
});
