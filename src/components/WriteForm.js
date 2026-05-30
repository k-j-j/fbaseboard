import React, { useState } from "react";
import { ref, push, set, get } from "firebase/database";
import { auth, db } from "../firebase";

export default function WriteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;

      if (!user) {
        return setMessage("로그인이 필요합니다.");
      }

      const userSnapshot = await get(ref(db, "users/" + user.uid));

      if (!userSnapshot.exists()) {
        return setMessage("사용자 정보를 찾을 수 없습니다.");
      }

      const userData = userSnapshot.val();

      const postRef = push(ref(db, "posts"));

      await set(postRef, {
        title,
        content,
        writer: userData.userId,
        writerUid: user.uid,
        createdAt: Date.now(),
      });

      setMessage("게시글 등록 완료");
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error);
      setMessage(error.code);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: "500px",
        margin: "30px auto",
        padding: "20px",
        background: "#334155",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <h2>글쓰기</h2>

      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", height: "35px" }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: "200px" }}
        />
      </div>

      {message && <p style={{ color: "yellow" }}>{message}</p>}

      <button
        type="submit"
        style={{
          marginTop: "15px",
          width: "100%",
          height: "40px",
        }}
      >
        등록
      </button>
    </form>
  );
}