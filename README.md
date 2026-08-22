# Express.js Backend Boilerplate

A modular and production-oriented **Express.js backend boilerplate** built with plain JavaScript and CommonJS.

This boilerplate provides a consistent foundation for building REST APIs without repeatedly setting up the same backend architecture, utilities, integrations, and application patterns.

The architecture follows a **Feature-First** approach for business logic and a **Plugin-based** approach for external services.

---

## ✨ Features

- Feature-First architecture
- Modular resource structure
- Wrapper Controller Pattern
- Result Pattern for application results
- Thin / 3-line Controllers
- Plugin Factory architecture
- Centralized response handling
- Requester helper for external HTTP requests
- Environment configuration
- AI provider integrations
- Database abstraction
- Cache abstraction
- Mail provider abstraction
- Object storage abstraction
- File upload abstraction
- Validation abstraction
- Webhook integrations
- Reusable email templates

---

## 🏗️ Architecture

The application is organized into two major areas:

```text
src/
├── config/
├── helpers/
├── plugins/
├── resources/
├── app.js
└── server.js
```

### Core Principles

#### 1. Feature-First

Business logic is grouped by feature rather than by technical layer.

Instead of:

```text
controllers/
services/
models/
routes/
```

the application uses:

```text
resources/
├── users/
├── ai/
└── ...
```

Each resource contains the files required by that feature.

For example:

```text
resources/users/
├── constant.js
├── controller.js
├── function.js
├── routes.js
└── schema.js
```

This keeps related code together and makes features easier to develop, maintain, and remove.

#### 2. Plugin Factory

External infrastructure and third-party integrations are isolated inside `plugins`.

Examples include:

```text
plugins/
├── ai/
├── cache/
├── database/
├── mail/
├── storage/
├── upload/
├── validator/
└── webhook/
```

The application can switch implementations without changing business logic.

For example:

```text
AI
├── Anthropic
├── DeepSeek
└── Gemini
```

and:

```text
Cache
├── Memory
└── Redis
```

#### 3. Wrapper Pattern

Controllers are intentionally kept thin.

The controller is responsible for receiving the Express request, calling the business function, and passing the result through the response boundary.

Business logic should not directly manipulate `res`.

Conceptually:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Function
   ↓
Plugin / Database / External Service
   ↓
Result
   ↓
Wrapper Controller
   ↓
HTTP Response
```

#### 4. Result Pattern

Business functions return application results instead of directly sending HTTP responses.

Conceptually:

```js
return Result.success(data)
```

or:

```js
return Result.error(error)
```

This keeps the business layer independent from Express and makes functions easier to reuse and test.

---

## 📂 Project Structure

```text
src/
│
├── app.js
├── server.js
│
├── config/
│   └── env.js
│
├── helpers/
│   ├── index.js
│   ├── requester.js
│   ├── response.js
│   └── wrapper.js
│
├── plugins/
│   │
│   ├── ai/
│   │   ├── anthropic.js
│   │   ├── deepseek.js
│   │   ├── gemini.js
│   │   └── index.js
│   │
│   ├── cache/
│   │   ├── memory.js
│   │   ├── redis.js
│   │   └── index.js
│   │
│   ├── database/
│   │   ├── connection.js
│   │   ├── knex.js
│   │   ├── sqlite.js
│   │   ├── utils.js
│   │   └── index.js
│   │
│   ├── mail/
│   │   ├── postmark.js
│   │   ├── resend.js
│   │   ├── ses.js
│   │   ├── smtp.js
│   │   ├── templates/
│   │   └── index.js
│   │
│   ├── storage/
│   │   ├── minio.js
│   │   ├── r2.js
│   │   ├── s3.js
│   │   └── index.js
│   │
│   ├── upload/
│   │   ├── multer.js
│   │   └── index.js
│   │
│   ├── validator/
│   │   ├── joi.js
│   │   ├── zod.js
│   │   └── index.js
│   │
│   └── webhook/
│       ├── discord.js
│       ├── mattermost.js
│       ├── slack.js
│       └── index.js
│
└── resources/
    │
    ├── users/
    │   ├── constant.js
    │   ├── controller.js
    │   ├── function.js
    │   ├── routes.js
    │   └── schema.js
    │
    └── ai/
