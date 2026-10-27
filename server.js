
import express from "express";

const app = express();
app.use(express.json());

const html = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brixx Code Academy</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,sans-serif;background:#0b1020;color:#eef2ff}
header{padding:20px;background:#111a30;border-bottom:1px solid #263451}
.brand{font-size:23px;font-weight:bold;color:#65a9ff}
.brand span{color:white}
.layout{display:flex;min-height:calc(100vh - 70px)}
nav{width:220px;padding:15px;background:#10182b}
nav button{display:block;width:100%;padding:13px;margin-bottom:8px;text-align:left;background:transparent;color:#dce7ff;border:0;border-radius:9px;font-size:15px}
nav button:hover,nav button:focus{background:#223657}
main{padding:22px;flex:1;min-width:0;max-width:1000px}
h1{font-size:28px}
p{color:#b8c5df;line-height:1.6}
.card{background:#141e34;border:1px solid #293956;border-radius:14px;padding:18px;margin:12px 0}
button,.action{cursor:pointer}
.action{background:#367df5;color:white;border:0;border-radius:9px;padding:12px 16px;font-weight:bold}
input,textarea,select{width:100%;padding:12px;border-radius:8px;border:1px solid #344564;background:#080e1c;color:white;margin:8px 0}
textarea{min-height:170px;font-family:monospace}
pre{white-space:pre-wrap;background:#080e1c;padding:14px;border-radius:8px;overflow:auto}
.tag{font-size:12px;color:#80baff}
.lesson{width:100%;text-align:left;color:white;background:#1b2942;border:1px solid #304361;border-radius:10px;padding:14px;margin:5px 0}
#output{background:white;color:black;min-height:100px;padding:12px;border-radius:8px}
footer{color:#7f90ae;font-size:12px;padding:20px}
@media(max-width:650px){
 .layout{display:block}
 nav{width:100%;display:flex;overflow-x:auto;gap:5px;padding:9px}
 nav button{min-width:max-content;width:auto;margin:0}
 main{padding:15px}
 h1{font-size:24px}
}
</style>
</head>
<body>
<header><div class="brand">BRIXX <span>CODE ACADEMY</span></div></header>
<div class="layout">
<nav>
<button onclick="show('home')">⌂ Dashboard</button>
<button onclick="show('lessons')">▤ Lessons</button>
<button onclick="show('editor')">&lt;/&gt; Code Editor</button>
<button onclick="show('quiz')">✓ Quiz</button>
<button onclick="show('progress')">🏆 My Progress</button>
</nav>
<main id="app"></main>
</div>
<footer>BRIXX CODE ACADEMY · Learn coding step by step</footer>
<script>
const lessons=[
{title:"1. Introduction to HTML",desc:"HTML ang ginagamit para buuin ang structure ng isang web page.",code:"<h1>Hello World!</h1>\\n<p>Welcome to my website.</p>",question:"Anong tag ang ginagamit sa pinakamalaking heading?",answers:["<h1>","<p>","<img>"],correct:0},
{title:"2. Introduction to CSS",desc:"CSS ang ginagamit para baguhin ang itsura at kulay ng website.",code:"<h1 style='color:blue'>Blue Heading</h1>",question:"Ano ang ginagamit para sa kulay ng text sa CSS?",answers:["font-size","color","width"],correct:1},
{title:"3. Introduction to JavaScript",desc:"JavaScript ang nagbibigay ng interactivity sa website.",code:"<button onclick='alert(\"Hello!\")'>Click Me</button>",question:"Alin ang programming language na ito?",answers:["HTML","CSS","JavaScript"],correct:2},
{title:"4. HTML Paragraphs",desc:"Gamitin ang p tag para sa paragraph.",code:"<p>This is my first paragraph.</p>",question:"Anong tag ang ginagamit para sa paragraph?",answers:["<p>","<h1>","<button>"],correct:0},
{title:"5. HTML Links",desc:"Gamitin ang a tag para gumawa ng link.",code:"<a href='https://example.com'>Visit website</a>",question:"Anong attribute ang nagsasabi ng destination ng link?",answers:["src","href","color"],correct:1},
{title:"6. HTML Images",desc:"Gamitin ang img tag para magpakita ng image.",code:"<img src='https://placehold.co/200x100' alt='Sample image'>",question:"Anong attribute ang ginagamit para sa image source?",answers:["href","src","style"],correct:1},
{title:"7. CSS Background",desc:"Puwede mong baguhin ang background gamit ang CSS.",code:"<div style='background:#367df5;color:white;padding:20px'>Brixx Academy</div>",question:"Anong CSS property ang para sa background color?",answers:["background-color","text","href"],correct:0},
{title:"8. Buttons",desc:"Ang button element ay para sa clickable na button.",code:"<button onclick='alert(\"Welcome!\")'>Press Here</button>",question:"Anong HTML element ang button?",answers:["<a>","<button>","<img>"],correct:1}
];
let completed=JSON.parse(localStorage.getItem("brixxCompleted")||"[]");
let quizIndex=0;
let quizScore=0;
function save(){localStorage.setItem("brixxCompleted",JSON.stringify(completed))}
function show(page){
const app=document.getElementById("app");
if(page==="home"){
app.innerHTML=`<div class="tag">WELCOME TO YOUR CODING JOURNEY</div><h1>Learn to Code.</h1><p>Matuto ng web development sa sarili mong bilis. Walang AI at walang kailangang API key.</p><div class="card"><h3>📚 Coding Lessons</h3><p>Beginner-friendly na HTML, CSS at JavaScript.</p><button class="action" onclick="show('lessons')">Start Learning</button></div><div class="card"><h3>&lt;/&gt; Code Editor</h3><p>Sumulat ng code at tingnan ang resulta.</p><button class="action" onclick="show('editor')">Open Editor</button></div><div class="card"><h3>🏆 Your Progress</h3><h2>${completed.length} / ${lessons.length}</h2><p>Lessons completed</p></div>`;
}else if(page==="lessons"){
app.innerHTML=`<h1>Coding Lessons</h1><p>Pumili ng lesson para matuto.</p>`+lessons.map((l,i)=>`<button class="lesson" onclick="lesson(${i})">${completed.includes(i)?"✅":"📘"} ${l.title}</button>`).join("");
}else if(page==="editor"){
app.innerHTML=`<h1>Code Editor</h1><p>HTML editor: magsulat ng code at pindutin ang Run Code.</p><textarea id="code" spellcheck="false"><h1>Hello, Brixx!</h1>
<p>My first website.</p>
<button onclick="alert('Hello!')">Click Me</button></textarea><button class="action" onclick="runCode()">▶ Run Code</button><h3>Output</h3><iframe id="output" title="Code output" sandbox="allow-scripts" style="width:100%;border:0"></iframe><p>Tip: Subukan ang &lt;h1&gt;, &lt;p&gt;, &lt;button&gt;, at CSS styles.</p>`;
}else if(page==="quiz"){
quizIndex=0;quizScore=0;showQuestion();
}else if(page==="progress"){
app.innerHTML=`<h1>My Progress</h1><div class="card"><h2>${completed.length} / ${lessons.length}</h2><p>Lessons completed</p><div style="background:#293956;height:12px;border-radius:10px"><div style="height:12px;border-radius:10px;background:#367df5;width:${completed.length/lessons.length*100}%"></div></div></div><button class="action" onclick="show('lessons')">Continue Learning</button>`;
}
}
function lesson(i){
let l=lessons[i];
document.getElementById("app").innerHTML=`<button class="action" onclick="show('lessons')">← Back to Lessons</button><h1>${l.title}</h1><div class="card"><p>${l.desc}</p><h3>Example code</h3><pre></pre><button class="action" onclick="openExample(${i})">Try in Editor</button></div><button class="action" onclick="markDone(${i})">${completed.includes(i)?"Completed ✓":"Mark Lesson Complete"}</button>`;
document.querySelector("pre").textContent=l.code;
}
function openExample(i){show('editor');document.getElementById("code").value=lessons[i].code}
function markDone(i){if(!completed.includes(i)){completed.push(i);save()}lesson(i)}
function runCode(){
let code=document.getElementById("code").value;
document.getElementById("output").srcdoc=code;
}
function showQuestion(){
const app=document.getElementById("app");
if(quizIndex>=lessons.length){
app.innerHTML=`<h1>Quiz Finished!</h1><div class="card"><h2>Your score: ${quizScore} / ${lessons.length}</h2><button class="action" onclick="show('quiz')">Try Again</button></div>`;
return;
}
let l=lessons[quizIndex];
app.innerHTML=`<div class="tag">QUESTION ${quizIndex+1} OF ${lessons.length}</div><h1>Knowledge Quiz</h1><div class="card"><h3>${l.question}</h3>${l.answers.map((a,i)=>`<button class="lesson" onclick="answer(${i})">${a.replaceAll("<","&lt;").replaceAll(">","&gt;")}</button>`).join("")}</div>`;
}
function answer(i){
if(i===lessons[quizIndex].correct)quizScore++;
quizIndex++;showQuestion();
}
show('home');
</script>
</body>
</html>`;

app.get("/", (req, res) => res.type("html").send(html));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use((req, res) => res.status(404).send("Page not found."));
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Brixx Academy is running on port " + port));
  
