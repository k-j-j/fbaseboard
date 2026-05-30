import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

export default function BoardList() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const snapshot = await get(ref(db, "posts"));

    if (snapshot.exists()) {
      const data = snapshot.val();

      const postArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      postArray.sort((a, b) => b.createdAt - a.createdAt);

      setPosts(postArray);
    } else {
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const formatDate = (time) => {
    return new Date(time).toLocaleString();
  };

  return (
    <div
      style={{
        width: "800px",
        margin: "30px auto",
        padding: "20px",
        background: "#334155",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <h2>게시판</h2>

      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>번호</th>
              <th style={thStyle}>제목</th>
              <th style={thStyle}>작성자</th>
              <th style={thStyle}>작성일</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td style={tdStyle}>{posts.length - index}</td>
                <td style={tdStyle}>{post.title}</td>
                <td style={tdStyle}>
                  {post.writer || post.writerUid}
                </td>
                <td style={tdStyle}>
                  {formatDate(post.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #94a3b8",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  borderBottom: "1px solid #64748b",
  padding: "10px",
};