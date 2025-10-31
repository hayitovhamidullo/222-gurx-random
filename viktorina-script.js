// Talabalar ma'lumotlari
const allStudents = [
  { name: "Abdurasulov Lazizbek", image: "random/laziz.jpg" },
  { name: "Alimardonova Dilorom", image: "random/A_Dilobar_imresizer.jpg" },
  { name: "Bo'ronov Jamshid", image: "random/jamshid.jpg" },
  { name: "Davlatova Kumush", image: "random/kumush.jpg" },
  { name: "Djurayev Elnur", image: "random/elnur.jpg" },
  { name: "Hayitmurodov Asomiddin", image: "random/asomiddin_1.jpg" },
  { name: "Ochildiyev Begali", image: "random/begali.jpg" },
  { name: "Rahmonov Shoxrux", image: "random/shoxrux_1.jpg" },
  { name: "Tatauva Ruqiya", image: "random/ruqiya.jpg" },
  { name: "Tajimurodov Nematullo", image: "random/nematullo.jpg" },
  { name: "Manopova Mohinur", image: "random/mohinur.jpg" },
];

// Toast funksiyasi
function showToast(message, type = "info", title = "", duration = 5000) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const titles = {
    success: title || "Muvaffaqiyat!",
    error: title || "Xatolik!",
    warning: title || "Ogohlantirish!",
    info: title || "Ma'lumot",
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Toast ko'rsatish
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Yopish tugmasi
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    toast.classList.add("hide");
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 400);
  });

  // Avtomatik yopish
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("hide");
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 400);
    }
  }, duration);
}

