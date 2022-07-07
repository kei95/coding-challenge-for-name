import { useEffect, useState } from "react";
import "./App.css";

// ========= constant =========
const MY_ACCOUNT_NAME = "kei95";

// ========== definition ==========
export interface User {
  login: string;
  id: number;
}

const REQUEST_STATE = {
  LOADING: "LOADING",
  DONE: "DONE",
  DEFAULT: "DEFAULT",
} as const;

type RequestState = keyof typeof REQUEST_STATE;

// ========== util ==========
async function fetchFollowers(username: string): Promise<User[] | undefined> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/following`
    );

    if (res.status < 300 && res.status > 199) {
      const jsonizedRes = (await res.json()) as User[];
      return jsonizedRes;
    }
  } catch (error) {
    console.error("error!", error);
  }

  return undefined;
}

// ========== component ==========
export function UserRow({ user }: { user: User }) {
  const [followerList, setFollowerList] = useState<User[]>([]);
  const [RequestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.DEFAULT
  );
  const buttonText =
    RequestState === REQUEST_STATE.LOADING ? "loading..." : "load";

  const handlePressButton = async () => {
    setRequestState(REQUEST_STATE.LOADING);
    const res = await fetchFollowers(user.login);

    // Bring the button back to default if request fails
    if (!res) {
      setRequestState(REQUEST_STATE.DEFAULT);
      return;
    }

    setRequestState(REQUEST_STATE.DONE);
    setFollowerList(res);
  };

  return (
    <ul>
      <li>
        {user.login}
        {RequestState !== "DONE" ? (
          <button
            onClick={handlePressButton}
            className={RequestState === "LOADING" ? "loadingButton" : ""}
          >
            {buttonText}
          </button>
        ) : null}
        {/* list of the user's followers */}
        {followerList.map((user) => (
          <UserRow user={user} key={user.id} />
        ))}
      </li>
    </ul>
  );
}

function App() {
  const [followerList, setFollowerList] = useState<User[]>([]);
  const [RequestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.DEFAULT
  );
  const statesText =
    RequestState === "LOADING"
      ? "Loading..."
      : "There's something wrong with you as a developer or this app. Please try again.";

  // Fetch my followers as initial list
  useEffect(() => {
    async function fetchMyFollowers() {
      setRequestState(REQUEST_STATE.LOADING);
      const followers = await fetchFollowers(MY_ACCOUNT_NAME);

      setRequestState(REQUEST_STATE.DONE);
      !!followers && setFollowerList(followers);
    }
    fetchMyFollowers();
  }, []);

  return (
    <ul>
      <li>{MY_ACCOUNT_NAME}</li>
      {followerList.length > 0 ? (
        followerList.map((follower) => (
          <UserRow user={follower} key={follower.id} />
        ))
      ) : (
        <p>{statesText}</p>
      )}
    </ul>
  );
}

export default App;
