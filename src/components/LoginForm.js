import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../firebase";
import WriteForm from "./WriteForm";
import BoardList from "./BoardList";

export default function LoginForm({ onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, setLoginUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoginUser(currentUser);

        const snapshot = await get(ref(db, "users/" + currentUser.uid));

        if (snapshot.exists()) {
          const user = snapshot.val();
          setUserId(user.userId);
        }
      } else {
        setLoginUser(null);
        setUserId("");
      }
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setMessage("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        setMessage("이메일 또는 비밀번호가 틀렸습니다.");
      } else {
        setMessage(error.code);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage(error.code);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      return setMessage("이메일을 먼저 입력하세요.");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("비밀번호 재설정 메일을 보냈습니다.");
    } catch (error) {
      console.log(error);
      setMessage(error.code);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1e293b",
        color: "white",
      }}
    >
      <header
        style={{
          background: "#334155",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>React Firebase Board</h2>

        {loginUser ? (
          <button onClick={logout}>로그아웃</button>
        ) : (
          <span>로그인 필요</span>
        )}
      </header>

      <main
        style={{
          padding: "20px",
        }}
      >
        {loginUser ? (
          <div>
            <div
              style={{
                width: "800px",
                margin: "30px auto",
                background: "#334155",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h2>{userId}님 환영합니다.</h2>
            </div>

            <WriteForm />
            <BoardList />
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{
              width: "400px",
              background: "#334155",
              padding: "30px",
              borderRadius: "10px",
              margin: "100px auto",
            }}
          >
            <h2 style={{ textAlign: "center" }}>로그인</h2>

            <div style={{ marginTop: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                }}
              />
            </div>

            {message && (
              <p style={{ color: "yellow", marginTop: "15px" }}>{message}</p>
            )}

            <button
              type="submit"
              style={{
                marginTop: "20px",
                width: "100%",
                height: "40px",
              }}
            >
              로그인
            </button>

            <button
              type="button"
              onClick={resetPassword}
              style={{
                marginTop: "10px",
                width: "100%",
                height: "40px",
              }}
            >
              비밀번호 찾기
            </button>

            <button
              type="button"
              onClick={onGoSignup}
              style={{
                marginTop: "10px",
                width: "100%",
                height: "40px",
              }}
            >
              회원가입
            </button>
          </form>
        )}
      </main>
    </div>
  );
}