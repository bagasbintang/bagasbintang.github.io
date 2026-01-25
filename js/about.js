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
    if(!mobileMenu || !mobileOverlay) return;

    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileOverlay.classList.add("opacity-0", "pointer-events-none");
    document.body.style.overflow = "";
}

const closeBtn = document.getElementById("closeMobileMenu");

if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
}

//**
if(mobileMenu) {
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
if(mobileOverlay) {
mobileOverlay.addEventListener("click", closeMenu);
}
if(mobileMenu) {
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
if(backToTop) {
backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
}

window.addEventListener("pageshow", () => {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
});