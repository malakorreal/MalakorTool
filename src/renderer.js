const loading = document.getElementById("loading");
const app = document.getElementById("app");
const status = document.getElementById("status");
const serverDown = document.getElementById("server-down");
const SERVER_HEALTH_URL = "https://malakortool-api.onrender.com/health";

async function checkServer() {
  try {
    const res = await fetch(SERVER_HEALTH_URL, { method: "GET" });
    if (!res.ok) throw new Error();
    return true;
  } catch {
    return false;
  }
}

async function init() {
  const ok = await checkServer();
  loading.style.display = "none";
  if (ok) {
    app.classList.remove("hidden");
  } else {
    serverDown.classList.remove("hidden");
  }
}

init();

document.getElementById("on").onclick = async () => {
  status.textContent = "กำลังเปิด Boost...";
  const res = await window.malakor.boostOn();
  status.textContent = res.ok
    ? "✅ เปิด Boost แล้ว"
    : "❌ กรุณา Run as Administrator";
};

document.getElementById("off").onclick = async () => {
  status.textContent = "กำลังคืนค่า...";
  const res = await window.malakor.boostOff();
  status.textContent = res.ok
    ? "♻️ คืนค่าเรียบร้อย"
    : "❌ ไม่สำเร็จ";
};

document.getElementById("close").onclick = () => {
  window.malakor.closeApp();
};

document.getElementById("close-server").onclick = () => {
  window.malakor.closeApp();
};

document.getElementById("retry-server").onclick = async () => {
  serverDown.classList.add("hidden");
  loading.style.display = "flex";
  const ok = await checkServer();
  loading.style.display = "none";
  if (ok) {
    app.classList.remove("hidden");
  } else {
    serverDown.classList.remove("hidden");
  }
};
