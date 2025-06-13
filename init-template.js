#!/usr/bin/env node
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const envPath = path.join(process.cwd(), ".env");

const requiredKeys = [
  "MONGODB_URI",
  "DB_NAME",
  "NEXTAUTH_JWT_SECRET",
  "NEXTAUTH_SECRET",
  "NODE_ENV",
  "ADMIN_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const questions = [
  {
    key: "MONGODB_URI",
    label: "MongoDB URI",
    default: "mongodb://localhost:27017",
  },
  { key: "DB_NAME", label: "MongoDB DB name", default: "nextjs-fullstack-app" },
  {
    key: "NEXTAUTH_JWT_SECRET",
    label: "NextAuth JWT Secret",
    default: "JWT_SECRET",
  },
  {
    key: "NEXTAUTH_SECRET",
    label: "NextAuth Secret",
    default: "NEXTAUTH_SECRET",
  },
  {
    key: "ADMIN_NAME",
    label: "Enter default admin name",
    default: "Superadmin",
  },
  {
    key: "ADMIN_EMAIL",
    label: "Enter default admin email",
    default: "admin@gmail.com",
  },
  {
    key: "ADMIN_PASSWORD",
    label: "Enter default admin password",
    default: "admin123",
  },
  { key: "NODE_ENV", label: "Node environment", default: "development" },
];

// 1. .env faylni o‘qib, kalitlar borligini tekshirish
function isAlreadyInitialized() {
  if (!fs.existsSync(envPath)) return false;

  const content = fs.readFileSync(envPath, "utf8");
  return requiredKeys.every((key) => new RegExp(`^${key}=`, "m").test(content));
}

// 2. Foydalanuvchidan so‘rash
function promptUser(questions, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let results = [];
  function ask(index) {
    if (index >= questions.length) {
      rl.close();
      callback(results);
      return;
    }

    const { key, label, default: def } = questions[index];
    rl.question(`${label} (${def}): `, (answer) => {
      results.push({ key, value: answer.trim() || def });
      ask(index + 1);
    });
  }

  ask(0);
}

// 3. Yangi qiymatlarni guruhlab yozish
function writeEnvFile(pairs) {
  const grouped = [
    "# DATABASE",
    pairs
      .slice(0, 2)
      .map((kv) => `${kv.key}="${kv.value}"`)
      .join("\n"),
    "\n# AUTH",
    pairs
      .slice(2, 4)
      .map((kv) => `${kv.key}="${kv.value}"`)
      .join("\n"),
    "\n# DEFAULT ADMIN CREDENTAILS",
    pairs
      .slice(4, 7)
      .map((kv) => `${kv.key}="${kv.value}"`)
      .join("\n"),
    "\n# DEBUG",
    pairs
      .slice(7)
      .map((kv) => `${kv.key}="${kv.value}"`)
      .join("\n"),
  ].join("\n");

  fs.appendFileSync(envPath, `\n${grouped}\n`, "utf8");
  console.log(`✅  .env faylga quyidagilar yozildi:\n${grouped}`);
}

// 4. Boshlash
if (isAlreadyInitialized()) {
  console.log("🚫 .env fayl allaqachon to‘liq init qilingan.");
  process.exit(0);
} else {
  console.log("🛠  .env konfiguratsiyasi boshlanmoqda...");
  promptUser(questions, writeEnvFile);
}