```

---

## 🔄 Request Flow

A typical API request follows this flow:

```text
Client
  │
  ▼
Route
  │
  ▼
Controller
  │
  ▼
Function
  │
  ├──► Validator
  ├──► Database
  ├──► Cache
  ├──► AI
  ├──► Mail
  └──► Storage
  │
  ▼
Result
  │
  ▼
Wrapper Controller
  │
  ▼
HTTP Response
```

The important separation is:

```text
Controller = HTTP boundary
Function   = Business logic
Plugin     = Infrastructure / external integration
Result     = Application result
Wrapper    = Response handling
```

---

# 📦 Resources

A resource represents a business feature.

For example:

```text
resources/users/
```

contains everything related to the Users feature.

### `routes.js`

Defines the API endpoints.

### `controller.js`

Acts as the HTTP entry point and should remain as thin as possible.

### `function.js`

Contains the actual business logic.

This layer should validate business input, call plugins, interact with application infrastructure, transform data, and return `Result` values.

It should **not** access `res`, call `sendResponse`, or directly handle Express responses.

### `schema.js`

Contains request validation schemas.

The boilerplate supports multiple validation implementations through the validator plugin.

### `constant.js`

Contains feature-specific constants such as status values, error codes, types, limits, and other feature configuration values.

---

# 🔌 Plugins

Plugins encapsulate infrastructure and third-party services. Their purpose is to keep business logic independent from implementation details.

## AI

Supported providers include:

- Anthropic
- DeepSeek
- Gemini

```text
plugins/ai/
├── anthropic.js
├── deepseek.js
├── gemini.js
└── index.js
```

## Cache

Supported implementations include:

- Memory
- Redis

```text
plugins/cache/
├── memory.js
├── redis.js
└── index.js
```

## Database

Database support is organized behind a database plugin.

Current implementations include:

- Knex
- SQLite
- Connection utilities

```text
plugins/database/
├── connection.js
├── knex.js
├── sqlite.js
├── utils.js
└── index.js
```

## Mail

Supported providers include:

- SMTP
- Amazon SES
- Resend
- Postmark

```text
plugins/mail/
├── smtp.js
├── ses.js
├── resend.js
├── postmark.js
└── templates/
```

Reusable templates are provided for common authentication flows such as OTP, email verification, and password reset.

## Storage

Supported object storage implementations include:

- Amazon S3
- Cloudflare R2
- MinIO

```text
plugins/storage/
├── s3.js
├── r2.js
├── minio.js
└── index.js
```

## Upload

File upload functionality is isolated in the upload plugin and currently uses Multer.

```text
plugins/upload/
├── multer.js
└── index.js
```

## Validator

Validation is abstracted so different validation libraries can be used.

Current implementations include:

- Joi
- Zod

```text
plugins/validator/
├── joi.js
├── zod.js
└── index.js
```

## Webhook

Webhook integrations are centralized in the webhook plugin.

Supported integrations include:

- Discord
- Mattermost
- Slack

```text
plugins/webhook/
├── discord.js
├── mattermost.js
├── slack.js
└── index.js
```

---

# 🧰 Helpers

Helpers contain application-wide utilities that are not tied to a specific business feature.

```text
helpers/
├── index.js
├── requester.js
├── response.js
└── wrapper.js
```

### Requester

Provides a reusable abstraction for making HTTP requests to external services.

### Response

Centralizes API response formatting.

### Wrapper

Handles the boundary between business results and Express HTTP responses.

---

# ⚙️ Application Entry Points

The application separates the Express application from the server bootstrap.

```text
src/
├── app.js
└── server.js
```

### `app.js`

Responsible for creating and configuring the Express application.

### `server.js`

Responsible for starting the HTTP server.

This separation makes the application easier to test and reuse.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have Node.js installed:

```bash
node --version
```

Clone the repository:

```bash
git clone https://github.com/Gunawan10/express-js-boilerplate.git
```

Move into the project:

```bash
cd express-js-boilerplate
```

Install dependencies:

```bash
npm install
```

Create your environment configuration according to the plugins and integrations you enable, then start the application using the project's configured server command.

> The repository is intended to be used as a reusable template, so only the integrations required by your project need to be configured.

---

# 🔐 Environment Configuration

Environment configuration is centralized in:

```text
src/config/env.js
```

Keep secrets outside the source code.

Typical configuration categories include:

```text
Application
Database
Cache
AI providers
Mail
Storage
Webhooks
```

Example:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=
REDIS_URL=

ANTHROPIC_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

RESEND_API_KEY=
```

