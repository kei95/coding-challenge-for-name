import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App, { User, UserRow } from "./App";
import { rest, server } from "./mocks/server";
import { MOCKED_FOLLOWER_LIST } from "./mocks/handlers";

describe("<App />", () => {
  test("render the component - it should contain my account name", async () => {
    render(<App />);

    const myName = screen.getByText(/kei95/i);
    expect(myName).toBeInTheDocument();
  });

  test("fetches my followers upon render - it should show expected users with load buttons", async () => {
    render(<App />);

    // find all followers in mocked sponse
    for (const follower of MOCKED_FOLLOWER_LIST) {
      expect(await screen.findByText(follower.login)).toBeInTheDocument();
    }

    // make sure all the added followers have load button
    expect(await screen.findAllByText(/load/i)).toHaveLength(
      MOCKED_FOLLOWER_LIST.length
    );
  });

  test("fetch failure - it should show error message", async () => {
    // set up error response for the API
    const testErrorMessage = "THIS IS A TEST FAILURE";
    server.use(
      rest.get(
        "https://api.github.com/users/:username/following",
        async (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: testErrorMessage }));
        }
      )
    );

    render(<App />);

    const errorMessage =
      "There's something wrong with you as a developer or this app. Please try again.";
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});

describe("<UserRow />", () => {
  const MOCKED_USER: User = {
    login: "Lorem Ipsum",
    id: 0,
  };

  test("render the component - should render given user's name with load button", async () => {
    render(<UserRow user={MOCKED_USER} />);

    const mockedUserName = screen.getByText(MOCKED_USER.login);
    const defaultButton = screen.getByText("load");

    expect(mockedUserName).toBeInTheDocument();
    expect(defaultButton).toBeInTheDocument();
  });

  test("click on load button - it should trigger a request to get followers and add them to the list", async () => {
    render(<UserRow user={MOCKED_USER} />);

    const defaultButtonText = "load";
    const loadingButtonText = "loading...";
    userEvent.click(screen.getByText(defaultButtonText));

    // button should have loading... text while fetching data
    expect(screen.getByText(loadingButtonText)).toBeInTheDocument();

    // find all followers in mocked response
    for (const follower of MOCKED_FOLLOWER_LIST) {
      expect(await screen.findByText(follower.login)).toBeInTheDocument();
    }

    // make sure all the added followers have load button
    expect(await screen.findAllByText(defaultButtonText)).toHaveLength(
      MOCKED_FOLLOWER_LIST.length
    );
  });

  test("click on load button but fails fetch - button should back to be default state", async () => {
    // set up error response for the API
    const testErrorMessage = "THIS IS A TEST FAILURE";
    server.use(
      rest.get(
        "https://api.github.com/users/:username/following",
        async (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: testErrorMessage }));
        }
      )
    );

    render(<UserRow user={MOCKED_USER} />);

    const defaultButtonText = "load";
    const loadingButtonText = "loading...";
    userEvent.click(screen.getByText(defaultButtonText));

    // button should have loading... text while fetching data
    expect(screen.getByText(loadingButtonText)).toBeInTheDocument();

    // once request fails, the button should back to be default
    expect(await screen.findByText(defaultButtonText)).toBeInTheDocument();
  });
});
