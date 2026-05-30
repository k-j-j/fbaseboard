import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

export default function SignupForm({ onGoLogin }) {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
  });

  const [idChecked, setIdChecked] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "userId") {
      setIdChecked(false);
    }
  };

  const validateUserId = () => {
    const regex = /^[a-z0-9_]{4,12}$/;

    if (!regex.test(form.userId)) {
      setMessage(
        "아이디는 4~12자의 영문 소문자, 숫자, _ 만 사용할 수 있습니다."
      );
      setIdChecked(false);
      return;
    }

    setMessage("사용 가능한 아이디 형식입니다.");
    setIdChecked(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!idChecked) {
      return setMessage("아이디 CHECK를 먼저 해주세요.");
    }

    if (!form.name.trim()) {
      return setMessage("이름을 입력하세요.");
    }

    if (form.password.length < 6) {
      return setMessage("비밀번호는 6자 이상이어야 합니다.");
    }

    if (form.password !== form.confirmPassword) {
      return setMessage("비밀번호가 일치하지 않습니다.");
    }

    try {
      console.log("가입 시도 이메일 =", form.email);

      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await set(ref(db, "users/" + result.user.uid), {
        uid: result.user.uid,
        userId: form.userId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        createdAt: Date.now(),
      });

      alert("회원가입이 완료되었습니다.");

setForm({
  userId: "",
  name: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
});

setIdChecked(false);

onGoLogin();
    } catch (error) {
      console.log(error);
      console.log("code =", error.code);
      console.log("message =", error.message);

      setMessage(error.code);
    }
  };

  const onReset = () => {
    setForm({
      userId: "",
      name: "",
      password: "",
      confirmPassword: "",
      phone: "",
      email: "",
    });

    setIdChecked(false);
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1e293b",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "500px",
          background: "#334155",
          padding: "30px",
          color: "white",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>회원가입</h2>

        <label>ID</label>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={onChange}
            style={{ flex: 1 }}
          />

          <button type="button" onClick={validateUserId}>
            CHECK
          </button>
        </div>

        <p style={{ fontSize: "12px" }}>
          *4~12자의 영문 소문자, 숫자, _ 사용 가능
        </p>

        <Field label="Name" name="name" value={form.name} onChange={onChange} />

        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
        />

        <Field
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
        />

        <Field
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={onChange}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
        />

        {message && (
          <p style={{ color: "yellow", marginTop: "15px" }}>{message}</p>
        )}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button type="submit">Submit</button>

          <button type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ marginTop: "15px" }}>
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          height: "35px",
          marginTop: "5px",
        }}
      />
    </div>
  );
}