Only configure variables required by the integrations used by your application.

---

# 🧩 Creating a New Resource

When adding a new feature, create a new resource directory.

For example:

```text
src/resources/products/
├── constant.js
├── controller.js
├── function.js
├── routes.js
└── schema.js
```

A typical implementation follows:

```text
Route
  ↓
Controller
  ↓
Function
  ↓
Plugin / Database
  ↓
Result
  ↓
Wrapper
```

This keeps every feature self-contained.

---

# 🧠 Design Philosophy

### Keep Controllers Thin

Controllers should not contain business logic.

```text
❌ Controller
   ├── validation
   ├── database query
   ├── business rules
   └── response formatting

✅ Controller
   └── call function → return result
```

### Keep Business Logic Framework-Agnostic

Business functions should not depend directly on Express.

```text
function.js
    ↓
Result
```

rather than:

```text
function.js
    ↓
res.status(...)
res.json(...)
```

### Isolate Infrastructure

External services belong inside plugins.

```text
Business Logic
      │
      ▼
   Plugin
      │
      ▼
External Service
```

This makes integrations replaceable.

### Prefer Composition Over Coupling

Features consume abstractions rather than knowing the implementation details of AI providers, databases, cache systems, mail providers, storage providers, webhooks, or validation libraries.

---

# 📌 Architecture Overview

| Layer | Responsibility |
|---|---|
| `resources` | Business features |
| `routes` | HTTP endpoint definitions |
| `controller` | HTTP boundary |
| `function` | Business logic |
| `schema` | Input validation |
| `constant` | Feature constants |
| `plugins` | External services / infrastructure |
| `helpers` | Shared application utilities |
| `config` | Environment configuration |
| `app.js` | Express application |
| `server.js` | Server bootstrap |

---

# 🗺️ Recommended Development Flow

When implementing a new feature:

```text
1. Define the feature
        ↓
2. Create resource
        ↓
3. Define schema
        ↓
4. Define constants
        ↓
5. Implement business function
        ↓
6. Create controller
        ↓
7. Create routes
        ↓
8. Register routes
        ↓
9. Test the API
```

For external integrations:

```text
Feature
  ↓
Plugin abstraction
  ↓
Provider implementation
```

This keeps the resource independent from the selected provider.

---

# 📖 Example Resource

The repository includes a `users` resource demonstrating the feature structure:

```text
src/resources/users/
├── constant.js
├── controller.js
├── function.js
├── routes.js
└── schema.js
```

Use this as the reference implementation when creating additional resources.

---

# 🎯 Why Use This Boilerplate?

Instead of starting every Express project from scratch and repeatedly deciding where routes, controllers, services, integrations, validation, storage, and infrastructure should live, this boilerplate provides a predefined architecture.

The goal is not to provide every possible feature out of the box, but to provide a **consistent backend foundation that can grow with the application**.

```text
Business Features
        +
Infrastructure Plugins
        +
Shared Helpers
        +
Consistent Result Handling
        =
Reusable Express Backend Foundation
```
