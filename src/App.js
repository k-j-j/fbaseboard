import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && (
        <LoginForm onGoSignup={() => setPage("signup")} />
      )}

      {page === "signup" && (
        <SignupForm onGoLogin={() => setPage("login")} />
      )}
    </>
  );
}

export default App;