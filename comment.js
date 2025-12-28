
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBbBQTF9vKHZW6cx5QCCsswyytPoC5bFKQ",
    authDomain: "bagas-site-comment.firebaseapp.com",
    projectId: "bagas-site-comment",
    storageBucket: "bagas-site-comment.firebasestorage.app",
    messagingSenderId: "183060203238",
    appId: "1:183060203238:web:e6dd527c6e2702353b1d27"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const commentsRef = collection(db, "comments");

  window.addEventListener("DOMContentLoaded", () => {
    const commentsBox = document.getElementById("comments");
    const btn = document.getElementById("send");

    btn.addEventListener("click", async () => {
      const name = document.getElementById("name").value;
      const message = document.getElementById("message").value;

      if (!name || !message) return;

      await addDoc(commentsRef, {
        name,
        message,
        createdAt: serverTimestamp()
      });

      document.getElementById("message").value = "";
    });

    const q = query(commentsRef, orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
      commentsBox.innerHTML = "";

      snapshot.forEach((doc) => {
        const c = doc.data();

        let time = "mengirim...";
        if (c.createdAt) {
          const date = c.createdAt.toDate();
          time = date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }

        commentsBox.innerHTML += `
          <div class="border p-3 rounded">
            <strong>${c.name}</strong>
            <p class="text-sm text-gray-500">${time}</p>
            <p>${c.message}</p>
          </div>
        `;
      });
    });
  });
  