# ⚡️ Next.js Fullstack Template

Bu loyiha — `Next.js` asosida ishlab chiqilgan to‘liq funksional fullstack template bo‘lib, zamonaviy texnologiyalar bilan ishlab chiqilgan. Maqsad — har bir yangi loyihani tezda boshlash uchun kuchli tayyor asos yaratish.

## 🚀 Texnologiyalar

- **Next.js 14+** – SSR, App Router, SEO tayyor arxitektura
- **MongoDB + Mongoose** – NoSQL ma’lumotlar bazasi va ODM
- **NextAuth.js** – Foydalanuvchi autentifikatsiyasi
- **next-intl** – Ko‘p tilli (i18n) qo‘llab-quvvatlash
- **TypeScript** – Tip xavfsizligi
- **Tailwind CSS** – Tez va moslashuvchan UI ishlab chiqish
- **ESLint + Prettier** – Kod sifati va formatlash

---

## 📦 O‘rnatish

```bash
git clone https://github.com/devusmonjon/nextjs-fullstack-template.git
cd nextjs-fullstack-template
npm install
```

---

## 🛠 .env konfiguratsiyasi

`.env` faylni avtomatik yaratish uchun quyidagi buyruqdan foydalaning:

```bash
npm run init
```

U sizdan quyidagi ma’lumotlarni so‘raydi:

- MongoDB URI
- DB nomi
- NextAuth JWT secret
- NextAuth secret
- Admin ism/email/parol
- NODE_ENV (development/production)

Agar `.env` fayl allaqachon mavjud bo‘lsa va barcha kerakli sozlamalar bo‘lsa, script hech narsa yozmaydi:

```
🚫 .env fayl allaqachon to‘liq init qilingan.
```

---

## 🧱 Loyihaning strukturasi

```bash
.
├── app/                # Next.js app router
├── components/         # UI komponentlar
├── lib/                # Ulanmalar (db, auth, helpers)
├── models/             # Mongoose modellari
├── public/             # Static fayllar
├── styles/             # Tailwind konfiguratsiyasi
├── middleware.ts       # Auth middleware
├── .env                # Muhit sozlamalari
├── init-template.js    # CLI (init)
└── ...
```

---

## 🔐 Autentifikatsiya

NextAuth asosida foydalanuvchi tizimga kirishi va chiqishi qo‘llab-quvvatlanadi. JWT (stateless) autentifikatsiya ishlatilgan. `init` script orqali quyidagi default admin foydalanuvchi yaratiladi:

```env
ADMIN_NAME="Superadmin"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin123"
```

> ⚠️ Parollarni real loyihalarda **hashlangan** holatda saqlash shart!

---

## 🌐 Lokal serverni ishga tushurish

```bash
npm run dev
```

- `localhost:3000` da ochiladi
- Har bir tilga mos URL: `/uz`, `/ru`, `/en`, ... (next-intl)
<!-- - Admin panel (agar mavjud bo‘lsa): `/admin` -->

---

## 🌍 Til (i18n) qo‘llab-quvvatlash

Template `next-intl` yordamida ko‘p tillilikni qo‘llaydi. Har bir til fayllari `/messages/uz.json`, `/messages/ru.json` ko‘rinishida joylashgan.

---

## 🧪 Testlar (kelajakda)

- `Jest` yoki `Vitest` integratsiyasi
- E2E testlar uchun `Playwright` rejalashtirilgan

---

## 📌 Rejalashtirilgan imkoniyatlar (roadmap)

- [ ] Admin dashboard interfeysi
- [ ] Rolga asoslangan kirish (RBAC)
- [ ] Fayl yuklash (upload) qo‘llab-quvvatlash
- [ ] SEO komponentlar to‘plami
- [ ] Payment gateway integratsiyasi
- [ ] REST API + GraphQL endpointlar

---

## 🧑‍💻 Muallif

**Ismingiz** — [Usmonjon Xasanov](https://www.usmonjon.uz)  
Agar sizga template yoqqan bo‘lsa, ⭐ repo'ni berib qo‘ying va foydalanishda bemalol o‘zgartiring.

---

## 📄 Litsenziya

MIT — Istalgan tarzda foydalanish va tarqatish mumkin.
