// FIREBASE CONFIG & IMPORT
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

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const commentsRef = collection(db, "comments");
const commentsBox = document.getElementById("comments");
const btn = document.getElementById("send");
const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("loginGoogle");
const loginGithub = document.getElementById("loginGithub")
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");

let currentUser = null;
const commentForm = document.getElementById("commentForm");
const loginNotice = document.getElementById("loginNotice");

//@
const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, m =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );

function formatMessage(text) {
    return escapeHTML(text).replace(
        /@([^\s]+)/g,
        '<span class="text-indigo-400 font-semibold">@$1</span>'
    );
}



// LOGIN GOOGLE
loginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        currentUser = user;
        loginBtn.style.display = "none";
        loginGithub.style.display = "none";
        nameInput.value = user.displayName;
        nameInput.disabled = true;

        commentForm.classList.remove("hidden");
        messageInput.disabled = false;
        btn.disabled = false;
    } catch (err) {
        console.error(err);
    }
});

// CEK AUTH STATE
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginBtn.style.display = "none";
        loginGithub.style.display = "none";
        loginNotice.style.display = "none";
        nameInput.value = user.displayName;
        nameInput.disabled = true;
        commentForm.classList.remove("hidden");
        logoutBtn.classList.remove("hidden")
        messageInput.disabled = false;
        btn.disabled = false;
    } else {
        currentUser = null;
        loginBtn.style.display = "block";
        loginGithub.style.display = "block";
        loginNotice.style.display = "block";
        commentForm.classList.add("hidden");
        logoutBtn.classList.add("hidden");
        nameInput.value = "";
        nameInput.disabled = true;
        messageInput.disabled = true;
        btn.disabled = true;
    }
});

//send 

btn.addEventListener("click", async () => {
    const message = messageInput.value.trim();
    if (!currentUser || !message) return;

    await addDoc(commentsRef, {
        uid: currentUser.uid,
        name: currentUser.displayName,
        photo: currentUser.photoURL,
        message,
        createdAt: serverTimestamp()
    });

    messageInput.value = "";
});

//logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (err) {
        console.error(err);
    }
});


// REALTIME KOMENTAR
const q = query(commentsRef, orderBy("createdAt", "asc"));

commentsBox.innerHTML = `
    <p class="text-sm text-gray-500 text-center">
      Loading comments..this was faster in my head
    </p>
    `;


onSnapshot(q, (snapshot) => {
    commentsBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const c = doc.data();

        let time = "";
        if (c.createdAt && window.innerWidth >= 1024) {
            const date = c.createdAt.toDate();
            time = date.toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }



        const ADMIN_UID = "ZuxdsiPjLpaxMHwMPKQ5CrYRzyU2";
        const isAdmin = c.uid === ADMIN_UID;

        //admin
        commentsBox.innerHTML += `
          <div class="border border-transparent rounded-lg hover:border-gray-200 dark:hover:border-gray-800 p-4 flex gap-3 bg-white dark:bg-black min-w-0 font-inter">
            <img src="${c.photo}" class="w-10 h-10 rounded-full object-cover">
            <div class="flex-1 max-w-[900px]">

              <div class="flex items-left gap-2">
  <strong>${c.name}</strong>
  ${isAdmin ? '<span class="text-[15px] px-1 py-0 text-indigo-500 font-semibold bg-gray-100 mb-1 dark:bg-gray-900 h-6 rounded-full">Creator</span>' : ""}   
  ${time ? `<span class="text-[13px] py-1 text-gray-500">${time}</span>` : ""}
</div>
              <p class="inline-block text-sm sm:max-w-[100%] lg:max-w-[100%] rounded-lg rounded-tl-none
               px-3 py-2.5 bg-gray-200 dark:bg-gray-800 text-left break-words whitespace-pre-wrap leading-snug">${formatMessage(c.message)}</p>
            </div>
          </div>
        `;;
    });
});

//////////

const root = document.documentElement;
const themeToggles = document.querySelectorAll(".theme-toggle");
const themeIcons = document.querySelectorAll(".theme-icon");

// load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    root.classList.remove("dark");
    themeIcons.forEach(icon => {
        icon.className = "theme-icon fa-solid fa-moon";
    });
}

function toggleTheme() {
    const isDark = root.classList.contains("dark");

    if (isDark) {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
        themeIcons.forEach(icon => {
            icon.className = "theme-icon fa-solid fa-moon";
        });
    } else {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
        themeIcons.forEach(icon => {
            icon.className = "theme-icon fa-solid fa-sun";
        });
    }
}

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileMenuOverlay");

//closemenu **
function closeMenu() {
    if (!mobileMenu || !mobileOverlay) return;

    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileOverlay.classList.add("opacity-0", "pointer-events-none");
    document.body.style.overflow = "";
}

const closeBtn = document.getElementById("closeMobileMenu");

if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
}



//**
if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}

if (menuBtn && mobileMenu && mobileOverlay) {
    menuBtn.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("opacity-0");

        // toggle menu
        mobileMenu.classList.toggle("opacity-0", isOpen);
        mobileMenu.classList.toggle("pointer-events-none", isOpen);

        // toggle overlay
        mobileOverlay.classList.toggle("opacity-0", isOpen);
        mobileOverlay.classList.toggle("pointer-events-none", isOpen);

        // scroll lock
        document.body.style.overflow = isOpen ? "" : "hidden";
    });
}

//**
if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
}
if (mobileMenu) {
    const mobileCard = mobileMenu.querySelector(".w-80");
    if (mobileCard) {
        mobileCard.addEventListener("click", e => {
            e.stopPropagation();
        });
    }
}


// pasang event ke SEMUA tombol
themeToggles.forEach(btn => {
    btn.addEventListener("click", toggleTheme);
});


/////////////////////////////////////



//ping footer
const dotCore = document.getElementById("online-core");
const ping = document.getElementById("online-ping");
const text = document.getElementById("online-text");

function updateOnlineStatus() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const isOnline =
        (hour >= 10 && hour < 21) ||
        (hour === 21 && minute === 0);

    if (isOnline) {
        text.textContent = "Online";
        text.className = "text-sm font-medium text-green-400";

        dotCore.className =
            "relative inline-flex h-3 w-3 rounded-full bg-green-400";
        ping.className =
            "absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping opacity-75";
    } else {
        text.textContent = "Offline";
        text.className = "text-sm font-medium text-gray-500";

        dotCore.className =
            "relative inline-flex h-3 w-3 rounded-full bg-gray-600";
        ping.className = "hidden";
    }
}

updateOnlineStatus();
setInterval(updateOnlineStatus, 30000);



//**
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-10");
                entry.target.classList.add("opacity-100", "translate-y-0");

                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.3
    }
);

reveals.forEach(el => revealObserver.observe(el));
