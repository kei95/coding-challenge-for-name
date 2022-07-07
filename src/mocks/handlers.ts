import { rest } from "msw";
import { User } from "../App";

export const MOCKED_FOLLOWER_LIST: User[] = [
  {
    login: "Lorem Ipsum",
    id: 14291380,
  },
  {
    login: "de Finibus Bonorum et Malorum",
    id: 42897193,
  },
];

export const handlers = [
  rest.get(
    "https://api.github.com/users/:username/following",
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(MOCKED_FOLLOWER_LIST));
    }
  ),
];
