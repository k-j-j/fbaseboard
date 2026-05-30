import React, { useEffect, useState } from "react";
import { ref, get, update, remove } from "firebase/database";
import { auth, db } from "../firebase";

export default function BoardList() {
  const [posts, setPosts] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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
    if (!time) return "";
    return new Date(time).toLocaleString();
  };

  const openDetail = (post) => {
    setSelectedPost(post);
    setIsEditing(false);
  };

  const startEdit = () => {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (auth.currentUser.uid !== selectedPost.writerUid) {
      alert("본인 글만 수정할 수 있습니다.");
      return;
    }

    setEditTitle(selectedPost.title);
    setEditContent(selectedPost.content);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    if (!editContent.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    await update(ref(db, "posts/" + selectedPost.id), {
      title: editTitle,
      content: editContent,
      updatedAt: Date.now(),
    });

    alert("수정되었습니다.");

    setIsEditing(false);
    setSelectedPost({
      ...selectedPost,
      title: editTitle,
      content: editContent,
      updatedAt: Date.now(),
    });

    loadPosts();
  };

  const deletePost = async () => {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (auth.currentUser.uid !== selectedPost.writerUid) {
      alert("본인 글만 삭제할 수 있습니다.");
      return;
    }

    const ok = window.confirm("정말 삭제하시겠습니까?");

    if (!ok) return;

    await remove(ref(db, "posts/" + selectedPost.id));

    alert("삭제되었습니다.");

    setSelectedPost(null);
    setIsEditing(false);
    loadPosts();
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
                <td
                  style={{
                    ...tdStyle,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => openDetail(post)}
                >
                  {post.title}
                </td>
                <td style={tdStyle}>{post.writer || post.writerUid}</td>
                <td style={tdStyle}>{formatDate(post.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPost && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#1e293b",
            borderRadius: "10px",
          }}
        >
          {!isEditing ? (
            <>
              <h3>{selectedPost.title}</h3>

              <p>작성자: {selectedPost.writer}</p>
              <p>작성일: {formatDate(selectedPost.createdAt)}</p>

              {selectedPost.updatedAt && (
                <p>수정일: {formatDate(selectedPost.updatedAt)}</p>
              )}

              <hr />

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
              >
                {selectedPost.content}
              </p>

              <button onClick={startEdit}>수정</button>

              <button
                onClick={deletePost}
                style={{
                  marginLeft: "10px",
                }}
              >
                삭제
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  marginLeft: "10px",
                }}
              >
                닫기
              </button>
            </>
          ) : (
            <>
              <h3>게시글 수정</h3>

              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: "100%",
                  height: "35px",
                  marginBottom: "10px",
                }}
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "150px",
                }}
              />

              <button
                onClick={saveEdit}
                style={{
                  marginTop: "10px",
                }}
              >
                저장
              </button>

              <button
                onClick={() => setIsEditing(false)}
                style={{
                  marginLeft: "10px",
                }}
              >
                취소
              </button>
            </>
          )}
        </div>
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