import { useEffect, useState } from "react";
import "./App.css";

// ========= constant =========
const MY_ACCOUNT_NAME = "kei95";

// ========== Definition ==========
export interface User {
  login: string;
  id: number;
}

const ROW_STATE = {
  LOADING: "LOADING",
  OPEN: "OPEN",
  DEFAULT: "DEFAULT",
} as const;

type RowState = keyof typeof ROW_STATE;

// ========== Util ==========
async function fetchFollowers(username: string): Promise<User[]> {
  const res = await fetch(`https://api.github.com/users/${username}/following`);

  if (res.ok) {
    const jsonizedRes = (await res.json()) as User[];
    return jsonizedRes;
  }
  return [];
}

// ========== Component ==========
function UserRow({ user }: { user: User }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [state, setState] = useState<RowState>(ROW_STATE.DEFAULT);
  const buttonText = state === ROW_STATE.LOADING ? "loading..." : "load";

  const handlePressButton = async () => {
    setState(ROW_STATE.LOADING);
    const res = await fetchFollowers(user.login);
    setState(ROW_STATE.OPEN);
    setUserList(res);
  };

  return (
    <ul>
      <li key={user.id}>
        {user.login}
        {state !== "OPEN" ? (
          <button
            onClick={handlePressButton}
            className={state === "LOADING" ? "loadingButton" : ""}
          >
            {buttonText}
          </button>
        ) : null}
        {/* list of the user's followers */}
        {userList.map((user) => (
          <UserRow user={user} />
        ))}
      </li>
    </ul>
  );
}

function App() {
  const [userList, setUserList] = useState<User[]>([]);

  // Fetch my followers as initial list
  useEffect(() => {
    async function fetchMyFollowers() {
      const followers = await fetchFollowers(MY_ACCOUNT_NAME);
      setUserList(followers);
    }
    fetchMyFollowers();
  }, []);

  return (
    <ul>
      <li>{MY_ACCOUNT_NAME}</li>
      {userList.map((user) => (
        <UserRow user={user} />
      ))}
    </ul>
  );
}

export default App;
