import React from "react";
import { render, screen } from "@testing-library/react";
import App, { User } from "./App";

const MOCK_LIST: User[] = [
  {
    login: "Lorem Ipsum",
    id: 14291380,
  },
  {
    login: "de Finibus Bonorum et Malorum",
    id: 42897193,
  },
];

global.fetch = Promise.resolve({
  json: () => Promise.resolve(MOCK_LIST),
}) as any;

// TODO: figure out how to mock global fetch
test("renders my account name with load button", () => {
  render(<App />);

  const myName = screen.getByText(/kei95/i);
  const buttonText = screen.getByText("load");

  expect(myName).toBeInTheDocument();
  expect(buttonText).toBeInTheDocument();
});
