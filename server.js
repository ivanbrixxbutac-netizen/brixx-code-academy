
import express from "express";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Masyadong maraming messages. Subukan ulit pagkalipas ng isang minuto."
  }
});

const html = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b1020">
<meta name="description" content="Learn coding with Brixx Code Academy and ask Brixx AI for programming help.">
<title>Brixx Code Academy + AI</title>
<style>
:root {
  color-scheme: dark;
  --bg:#0b1020; --panel:#121a2d; --panel2:#18243a;
  --text:#edf4ff; --muted:#94a6c4; --blue:#4285ff;
  --line:#283651; --green:#54e0ac;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px system-ui,Arial,sans-serif}
button,textarea{font:inherit}
button{cursor:pointer}
button:focus-visible,textarea:focus-visible{outline:2px solid #65baff;outline-offset:2px}
.layout{min-height:100vh}
.sidebar{background:#0e1628;border-bottom:1px solid var(--line);padding:13px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.brand{font-size:18px;font-weight:850;letter-spacing:-.5px}
.brand span{color:#66a8ff}
.tagline{font-size:9px;letter-spacing:1.5px;color:var(--muted)}
.nav{display:flex;gap:4px}
.nav button{border:0;border-radius:10px;background:transparent;color:var(--muted);padding:10px 8px;font-size:11px}
.nav button.active{background:#20375b;color:#fff}
main{max-width:1000px;margin:auto;padding:20px 14px 36px}
.page{display:none}.page.active{display:block}
.eyebrow{color:#79b5ff;font-size:11px;letter-spacing:1.7px;font-weight:700}
h1{font-size:clamp(27px,6vw,39px);line-height:1.15;letter-spacing:-1px;margin:10px 0}
h2{font-size:21px;margin:10px 0}
p{color:var(--muted);line-height:1.65}
.hero{background:linear-gradient(135deg,#142c50,#15192e 65%,#22204a);border:1px solid #2d4770;border-radius:20px;padding:22px;margin-bottom:18px}
.hero p{max-width:560px}
.btn{border:1px solid var(--line);background:var(--panel2);color:var(--text);padding:10px 13px;border-radius:11px}
.btn.primary{background:var(--blue);border-color:var(--blue);color:white}
.btn:disabled{opacity:.5;cursor:not-allowed}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:17px 0}
.stat,.card{background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:13px;min-width:0}
.stat strong{font-size:21px;display:block}.stat small{color:var(--muted);font-size:10px}
.sectionhead{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:22px 0 10px}
.grid{display:grid;grid-template-columns:1fr;gap:10px}
.lesson{display:flex;align-items:start;gap:12px}
.lesson-icon{width:42px;height:42px;display:grid;place-items:center;flex-shrink:0;background:#203a61;border-radius:12px;font-size:20px}
.lesson h3{font-size:15px;margin:1px 0 4px}.lesson p{font-size:12px;margin:7px 0 10px}
.pill{font-size:10px;padding:4px 8px;border-radius:20px;background:#21354c;color:#a9d2ff}
.progress{height:5px;background:#25344b;border-radius:9px;overflow:hidden;margin:10px 0}
.progress div{height:100%;width:0;background:var(--green);transition:width .2s}
.lesson-body{white-space:pre-wrap;color:#d3deee;line-height:1.75;font-size:14px}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#080f1d;border:1px solid var(--line);border-radius:12px;padding:13px;color:#a5e6ca;font-size:12px}
.quiz{background:var(--panel2);border-radius:12px;padding:14px;margin-top:14px}
.quiz-options{display:grid;gap:8px;margin:12px 0}
.quiz-options button{text-align:left}
.feedback{font-size:13px;min-height:20px}
.chatbox{height:min(56vh,520px);min-height:300px;display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.messages{flex:1;overflow:auto;padding:13px;display:flex;flex-direction:column;gap:12px}
.msg{max-width:95%;padding:11px 13px;border-radius:13px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;font-size:14px}
.msg.ai{align-self:flex-start;background:#202d45}
.msg.user{align-self:flex-end;background:#2059a6;color:white}
.composer{display:flex;gap:8px;padding:10px;border-top:1px solid var(--line)}
.composer textarea{resize:vertical;min-height:44px;max-height:120px;flex:1;min-width:0;background:#0a1221;color:white;border:1px solid var(--line);border-radius:11px;padding:10px}
.composer button{align-self:stretch}
.quick{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}
.quick button{font-size:12px}
.muted{color:var(--muted);font-size:12px}
.hidden{display:none!important}
footer{margin-top:30px;text-align:center;color:var(--muted);font-size:11px}
@media(min-width:720px){
 .layout{display:grid;grid-template-columns:220px minmax(0,1fr)}
 .sidebar{height:100vh;position:sticky;top:0;align-self:start;border:0;border-right:1px solid var(--line);padding:22px 14px;display:block}
 .brand{margin-bottom:4px}
 .nav{display:grid;gap:8px;margin-top:35px}
 .nav button{text-align:left;padding:13px;font-size:14px}
 main{width:100%;padding:34px 26px}
 .grid{grid-template-columns:repeat(2,minmax(0,1fr))}
 .chatbox{height:64vh}
}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div>
    <div class="brand">⚡ BRixx<span> Academy</span></div>
    <div class="tagline">LEARN · BUILD · GROW</div>
  </div>
  <nav class="nav" aria-label="Main navigation">
    <button class="active" data-page="home">⌂ Dashboard</button>
    <button data-page="academy">▣ Academy</button>
    <button data-page="chat">✦ AI Chat</button>
  </nav>
</aside>
<main>
<section id="home" class="page active">
  <div class="hero">
    <div class="eyebrow">YOUR CODING JOURNEY STARTS HERE</div>
    <h1>Learn to code.<br>Build your ideas.</h1>
    <p>Study coding step by step, practice with quizzes, and ask Brixx AI when you need help.</p>
    <button class="btn primary" data-goto="academy">Start learning →</button>
    <button class="btn" data-goto="chat">Ask AI ✦</button>
  </div>
  <div class="stats">
    <div class="stat"><strong id="doneCount">0</strong><small>Lessons done</small></div>
    <div class="stat"><strong id="totalCount">8</strong><small>Available lessons</small></div>
    <div class="stat"><strong id="percentCount">0%</strong><small>Progress</small></div>
  </div>
  <div class="card">
    <div class="sectionhead" style="margin-top:0"><h2>Your progress</h2><span id="progressText" class="muted">0 of 8</span></div>
    <div class="progress"><div id="progressBar"></div></div>
    <p>Ang lesson progress ay naka-save sa browser ng device na ito.</p>
  </div>
  <div class="sectionhead"><h2>Start learning</h2><button class="btn" data-goto="academy">All lessons →</button></div>
  <div id="homeLessons" class="grid"></div>
</section>

<section id="academy" class="page">
  <div class="eyebrow">BRIXX CODE ACADEMY</div>
  <h1>Learn by doing.</h1>
  <p>Pumili ng lesson, basahin ang halimbawa, at sagutin ang quiz para makumpleto ito.</p>
  <div id="lessonList" class="grid"></div>
  <div id="lessonDetail" class="card hidden" style="margin-top:18px">
    <button class="btn" id="backLessons">← All lessons</button>
    <div class="sectionhead"><span class="pill" id="lessonLevel">BEGINNER</span></div>
    <h2 id="lessonTitle"></h2>
    <div id="lessonBody" class="lesson-body"></div>
    <pre id="lessonCode"></pre>
    <div class="quiz">
      <strong id="quizQuestion"></strong>
      <div id="quizOptions" class="quiz-options"></div>
      <div id="quizFeedback" class="feedback" aria-live="polite"></div>
      <button id="completeLesson" class="btn primary hidden">Mark lesson complete ✓</button>
    </div>
  </div>
</section>

<section id="chat" class="page">
  <div class="eyebrow">YOUR CODING ASSISTANT</div>
  <h1>Brixx AI Chat <span style="color:#65aaff">✦</span></h1>
  <p>Magtanong tungkol sa coding, errors, math, o mga lesson. Ang sagot ay manggagaling sa AI API kapag na-configure na ang server.</p>
  <div class="quick">
    <button class="btn" data-prompt="Teach me HTML from zero.">Learn HTML</button>
    <button class="btn" data-prompt="Explain a common JavaScript error and how to fix it.">Fix an error</button>
    <button class="btn" data-prompt="Give me a beginner JavaScript exercise.">Practice coding</button>
  </div>
  <div class="chatbox">
    <div class="messages" id="messages" aria-live="polite">
      <div class="msg ai">Hi! I'm Brixx AI. 👋 Ask me a coding question, or tell me what you're trying to build.</div>
    </div>
    <form class="composer" id="chatForm">
      <textarea id="chatInput" maxlength="4000" placeholder="Ask Brixx AI..." aria-label="Your message" required></textarea>
      <button class="btn primary" id="sendBtn" type="submit">Send ↑</button>
    </form>
  </div>
  <p class="muted">Huwag magpadala ng passwords, private information, o API keys. Hindi naka-save sa server ang chat history ng website na ito.</p>
  <button class="btn" id="clearChat">Clear conversation</button>
</section>
<footer>Brixx Code Academy · Learn something new every day.</footer>
</main>
</div>

<script>
"use strict";

const lessons = [
{title:"HTML Fundamentals",icon:"🌐",body:"HTML gives a webpage its structure. Tags describe headings, paragraphs, links and buttons. Most elements have an opening and closing tag.",code:'<h1>Hello world!</h1>\n<p>My first website.</p>\n<button>Click me</button>',question:"Which tag creates a paragraph?",options:["<p>","<img>","<title>"],answer:0,why:"The p element represents a paragraph."},
{title:"CSS Styling",icon:"🎨",body:"CSS controls how a webpage looks. A rule has a selector and declarations. This example makes headings blue and larger.",code:"h1 {\n  color: blue;\n  font-size: 32px;\n}",question:"Which CSS property changes text color?",options:["font-size","color","margin"],answer:1,why:"The color property sets the text color."},
{title:"JavaScript Variables",icon:"⚡",body:"Variables hold values. Use const when you do not reassign a variable, and let when you need to reassign it.",code:'const name = "Brixx";\nlet score = 10;\nscore = score + 5;\nconsole.log(score); // 15',question:"What is score after these instructions?",options:["10","15","5"],answer:1,why:"The value 10 increases by 5, giving 15."},
{title:"Functions",icon:"🧩",body:"A function groups instructions you can run when needed. Parameters provide inputs and return sends a result back.",code:"function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3)); // 5",question:"What does return do?",options:["Stops the browser","Sends a value back","Changes the page color"],answer:1,why:"return provides the function result to its caller."},
{title:"Conditions",icon:"🔀",body:"if and else let a program choose a path based on a condition. Comparison operators include ===, >, <, >= and <=.",code:'const age = 18;\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Under 18");\n}',question:"Which keyword checks a condition?",options:["if","style","href"],answer:0,why:"if evaluates a condition and runs a block when it is true."},
{title:"Loops",icon:"🔁",body:"Loops repeat instructions. A for loop is useful when you know how many repetitions you need. Make sure its condition eventually becomes false.",code:"for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}\n// 1, 2, 3",question:"How many times does this loop run?",options:["2","3","4"],answer:1,why:"The loop runs with i equal to 1, 2 and 3."},
{title:"Arrays",icon:"📚",body:"An array stores an ordered list of values. JavaScript array indexes start at zero. Use length to read the number of items.",code:'const colors = ["red", "blue", "green"];\nconsole.log(colors[0]); // red\nconsole.log(colors.length); // 3',question:"What is the first array index?",options:["0","1","-1"],answer:0,why:"JavaScript arrays use zero-based indexing."},
{title:"Python Basics",icon:"🐍",body:"Python is a popular programming language. It uses indentation to group statements. print displays output, and variables can hold values without declaring a type first.",code:'name = "Brixx"\nscore = 10 + 5\nprint(name)\nprint(score)',question:"Which function displays output in Python?",options:["echo()","print()","showHTML()"],answer:1,why:"print() writes values to standard output."}
];

let completed = new Set();
try {
  const saved = JSON.parse(localStorage.getItem("brixxCompleted") || "[]");
  if (Array.isArray(saved)) completed = new Set(saved.filter(Number.isInteger));
} catch {}

let selectedLesson = 0;
let quizPassed = false;
let chatHistory = [];
const $ = id => document.getElementById(id);

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll("[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  if (id === "academy") renderLessons();
  if (id === "home") renderHome();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b => b.onclick = () => showPage(b.dataset.page));
document.querySelectorAll("[data-goto]").forEach(b => b.onclick = () => showPage(b.dataset.goto));

function cardHTML(l, i) {
  return '<article class="card lesson">' +
    '<div class="lesson-icon">' + l.icon + '</div>' +
    '<div style="flex:1;min-width:0">' +
    '<span class="pill">' + (completed.has(i) ? "✓ COMPLETED" : "BEGINNER") + '</span>' +
    '<h3>' + l.title + '</h3>' +
    '<p>' + l.body.slice(0,90) + '…</p>' +
    '<button class="btn" data-open="' + i + '">' + (completed.has(i) ? "Review lesson" : "Start lesson") + ' →</button>' +
    '</div></article>';
}
function wireCards(root) {
  root.querySelectorAll("[data-open]").forEach(b => b.onclick = () => openLesson(Number(b.dataset.open)));
}
function renderLessons() {
  $("lessonList").innerHTML = lessons.map(cardHTML).join("");
  wireCards($("lessonList"));
}
function renderHome() {
  const count = completed.size;
  const percent = Math.round(count / lessons.length * 100);
  $("doneCount").textContent = count;
  $("totalCount").textContent = lessons.length;
  $("percentCount").textContent = percent + "%";
  $("progressText").textContent = count + " of " + lessons.length;
  $("progressBar").style.width = percent + "%";
  $("homeLessons").innerHTML = lessons.slice(0,4).map(cardHTML).join("");
  wireCards($("homeLessons"));
}
function openLesson(i) {
  selectedLesson = i;
  quizPassed = false;
  const l = lessons[i];
  $("lessonDetail").classList.remove("hidden");
  $("lessonTitle").textContent = l.title;
  $("lessonLevel").textContent = "BEGINNER";
  $("lessonBody").textContent = l.body;
  $("lessonCode").textContent = l.code;
  $("quizQuestion").textContent = l.question;
  $("quizFeedback").textContent = "";
  $("completeLesson").classList.add("hidden");
  $("quizOptions").replaceChildren();
  l.options.forEach((option, index) => {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = option;
    b.onclick = () => {
      if (quizPassed) return;
      if (index === l.answer) {
        quizPassed = true;
        $("quizFeedback").textContent = "Correct! " + l.why;
        $("quizFeedback").style.color = "#54e0ac";
        $("completeLesson").classList.remove("hidden");
      } else {
        $("quizFeedback").textContent = "Try again. Basahin ulit ang lesson.";
        $("quizFeedback").style.color = "#ffb6a8";
      }
    };
    $("quizOptions").appendChild(b);
  });
  $("lessonDetail").scrollIntoView({behavior:"smooth",block:"start"});
}
$("backLessons").onclick = () => {
  $("lessonDetail").classList.add("hidden");
  $("lessonList").scrollIntoView({behavior:"smooth",block:"start"});
};
$("completeLesson").onclick = () => {
  completed.add(selectedLesson);
  try { localStorage.setItem("brixxCompleted", JSON.stringify(Array.from(completed))); } catch {}
  $("quizFeedback").textContent = "Lesson completed! Progress saved on this browser.";
  $("completeLesson").classList.add("hidden");
  renderLessons();
  renderHome();
};

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "ai");
  div.textContent = text;
  $("messages").appendChild(div);
  $("messages").scrollTop = $("messages").scrollHeight;
}
async function sendChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, "user");
  chatHistory.push({role:"user",content:clean});
  chatHistory = chatHistory.slice(-12);
  $("chatInput").value = "";
  $("sendBtn").disabled = true;
  $("sendBtn").textContent = "...";
  const waiting = document.createElement("div");
  waiting.className = "msg ai";
  waiting.textContent = "Brixx AI is thinking…";
  $("messages").appendChild(waiting);
  try {
    const response = await fetch("/api/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:chatHistory})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Hindi available ang AI ngayon.");
    const reply = typeof data.reply === "string" ? data.reply : "Walang sagot mula sa AI.";
    chatHistory.push({role:"assistant",content:reply});
    addMessage(reply,"ai");
  } catch (err) {
    addMessage("Hindi makakonekta: " + err.message,"ai");
    chatHistory.pop();
  } finally {
    waiting.remove();
    $("sendBtn").disabled = false;
    $("sendBtn").textContent = "Send ↑";
    $("chatInput").focus();
  }
}
$("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  sendChat($("chatInput").value);
});
document.querySelectorAll("[data-prompt]").forEach(b => {
  b.onclick = () => {
    showPage("chat");
    sendChat(b.dataset.prompt);
  };
});
$("clearChat").onclick = () => {
  chatHistory = [];
  $("messages").replaceChildren();
  addMessage("Conversation cleared. Ano ang gusto mong matutunan?","ai");
};
renderLessons();
renderHome();
</script>
</body>
</html>`;

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "Hindi pa naka-set ang OPENAI_API_KEY sa hosting settings."
      });
    }

    const messages = req.body?.messages;

    if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) {
      return res.status(400).json({
        error: "Magpadala ng 1 hanggang 12 messages."
      });
    }

    const cleanMessages = [];
    for (const message of messages) {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        message.content.length < 1 ||
        message.content.length > 4000
      ) {
        return res.status(400).json({
          error: "Invalid ang chat message."
        });
      }
      cleanMessages.push({
        role: message.role,
        content: message.content
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 1
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: [
        "You are Brixx AI, a helpful coding and learning assistant.",
        "Teach beginners step by step in clear language.",
        "Help with HTML, CSS, JavaScript, Python, debugging and mathematics.",
        "Explain code examples and mention when code has not been executed.",
        "Never ask users to share passwords or secret API keys.",
        "Be friendly, accurate and reaso
