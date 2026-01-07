/* ---------- QUESTION SETS ---------- */

const QUESTIONS = {
  devops: [
    {
      q: "What does CI/CD stand for?",
      options: [
        "Continuous Integration / Continuous Deployment",
        "Cloud Infrastructure / Cloud Delivery",
        "Code Integration / Code Deployment",
        "Continuous Improvement / Continuous Design"
      ]
    },
    {
      q: "Which AWS service is for object storage?",
      options: ["EC2", "RDS", "S3", "Lambda"]
    }
  ],

  technical: [
    {
      q: "Which language runs in the browser?",
      options: ["Python", "C", "JavaScript", "Java"]
    },
    {
      q: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ]
    }
  ],

  fun: [
    {
      q: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"]
    },
    {
      q: "How many colors are there in a rainbow?",
      options: ["5", "6", "7", "8"]
    }
  ]
};

/* ---------- ELEMENTS ---------- */

const categoryBox = document.getElementById("categoryBox");
const quizBox = document.getElementById("quizBox");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const currentEl = document.getElementById("current");
const totalEl = document.getElementById("total");

/* ---------- STATE ---------- */

let quiz = [];
let index = 0;

/* ---------- START QUIZ ---------- */

document.querySelectorAll("[data-cat]").forEach(btn => {
  btn.onclick = () => {
    quiz = QUESTIONS[btn.dataset.cat];
    index = 0;

    totalEl.textContent = quiz.length;
    categoryBox.classList.add("hidden");
    quizBox.classList.remove("hidden");

    render();
  };
});

/* ---------- RENDER ---------- */

function render() {
  const q = quiz[index];
  questionEl.textContent = q.q;
  currentEl.textContent = index + 1;

  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    optionsEl.appendChild(btn);
  });
}

/* ---------- NEXT ---------- */

nextBtn.onclick = () => {
  index++;

  if (index < quiz.length) {
    render();            // ✅ ALWAYS moves forward
  } else {
    quizBox.innerHTML = "<h3>🎉 Quiz Finished</h3>";
  }
};
