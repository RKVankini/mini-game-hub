// /* ---------------- QUESTION SETS ---------------- */

// const devopsQuestions = [
//   {
//     q: "What does CI/CD stand for?",
//     options: [
//       "Continuous Integration / Continuous Deployment",
//       "Cloud Infrastructure / Cloud Delivery",
//       "Code Integration / Code Deployment",
//       "Continuous Improvement / Continuous Design"
//     ],
//     answer: 0
//   },
//   {
//     q: "Which AWS service is used for object storage?",
//     options: ["EC2", "RDS", "S3", "Lambda"],
//     answer: 2
//   }
// ];

// const technicalQuestions = [
//   {
//     q: "Which language runs in the browser?",
//     options: ["Python", "C", "JavaScript", "Java"],
//     answer: 2
//   },
//   {
//     q: "What does CSS stand for?",
//     options: [
//       "Computer Style Sheets",
//       "Creative Style System",
//       "Cascading Style Sheets",
//       "Colorful Style Sheets"
//     ],
//     answer: 2
//   }
// ];

// const funQuestions = [
//   {
//     q: "Which planet is known as the Red Planet?",
//     options: ["Earth", "Mars", "Jupiter", "Venus"],
//     answer: 1
//   },
//   {
//     q: "How many colors are there in a rainbow?",
//     options: ["5", "6", "7", "8"],
//     answer: 2
//   }
// ];

// /* ---------------- ELEMENTS ---------------- */

// const categoryBox = document.getElementById("categoryBox");
// const difficultyBox = document.getElementById("difficultyBox");
// const quizBox = document.getElementById("quiz-box");
// const resultBox = document.getElementById("result");

// const questionEl = document.getElementById("question");
// const optionsEl = document.getElementById("options");
// const timeEl = document.getElementById("time");
// const scoreEl = document.getElementById("score");
// const nextBtn = document.getElementById("nextBtn");
// const finalScoreEl = document.getElementById("finalScore");
// const restartBtn = document.getElementById("restartQuiz");
// const progressBar = document.getElementById("progressBar");

// /* ---------------- STATE ---------------- */

// let questions = [];
// let index = 0;
// let score = 0;
// let time = 10;
// let timer = null;
// let timeLimit = 10;

// /* ---------------- CATEGORY ---------------- */

// document.querySelectorAll(".category").forEach(btn => {
//   btn.onclick = () => {
//     const type = btn.dataset.type;
//     if (type === "devops") questions = devopsQuestions;
//     if (type === "technical") questions = technicalQuestions;
//     if (type === "fun") questions = funQuestions;

//     categoryBox.classList.add("hidden");
//     difficultyBox.classList.remove("hidden");
//   };
// });

// /* ---------------- DIFFICULTY ---------------- */

// document.querySelectorAll(".difficulty").forEach(btn => {
//   btn.onclick = () => {
//     timeLimit = Number(btn.dataset.time);
//     difficultyBox.classList.add("hidden");
//     startQuiz();
//   };
// });

// /* ---------------- QUIZ START ---------------- */

// function startQuiz() {
//   quizBox.classList.remove("hidden");
//   index = 0;
//   score = 0;
//   scoreEl.textContent = score;
//   updateProgress();
//   loadQuestion();
// }

// /* ---------------- TIMER ---------------- */

// function startTimer() {
//   clearInterval(timer);
//   time = timeLimit;
//   timeEl.textContent = time;

//   timer = setInterval(() => {
//     time--;
//     timeEl.textContent = time;
//     if (time === 0) {
//       clearInterval(timer);
//       nextBtn.disabled = false;
//     }
//   }, 1000);
// }

// /* ---------------- LOGIC ---------------- */

// function loadQuestion() {
//   nextBtn.disabled = true;
//   optionsEl.innerHTML = "";

//   const q = questions[index];
//   questionEl.textContent = q.q;

//   q.options.forEach((opt, i) => {
//     const btn = document.createElement("button");
//     btn.className = "option";
//     btn.textContent = opt;
//     btn.onclick = () => checkAnswer(btn, i);
//     optionsEl.appendChild(btn);
//   });

//   updateProgress();
//   startTimer();
// }

// function checkAnswer(button, selected) {
//   clearInterval(timer);
//   const correct = questions[index].answer;

//   document.querySelectorAll(".option").forEach((btn, i) => {
//     btn.disabled = true;
//     if (i === correct) btn.classList.add("correct");
//     if (i === selected && i !== correct) btn.classList.add("wrong");
//   });

//   if (selected === correct) {
//     score++;
//     scoreEl.textContent = score;
//   }

//   nextBtn.disabled = false;
// }

// nextBtn.onclick = () => {
//   index++;
//   if (index < questions.length) loadQuestion();
//   else showResult();
// };

// /* ---------------- PROGRESS ---------------- */

// function updateProgress() {
//   const percent = ((index) / questions.length) * 100;
//   progressBar.style.width = `${percent}%`;
// }

// /* ---------------- RESULT ---------------- */

// function showResult() {
//   quizBox.classList.add("hidden");
//   resultBox.classList.remove("hidden");
//   finalScoreEl.textContent = `${score} / ${questions.length}`;
// }

// /* ---------------- RESET ---------------- */

// restartBtn.onclick = () => {
//   resultBox.classList.add("hidden");
//   categoryBox.classList.remove("hidden");
// };
const sets={
  fun:[{q:"Red planet?",o:["Mars","Earth"],a:0,e:"Mars looks red"}],
  tech:[{q:"JS runs in?",o:["Browser","CPU"],a:0,e:"JS runs in browser"}],
  devops:[{q:"CI/CD?",o:["Automation","Manual"],a:0,e:"CI/CD automates deploy"}]
};

const catBox=document.getElementById("category");
const quiz=document.getElementById("quiz");
const q=document.getElementById("q");
const opts=document.getElementById("opts");
const exp=document.getElementById("exp");
const bar=document.getElementById("bar");
const next=document.getElementById("next");

let qs=[],i=0;

document.querySelectorAll("[data-cat]").forEach(b=>{
  b.onclick=()=>{
    qs=[...sets[b.dataset.cat]].sort(()=>Math.random()-0.5);
    catBox.classList.add("hidden");
    quiz.classList.remove("hidden");
    load();
  };
});

function load(){
  bar.style.width=`${(i/qs.length)*100}%`;
  const c=qs[i];
  q.textContent=c.q;
  opts.innerHTML="";
  exp.textContent="";
  c.o.forEach((t,j)=>{
    const b=document.createElement("button");
    b.textContent=t;
    b.onclick=()=>{
      exp.textContent=c.e;
      next.disabled=false;
    };
    opts.appendChild(b);
  });
  next.disabled=true;
}

next.onclick=()=>{
  i++;
  if(i<qs.length) load();
};
