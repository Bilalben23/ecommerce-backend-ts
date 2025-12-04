# 📦 E-Commerce Backend (Express + TypeScript + Vitest)

A modern, modular, and scalable **Express.js** backend built with **TypeScript**.
Fully configured for **ESM**, **Vitest**, and clean architecture.

---

## 🚀 Features

- ⚡ **Express.js** with modular routing
- 🏗️ **TypeScript** using `@tsconfig/node24`
- 🔥 Native **ESM** (`"type": "module"`)
- 🧪 **Vitest** for fast unit testing
- ⚡ **TSX** for instant TypeScript execution
- 🧼 Strict TypeScript configuration
- 📁 Clean, scalable folder structure
- 🛡️ **Zod** for validation
- 🧩 Support for **import/export** in Node Next mode

---

## 📂 Folder Structure

```
project/
├── src/
│   ├── modules/
│   │   └── products/
│   │       ├── product.controller.ts
│   │       ├── product.routes.ts
│   │       └── product.schema.ts
│   ├── server.ts
│   └── app.ts
│
├── tests/
│   └── products/
│       └── product.controller.test.ts
│
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
└── package.json
```

---

## 🛠 Installation

```bash
git clone <repo-url>
cd ecommerce-backend-ts
npm install
```

---

## 🧩 Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development server with TSX |
| `npm run test`       | Run all Vitest tests              |
| `npm run test:watch` | Watch mode for tests              |
| `npm run build`      | Compile TypeScript into `/dist`   |
| `npm start`          | Run compiled build                |

---

## ⚙️ Express Setup

### `app.ts`

```ts
import express from "express";

const app = express();

app.use(express.json());

export default app;
```

### `server.ts`

```ts
import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## ⚙️ Tech Stack

- **Express.js**
- **Node.js (2024+)**
- **TypeScript**
- **Vitest**
- **TSX**
- **Zod**
- **ESM modules**

---

## 📄 Environment Variables

Create `.env`:

```
PORT=3000
DATABASE_URL=
JWT_SECRET=
```

---

## 📌 Project Philosophy

- Clean, maintainable architecture
- Strong TypeScript discipline
- Efficient modular routing
- Test-first mindset
- Minimal dependencies
- Fast development with TSX

---

## 📄 License

MIT License — free to use & modify.

---

## 💬 Author

Built with ❤️ by **Bilal Ben Youssef**, MERN/Full-Stack Engineer.
