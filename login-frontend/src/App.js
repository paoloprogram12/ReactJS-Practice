import React from "react"; // react library
import Signup from "./Signup"; // import the signup comonent
import Login from "./Login"; // import the login component

function App() {
  return (
    <div>
      <h1>Login / Signup</h1> {/* Page Title */}
      <Signup /> {/* signup form */}
      <Login /> {/* login form */}
    </div>
  );
}

export default App;