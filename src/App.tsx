import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
//import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./components/About";
import Profile from "./components/Profile";
import ProfileUpdate from "./components/ProfileUpdate";
import DeleteAcc from "./components/Delete";
import SendMyNumber from "./components/SendNumber";
import ChangePasswordForm from "./components/PasswordUpdate";
import { get } from "aws-amplify/api";

const client = generateClient<Schema>();

interface MainContentProps {
  user: any; //User | undefined; // Allow user to be undefined
  signOut: any; //((data?: AuthEventData | undefined) => void) | undefined;
}

function App() {
  return (
    <Authenticator loginMechanisms={["email"]}>
      {({ signOut, user }) => (
        <Router>
          <div>
            {" "}
            Number sent from React <SendMyNumber />{" "}
          </div>
          <div
            style={{
              position: "fixed",
              top: 10,
              left: 400,
              width: "50%",
              zIndex: 999,
              justifyContent: "center",
            }}
          >
            {" "}
            {/* Fix the navigation bar at the top */}
            <nav style={{ width: "560px" }}>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row",
                  listStyleType: "none",
                  padding: 0,
                }}
              >
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/">Main</Link>{" "}
                </li>
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/profile">Profile</Link>{" "}
                </li>
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/about">About</Link>{" "}
                </li>
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/test">Profile Update</Link>{" "}
                </li>
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/delete">Delete</Link>{" "}
                </li>
                <li style={{ margin: "0 1px" }}>
                  {" "}
                  <Link to="/password">Password Update</Link>{" "}
                </li>
              </ul>
            </nav>
          </div>
          <div
            style={{
              paddingTop: "60px",
              paddingLeft: "280px",
              paddingRight: "280px",
              textAlign: "center",
            }}
          >
            {" "}
            {/* Add padding top and sides to the content to avoid overlapping */}
            <Routes>
              {/* Pass user and signOut to MainContent */}
              <Route
                path="/"
                element={<MainContent user={user} signOut={signOut} />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/test" element={<ProfileUpdate />} />
              <Route path="/delete" element={<DeleteAcc />} />
              <Route path="/password" element={<ChangePasswordForm />} />
            </Routes>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

const MainContent = ({ user, signOut }: MainContentProps) => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const printUserEmail = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("Email:", userAttributes.email);
    } catch (e) {
      console.log(e);
    }
  };

async function getItem() {
  try {
    const restOperation = get({
      apiName: 'myRestApi',
      path: 'items'
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (error) {
    if (error.response && error.response.body) {
      console.log('GET call failed: ', JSON.parse(error.response.body));
    } else {
      console.log('GET call failed: ', error);
    }
  }
}


  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      {/* Access user properties conditionally */}
      <h1>{user?.username}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>

      <button onClick={signOut}>Sign out</button>

      {/* Access user properties conditionally */}
      {user && (
        <>
          <h1>Hello {user.username}</h1>
          <button onClick={printUserEmail}>Print Attributes</button>
          <button onClick={getItem}>Get Item</button>
        </>
      )}
    </main>
  );
};

export default App;

