const allStudents = [
  { name: "Abdurasulov Lazizbek", image: "./random/laziz.jpg" },
  { name: "Alimardonova Dilorom", image: "./random/A_Dilobar_imresizer.jpg" },
  { name: "Bo'ronov Jamshid", image: "./random/jamshid.jpg" },
  { name: "Davlatova Kumush", image: "./random/kumush.jpg" },
  { name: "Djurayev Elnur", image: "./random/elnur.jpg" },
  { name: "Hayitmurodov Asomiddin", image: "./random/asomiddin_1.jpg" },
  { name: "Ochildiyev Begali", image: "./random/begali.jpg" },
  { name: "Rahmonov Shoxrux", image: "./random/shoxrux_1.jpg" },
  { name: "Tatauva Ruqiya", image: "./random/ruqiya.jpg" },
  { name: "Tajimurodov Nematullo", image: "./random/nematullo.jpg" },
  { name: "Manopova Mohinur", image: "./random/mohinur_1.jpg" },
  { name: "Hayitov Hamidullo", image: "./random/hamidullo.png" },
  { name: "O'roqov Behruz", image: "./random/Behruz_imresizer.jpg" },
  { name: "Raxmatova Sabrina", image: "./random/Sabrina_imresizer.jpg" },
  { name: "Xolboyev Nodirbek", image: "./random/nodirbek.jpg" },
];

let availableStudents = [...allStudents];
let selectedStudents = [];
let studentGrades = JSON.parse(localStorage.getItem("studentGrades")) || [];

let intervalId;
let currentSelectedStudent = null;

function startRandom() {
  if (availableStudents.length === 0) {
    availableStudents = [...allStudents];
    selectedStudents = [];
    alert("Barcha talabalar chiqib ketdi! Ro'yxat qayta boshlandi.");
  }

  if (availableStudents.length === 0) {
    alert("Talabalar ro'yxati bo'sh!");
    return;
  }

  let count = 0;
  clearInterval(intervalId);

  intervalId = setInterval(() => {
    const index = Math.floor(Math.random() * availableStudents.length);
    document.getElementById("selectedStudent").innerText =
      availableStudents[index].name;
    document.getElementById("studentImage").src =
      availableStudents[index].image;
    count++;

    if (count > 30) {
      clearInterval(intervalId);

      const selectedStudent = availableStudents[index];
      currentSelectedStudent = selectedStudent;

      selectedStudents.push(selectedStudent);

      availableStudents.splice(index, 1);

      setTimeout(() => {
        showGradingSection();
      }, 500);
    }
  }, 100); 
}

function resetList() {
  availableStudents = [...allStudents];
  selectedStudents = [];
  currentSelectedStudent = null;
  document.getElementById("selectedStudent").innerText = "Ism Familiya";
  document.getElementById("studentImage").src = "default.png";
  hideGradingSection();
  alert("Ro'yxat qayta boshlandi!");
}

function showGradingSection() {
  document.getElementById("gradingSection").style.display = "block";
}

function hideGradingSection() {
  document.getElementById("gradingSection").style.display = "none";
}

function giveGrade(grade) {
  if (!currentSelectedStudent) {
    alert("Avval talaba tanlang!");
    return;
  }

  const gradeData = {
    name: currentSelectedStudent.name,
    grade: grade,
    date: new Date().toLocaleDateString("uz-UZ"),
    time: new Date().toLocaleTimeString("uz-UZ"),
  };

  studentGrades.push(gradeData);
  localStorage.setItem("studentGrades", JSON.stringify(studentGrades));

  hideGradingSection();

  const remainingCount = availableStudents.length;
  if (remainingCount > 0) {
    alert(
      `${currentSelectedStudent.name} ga ${grade} baho berildi!\nQolgan talabalar: ${remainingCount}`
    );
  } else {
    alert(
      `${currentSelectedStudent.name} ga ${grade} baho berildi!\nBarcha talabalar chiqib ketdi.`
    );
  }

  currentSelectedStudent = null;
}

function showAllGrades() {
  if (studentGrades.length === 0) {
    alert("Hali hech qanday baho berilmagan!");
    return;
  }

  const gradeStats = {};
  let totalGrades = 0;
  let gradeSum = 0;

  studentGrades.forEach((grade) => {
    if (!gradeStats[grade.grade]) {
      gradeStats[grade.grade] = 0;
    }
    gradeStats[grade.grade]++;
    totalGrades++;
    gradeSum += grade.grade;
  });

  const averageGrade = (gradeSum / totalGrades).toFixed(2);

  let statsText = `📊 NATIJALAR STATISTIKASI:\n\n`;
  statsText += `Jami baholar: ${totalGrades}\n`;
  statsText += `O'rtacha baho: ${averageGrade}\n\n`;

  statsText += `Baholar bo'yicha taqsimot:\n`;
  for (let i = 5; i >= 2; i--) {
    const count = gradeStats[i] || 0;
    const percentage =
      totalGrades > 0 ? ((count / totalGrades) * 100).toFixed(1) : 0;
    statsText += `${i} baho: ${count} ta (${percentage}%)\n`;
  }

  statsText += `\n📝 BATAFSIL NATIJALAR:\n\n`;
  studentGrades.forEach((grade, index) => {
    statsText += `${index + 1}. ${grade.name} - ${grade.grade} baho\n`;
    statsText += `   Sana: ${grade.date} ${grade.time}\n\n`;
  });

  alert(statsText);
}

// Baholarni tozalash
function clearAllGrades() {
  if (confirm("Barcha baholarni o'chirmoqchimisiz?")) {
    studentGrades = [];
    localStorage.removeItem("studentGrades");
    alert("Barcha baholar o'chirildi!");
  }
}