// Confirm uchun toast
function showConfirmToast(message, onConfirm, onCancel = null) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast warning";

  toast.innerHTML = `
    <div class="toast-icon">❓</div>
    <div class="toast-content">
      <div class="toast-title">Tasdiqlash</div>
      <div class="toast-message">${message}</div>
      <div style="margin-top: 10px; display: flex; gap: 8px;">
        <button class="btn btn-primary btn-small confirm-yes">Ha</button>
        <button class="btn btn-secondary btn-small confirm-no">Yo'q</button>
      </div>
    </div>
    <button class="toast-close">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  const closeToast = () => {
    toast.classList.add("hide");
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 400);
  };

  // Ha tugmasi
  toast.querySelector(".confirm-yes").addEventListener("click", () => {
    closeToast();
    if (onConfirm) onConfirm();
  });

  // Yo'q tugmasi
  toast.querySelector(".confirm-no").addEventListener("click", () => {
    closeToast();
    if (onCancel) onCancel();
  });

  // Yopish tugmasi
  toast.querySelector(".toast-close").addEventListener("click", closeToast);
}

// Global o'zgaruvchilar
let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
let quizState = {
  availableStudents: [...allStudents],
  currentStudent: null,
  usedQuestions: [],
  studentResults: [],
  currentQuestions: [],
  isQuizActive: false,
  repeatMode: "allow",
};

// Sahifa yuklanganda
document.addEventListener("DOMContentLoaded", function () {
  loadQuestions();
  updateQuestionCount();
  resetQuizState();
});

// Tab almashtirish
function showTab(tabName) {
  // Barcha tablarni yashirish
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Barcha tugmalarni noaktiv qilish
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Tanlangan tabni ko'rsatish
  document.getElementById(tabName + "Tab").classList.add("active");

  // Tanlangan tugmani aktiv qilish
  event.target.classList.add("active");

  // Agar viktorina tabiga o'tilsa, holatni yangilash
  if (tabName === "quiz") {
    updateQuizDisplay();
  }
}

// Savol qo'shish
function addQuestion() {
  const questionText = document.getElementById("questionText").value.trim();
  const repeatMode = document.querySelector(
    'input[name="repeatMode"]:checked'
  ).value;

  if (!questionText) {
    showToast("Iltimos, savol matnini kiriting!", "error");
    return;
  }

  const question = {
    id: Date.now(),
    text: questionText,
    repeatMode: repeatMode,
    dateAdded: new Date().toLocaleDateString("uz-UZ"),
  };

  questions.push(question);
  saveQuestions();
  loadQuestions();
  updateQuestionCount();

  // Formani tozalash
  document.getElementById("questionText").value = "";

  showToast("Savol muvaffaqiyatli qo'shildi!", "success");
}

// Savolni tahrirlash
function editQuestion(id) {
  const question = questions.find((q) => q.id === id);
  if (!question) return;

  const newText = prompt("Yangi savol matni:", question.text);
  if (newText && newText.trim()) {
    question.text = newText.trim();
    saveQuestions();
    loadQuestions();
    showToast("Savol tahrirlandi!", "success");
  }
}

// Savolni o'chirish
function deleteQuestion(id) {
  showConfirmToast("Bu savolni o'chirmoqchimisiz?", () => {
    questions = questions.filter((q) => q.id !== id);
    saveQuestions();
    loadQuestions();
    updateQuestionCount();
    showToast("Savol o'chirildi!", "success");
  });
}

// Barcha savollarni o'chirish
function clearAllQuestions() {
  showConfirmToast(
    "Barcha savollarni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi!",
    () => {
      questions = [];
      saveQuestions();
      loadQuestions();
      updateQuestionCount();
      showToast("Barcha savollar o'chirildi!", "success");
    }
  );
}

// Savollarni localStorage ga saqlash
function saveQuestions() {
  localStorage.setItem("quizQuestions", JSON.stringify(questions));
}

// Savollarni yuklash
function loadQuestions() {
  const questionsList = document.getElementById("questionsList");
  questionsList.innerHTML = "";

  if (questions.length === 0) {
    questionsList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Hali savollar qo\'shilmagan</p>';
    return;
  }

  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-item";

    const repeatModeText =
      question.repeatMode === "allow" ? "Takrorlanadi" : "Takrorlanmaydi";
    const repeatModeColor =
      question.repeatMode === "allow" ? "#28a745" : "#dc3545";

    questionDiv.innerHTML = `
            <div class="question-text">
                <strong>${index + 1}.</strong> ${question.text}
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    Rejim: <span style="color: ${repeatModeColor}; font-weight: 600;">${repeatModeText}</span> | 
                    Qo'shilgan: ${question.dateAdded}
                </div>
            </div>
            <div class="question-actions">
                <button onclick="editQuestion(${
                  question.id
                })" class="btn btn-secondary btn-small">✏️ Tahrirlash</button>
                <button onclick="deleteQuestion(${
                  question.id
                })" class="btn btn-danger btn-small">🗑️ O'chirish</button>
            </div>
        `;

    questionsList.appendChild(questionDiv);
  });
}

// Savol sonini yangilash
function updateQuestionCount() {
  document.getElementById("questionCount").textContent = questions.length;
}

// Random talaba tanlash
function selectRandomStudent() {
  if (quizState.availableStudents.length === 0) {
    showToast("Barcha talabalar testdan o'tdi!", "warning");
    return;
  }

  if (questions.length === 0) {
    showToast("Avval savol qo'shing!", "error");
    return;
  }

  // Random talaba tanlash animatsiyasi
  let count = 0;
  const interval = setInterval(() => {
    const randomIndex = Math.floor(
      Math.random() * quizState.availableStudents.length
    );
    const tempStudent = quizState.availableStudents[randomIndex];
    document.getElementById("selectedStudent").textContent = tempStudent.name;
    document.getElementById("studentImage").src = tempStudent.image;
    count++;

    if (count > 20) {
      clearInterval(interval);

      // Yakuniy talaba tanlash
      const finalIndex = Math.floor(
        Math.random() * quizState.availableStudents.length
      );
      quizState.currentStudent = quizState.availableStudents[finalIndex];

      // Talabani ko'rsatish
      document.getElementById("selectedStudent").textContent =
        quizState.currentStudent.name;
      document.getElementById("studentImage").src =
        quizState.currentStudent.image;

      // Talabani ro'yxatdan olib tashlash
      quizState.availableStudents.splice(finalIndex, 1);

      // Quiz holatini yangilash
      quizState.isQuizActive = true;
      resetCurrentStudentQuestions();
      enableQuestionButton();
      updateQuizDisplay();

      showToast(
        `${quizState.currentStudent.name} tanlandi! Endi savol bering.`,
        "success"
      );
    }
  }, 100);
}

// Joriy talaba uchun savollarni resetlash
function resetCurrentStudentQuestions() {
  quizState.currentQuestions = [];
}

// Random savol ko'rsatish
function showRandomQuestion() {
  if (!quizState.currentStudent) {
    showToast("Avval talaba tanlang!", "error");
    return;
  }

  // Mavjud savollarni filtrlash
  let availableQuestions = questions.filter((q) => {
    if (q.repeatMode === "no-repeat") {
      return (
        !quizState.usedQuestions.includes(q.id) &&
        !quizState.currentQuestions.includes(q.id)
      );
    } else {
      return !quizState.currentQuestions.includes(q.id);
    }
  });

  if (availableQuestions.length === 0) {
    showToast("Ushbu talaba uchun boshqa savol qolmadi!", "warning");
    return;
  }

  // Random savol animatsiyasi
  let count = 0;
  const questionDisplay = document.getElementById("currentQuestion");

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    questionDisplay.textContent = availableQuestions[randomIndex].text;
    count++;

    if (count > 30) {
      clearInterval(interval);

      // Yakuniy savol tanlash
      const finalIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions[finalIndex];

      questionDisplay.textContent = selectedQuestion.text;
      quizState.currentQuestion = selectedQuestion;

      // Javob tugmalarini yoqish
      enableAnswerButtons();
      disableQuestionButton();

      // Savolni ishlatilganlar ro'yxatiga qo'shish
      quizState.currentQuestions.push(selectedQuestion.id);
      if (selectedQuestion.repeatMode === "no-repeat") {
        quizState.usedQuestions.push(selectedQuestion.id);
      }

      updateQuizDisplay();
    }
  }, 50);
}

// Javobni belgilash
function markAnswer(isCorrect) {
  if (!quizState.currentQuestion || !quizState.currentStudent) return;

  // Natijani saqlash
  const result = {
    studentName: quizState.currentStudent.name,
    studentImage: quizState.currentStudent.image,
    question: quizState.currentQuestion.text,
    isCorrect: isCorrect,
    timestamp: new Date().toLocaleString("uz-UZ"),
  };

  // Talaba natijasini topish yoki yaratish
  let studentResult = quizState.studentResults.find(
    (s) => s.name === quizState.currentStudent.name
  );
  if (!studentResult) {
    studentResult = {
      name: quizState.currentStudent.name,
      image: quizState.currentStudent.image,
      correctAnswers: 0,
      totalQuestions: 0,
      questions: [],
    };
    quizState.studentResults.push(studentResult);
  }

  // Natijani qo'shish
  studentResult.questions.push(result);
  studentResult.totalQuestions++;
  if (isCorrect) {
    studentResult.correctAnswers++;
  }

  // UI yangilash
  disableAnswerButtons();
  enableQuestionButton();

  // Holatni ko'rsatish
  const resultText = isCorrect ? "To'g'ri javob!" : "Noto'g'ri javob!";
  const type = isCorrect ? "success" : "error";
  showToast(resultText, type, "", 3000);

  quizState.currentQuestion = null;
  updateQuizDisplay();
}

// Viktorinani tugatish
function finishQuiz() {
  if (!quizState.isQuizActive) {
    showToast("Viktorina boshlanmagan!", "error");
    return;
  }

  showConfirmToast("Viktorinani tugatmoqchimisiz?", () => {
    quizState.isQuizActive = false;

    // Natijalarni hisoblash va ko'rsatish
    calculateResults();
    showTab("results");

    showToast("Viktorina tugadi! Natijalar ko'rsatildi.", "success");
  });
}

// Natijalarni hisoblash
function calculateResults() {
  if (quizState.studentResults.length === 0) {
    document.getElementById("resultsDisplay").innerHTML =
      '<p style="text-align: center; padding: 50px;">Hali hech kim test topshirmagan!</p>';
    return;
  }

  // Natijalarni saralash
  const sortedResults = quizState.studentResults
    .filter((student) => student.totalQuestions > 0)
    .sort((a, b) => {
      const scoreA = (a.correctAnswers / a.totalQuestions) * 100;
      const scoreB = (b.correctAnswers / b.totalQuestions) * 100;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.totalQuestions - a.totalQuestions;
    });

  if (sortedResults.length === 0) {
    document.getElementById("resultsDisplay").innerHTML =
      '<p style="text-align: center; padding: 50px;">Hali hech kim test topshirmagan!</p>';
    return;
  }

  // G'olib
  const winner = sortedResults[0];
  const winnerScore = Math.round(
    (winner.correctAnswers / winner.totalQuestions) * 100
  );

  let resultsHTML = `
        <div class="winner-display">
            <h3>🏆 G'OLIB! 🏆</h3>
            <img src="${winner.image}" alt="${winner.name}" class="winner-image">
            <h4>${winner.name}</h4>
            <p style="font-size: 20px; font-weight: 600; margin: 10px 0;">
                ${winner.correctAnswers}/${winner.totalQuestions} to'g'ri javob (${winnerScore}%)
            </p>
        </div>
        
        <div class="leaderboard">
            <h4>🏅 Umummiy natijalar</h4>
    `;

  sortedResults.forEach((student, index) => {
    const score = Math.round(
      (student.correctAnswers / student.totalQuestions) * 100
    );
    const position = index + 1;
    const medal =
      position === 1
        ? "🥇"
        : position === 2
        ? "🥈"
        : position === 3
        ? "🥉"
        : `${position}.`;

    resultsHTML += `
            <div class="rank-item">
                <span class="rank-position">${medal}</span>
                <span class="rank-name">${student.name}</span>
                <span class="rank-score">${student.correctAnswers}/${student.totalQuestions} (${score}%)</span>
            </div>
        `;
  });

  resultsHTML += "</div>";

  document.getElementById("resultsDisplay").innerHTML = resultsHTML;
}

// Yangi viktorina boshlash
function resetQuiz() {
  showConfirmToast(
    "Yangi viktorina boshlamoqchimisiz? Hozirgi natijalar o'chiriladi!",
    () => {
      resetQuizState();
      updateQuizDisplay();
      showTab("quiz");
      showToast("Yangi viktorina uchun tayyor!", "success");
    }
  );
}

// Quiz holatini resetlash
function resetQuizState() {
  quizState = {
    availableStudents: [...allStudents],
    currentStudent: null,
    usedQuestions: [],
    studentResults: [],
    currentQuestions: [],
    isQuizActive: false,
    repeatMode: "allow",
  };

  document.getElementById("selectedStudent").textContent = "Talaba tanlanmagan";
  document.getElementById("studentImage").src = "default.svg";
  document.getElementById("currentQuestion").textContent =
    "Savol ko'rsatiladi...";

  disableQuestionButton();
  disableAnswerButtons();
}

// Quiz ekranini yangilash
function updateQuizDisplay() {
  document.getElementById("remainingStudents").textContent =
    quizState.availableStudents.length;
  document.getElementById("currentStudentQuestions").textContent =
    quizState.currentQuestions.length;

  // Qolgan savollar hisobi
  let remainingQuestions = 0;
  if (quizState.currentStudent) {
    remainingQuestions = questions.filter((q) => {
      if (q.repeatMode === "no-repeat") {
        return (
          !quizState.usedQuestions.includes(q.id) &&
          !quizState.currentQuestions.includes(q.id)
        );
      } else {
        return !quizState.currentQuestions.includes(q.id);
      }
    }).length;
  }

  document.getElementById("remainingQuestions").textContent =
    remainingQuestions;
}

// Tugma holatlarini boshqarish
function enableQuestionButton() {
  document.getElementById("showQuestionBtn").disabled = false;
}

function disableQuestionButton() {
  document.getElementById("showQuestionBtn").disabled = true;
}

function enableAnswerButtons() {
  document.getElementById("correctBtn").disabled = false;
  document.getElementById("incorrectBtn").disabled = false;
}

function disableAnswerButtons() {
  document.getElementById("correctBtn").disabled = true;
  document.getElementById("incorrectBtn").disabled = true;
}
