/* ================= QUESTION BANK ================= */

const QUESTIONS = {
  fun: [
    { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"] },
    { q: "How many colors are there in a rainbow?", options: ["5", "6", "7", "8"] },
    { q: "Which animal is called the Ship of the Desert?", options: ["Horse", "Camel", "Donkey", "Elephant"] },
    { q: "Which fruit is known as the King of Fruits in India?", options: ["Apple", "Banana", "Mango", "Orange"] },
    { q: "How many days are there in a leap year?", options: ["365", "366", "364", "360"] },
    { q: "Which day comes after Friday?", options: ["Thursday", "Saturday", "Sunday", "Monday"] },
    { q: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"] },
    { q: "Which bird is the national bird of India?", options: ["Sparrow", "Peacock", "Eagle", "Crow"] },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"] },
    { q: "Which month has 28 days?", options: ["February", "All months", "January", "March"] },

    /* extra for medium & hard */
    { q: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"] },
    { q: "How many hours are there in a day?", options: ["12", "18", "24", "48"] },
    { q: "Which country gifted the Statue of Liberty?", options: ["UK", "France", "Germany", "Italy"] },
    { q: "Which instrument has keys, pedals and strings?", options: ["Guitar", "Piano", "Drum", "Violin"] },
    { q: "Which is the tallest animal?", options: ["Elephant", "Giraffe", "Horse", "Camel"] },
    { q: "Which metal is liquid at room temperature?", options: ["Iron", "Mercury", "Copper", "Silver"] },
    { q: "Which shape has 3 sides?", options: ["Square", "Triangle", "Circle", "Rectangle"] },
    { q: "Which festival is known as the Festival of Lights?", options: ["Holi", "Diwali", "Eid", "Christmas"] },
    { q: "Which sport uses a shuttlecock?", options: ["Cricket", "Badminton", "Tennis", "Football"] },
    { q: "How many letters are there in the English alphabet?", options: ["24", "25", "26", "27"] }
  ],

  technical: [
    { q: "Which language runs in the browser?", options: ["Python", "C", "JavaScript", "Java"] },
    { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"] },
    { q: "Which HTML tag is used for JavaScript?", options: ["<js>", "<script>", "<javascript>", "<code>"] },
    { q: "Which keyword declares a variable in JavaScript?", options: ["int", "var", "define", "let"] },
    { q: "Which method converts JSON to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "parse()", "convert()"] },
    { q: "Which symbol is used for comments in JavaScript?", options: ["##", "**", "//", "<!-- -->"] },
    { q: "Which operator checks value & type?", options: ["==", "=", "===", "!="] },
    { q: "Which array method adds items?", options: ["push()", "pop()", "shift()", "slice()"] },
    { q: "Which keyword stops a loop?", options: ["exit", "stop", "break", "end"] },
    { q: "Which data type stores true/false?", options: ["String", "Boolean", "Number", "Object"] },

    /* extra for medium & hard */
    { q: "Which HTTP method updates data?", options: ["GET", "POST", "PUT", "FETCH"] },
    { q: "Which is not a JS framework?", options: ["React", "Angular", "Vue", "Django"] },
    { q: "Which tag is semantic?", options: ["<div>", "<span>", "<section>", "<b>"] },
    { q: "Which keyword creates a class?", options: ["function", "class", "object", "new"] },
    { q: "Which CSS unit is relative?", options: ["px", "cm", "em", "mm"] },
    { q: "Which HTML attribute is unique?", options: ["class", "id", "name", "type"] },
    { q: "Which tag creates a link?", options: ["<a>", "<link>", "<href>", "<url>"] },
    { q: "Which event fires on click?", options: ["hover", "tap", "onclick", "press"] },
    { q: "Which storage is persistent?", options: ["sessionStorage", "localStorage", "cache", "cookie"] },
    { q: "Which keyword declares constant?", options: ["var", "let", "const", "static"] }
  ],

  devops: [
    { q: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Cloud Infrastructure", "Code Delivery", "Continuous Design"] },
    { q: "Which AWS service is object storage?", options: ["EC2", "RDS", "S3", "Lambda"] },
    { q: "Which command lists running containers?", options: ["docker ps", "docker images", "docker run", "docker build"] },
    { q: "Which tool is used for orchestration?", options: ["Docker", "Kubernetes", "Jenkins", "Ansible"] },
    { q: "Which file builds a Docker image?", options: ["docker.yml", "Dockerfile", "image.conf", "container.txt"] },
    { q: "Which AWS service is serverless?", options: ["EC2", "RDS", "Lambda", "EBS"] },
    { q: "Which command initializes Terraform?", options: ["terraform start", "terraform init", "terraform plan", "terraform apply"] },
    { q: "Which CI tool is popular?", options: ["Git", "Docker", "Jenkins", "Linux"] },
    { q: "Which AWS service is NoSQL?", options: ["RDS", "DynamoDB", "S3", "Aurora"] },
    { q: "Which port does HTTP use?", options: ["21", "22", "80", "443"] },

    /* extra for medium & hard */
    { q: "Which Kubernetes unit is the smallest?", options: ["Node", "Pod", "Service", "Cluster"] },
    { q: "Which AWS service monitors logs?", options: ["CloudTrail", "CloudWatch", "Config", "Inspector"] },
    { q: "Which Linux command shows disk usage?", options: ["ls", "df -h", "du", "pwd"] },
    { q: "Which tool manages configuration?", options: ["Docker", "Ansible", "Git", "Nginx"] },
    { q: "Which load balancer is Layer 7?", options: ["ALB", "NLB", "ELB", "CLB"] },
    { q: "Which Linux command shows processes?", options: ["ps", "top", "jobs", "all"] },
    { q: "Which AWS service stores secrets?", options: ["S3", "SSM", "Secrets Manager", "IAM"] },
    { q: "Which Git command commits changes?", options: ["git push", "git commit", "git add", "git merge"] },
    { q: "Which tool builds images?", options: ["Docker", "Kubernetes", "Terraform", "Ansible"] },
    { q: "Which protocol is secure?", options: ["HTTP", "FTP", "HTTPS", "SMTP"] }
  ]
};

/* ================= CONFIG ================= */

const DIFFICULTY_COUNT = {
  easy: 10,
  medium: 15,
  hard: 20
};

/* ================= ELEMENTS ================= */

const categoryBox = document.getElementById("categoryBox");
const difficultyBox = document.getElementById("difficultyBox");
const quizBox = document.getElementById("quizBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

/* ================= STATE ================= */

let selectedCategory = "";
let questions = [];
let index = 0;

/* ================= HELPERS ================= */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ================= CATEGORY ================= */

document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    selectedCategory = btn.dataset.type;
    categoryBox.classList.add("hidden");
    difficultyBox.classList.remove("hidden");
  };
});

/* ================= DIFFICULTY ================= */

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.onclick = () => {
    const level = btn.textContent.toLowerCase();
    const count = DIFFICULTY_COUNT[level];

    questions = shuffle([...QUESTIONS[selectedCategory]]).slice(0, count);
    index = 0;

    difficultyBox.classList.add("hidden");
    quizBox.classList.remove("hidden");

    renderQuestion();
  };
});

/* ================= QUIZ LOGIC ================= */

function renderQuestion() {
  const q = questions[index];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

nextBtn.onclick = () => {
  index++;
  if (index < questions.length) {
    renderQuestion();
  } else {
    quizBox.innerHTML = "<h3>🎉 Quiz Completed</h3>";
  }
};

/* ================= PROGRESS ================= */

function updateProgress() {
  const percent = ((index + 1) / questions.length) * 100;
  progressBar.style.width = percent + "%";
}
