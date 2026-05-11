<div align="center">

# 🧪 TestLab

### AI-Powered Test Management & QA Automation Platform

<img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge" />
<img src="https://img.shields.io/badge/Database-Supabase-336791?style=for-the-badge" />
<img src="https://img.shields.io/badge/AI-Groq-7C3AED?style=for-the-badge" />
<img src="https://img.shields.io/badge/Animations-FramerMotion-000000?style=for-the-badge" />

---

### ⚡ Generate intelligent test cases and test script templates.  
### 🧠 Organize QA workflows.  
### 🔒 Secure AI-powered automation.

</div>

---

# 🌟 What is TestLab?

TestsLab is a modern AI-driven QA platform built to simplify software testing and automate repetitive QA workflows.

Instead of manually writing dozens of repetitive test cases, TestsLab helps teams:

✅ Generate intelligent AI-powered test cases  
✅ Organize projects and features  
✅ Manage automation scripts  
✅ Improve testing consistency  
✅ Speed up QA workflows  
✅ Reduce manual effort  

---

# ❌ The Problem

Traditional software testing is often:

- Slow
- Repetitive
- Difficult to manage
- Hard to scale
- Inconsistent across teams

QA engineers spend hours creating:
- Functional test cases
- Negative scenarios
- Edge cases
- Validation rules
- Automation flows

As projects grow:
- Documentation becomes messy
- Testing standards become inconsistent
- Collaboration becomes difficult

---

# ✅ The Solution

TestsLab combines:

- 🤖 AI-powered testing
- 📁 Project organization
- ⚡ Automation workflows
- 🔒 Secure backend architecture
- 🎨 Modern interactive UI

Into one centralized platform.

---

# 🧠 How TestsLab Works

1️⃣ User creates a project by entering:
- Project name
- Project description

2️⃣ User creates a feature by entering:
- Feature name
- Feature description

3️⃣ User can additionally:
- Enter custom AI instructions
- Upload supporting PDF documents

4️⃣ All project, feature, prompt, and document data is securely stored in the database

5️⃣ The backend sends the relevant data to the Groq AI API

6️⃣ AI generates intelligent test cases based on:
- Project details
- Feature details
- AI instructions
- Uploaded documents

7️⃣ Generated test cases are displayed inside the test cases dashboard

8️⃣ User can select a particular test case

9️⃣ User selects:
- Preferred programming language
- Preferred automation framework/tool

🔟 The selected test case data, language, and framework details are sent to the AI API

⏸️ AI generates an automation-ready test script template for that specific test case

---

# ✨ Features

# 🤖 AI Test Case Generation

Generate:

- Functional test cases
- Edge cases
- Negative scenarios
- Boundary validations
- UI testing flows
- API testing cases

Additionally, users can select a single generated test case and generate an automation test script template for it.

Users can choose their preferred:
- Programming language
- Automation framework/tool

from dropdown selections before generating the script template.

Supported examples:
- Playwright
- Selenium
- Cypress
- Pytest
- Java + TestNG

---

# 📁 Project & Feature Management

Organize:

- Projects
- Features
- Test assets
- QA workflows
- Automation scripts

---

# 🔐 Secure Authentication

Includes:

- JWT authentication
- HTTP-only cookies
- Session expiration
- Protected routes

---

# 🎨 Beautiful UI

Built using:

- React
- Tailwind CSS
- Framer Motion
- Sonner
- Lucide React

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend |
| Javascript | Frontend Logic |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Sonner | Toast Notifications |
| Lucide React | Icons |
| FastAPI | Backend |
| SQLAlchemy | ORM |
| Supabase Postgres | Database |
| Alembic | Data Migration |
| Groq API | AI Generation |

---

# 🏗️ Application Architecture

```text
Frontend (React)
      ↓
FastAPI Backend
      ↓
Authentication Layer
      ↓
Business Logic Layer
      ↓
Supabase Postgre Database
      ↓
Groq AI Integration
```

---

# ⚡ AI Integration using Groq

Testopia uses the Groq API to generate intelligent test cases.

The backend uses Groq Chat Completions API's `create()` method for AI-powered test case and test script template generation.

```bash
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "",
            "content": "",
        }
    ],
    model="",
)
```

The frontend NEVER directly communicates with Groq.

This keeps:
- API keys secure
- Requests protected
- AI usage controlled

---

# 🔑 How Groq API Key Validation Works

Before enabling AI features:

✅ User enters Groq API key  
✅ Backend receives key securely  
✅ Backend sends lightweight validation request  
✅ Groq verifies the key  
✅ Access granted if valid

---

# 🧪 Example Validation Request

The backend performs a secure validation request using the Chat Completions endpoint.:

```bash
https://api.groq.com/openai/v1/chat/completions
```

---

# 🔒 Security Features

# 🛡️ API Key Protection

Groq API keys are:

- Never exposed publicly
- Never stored insecurely
- Processed server-side only

---

# 🍪 Secure Authentication

Authentication uses:

- JWT tokens
- HTTP-only cookies
- Secure session handling

---

# 🚫 SQL Injection Prevention

SQLAlchemy ORM prevents raw SQL injection vulnerabilities.

---

# 🌐 Controlled CORS

```python
allow_origins=["https://www.testslab.in/"]
```

Only trusted frontend origins are allowed.

---

# 📦 Installation

# 1️⃣ Clone Repository

```bash
git clone <repository-url>
```

---

# 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

---

# 3️⃣ Backend Setup

```bash
cd backend

python -m venv venv
```

---

# 4️⃣ Activate Virtual Environment

## Windows

```bash
venv\\Scripts\\activate
```

## Linux / Mac

```bash
source venv/bin/activate
```

---

# 5️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# ⚙️ Environment Variables

# Backend `.env`

```env
SUPABASE_DATABASE_URL=postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ENCRYPT_DECRYPT_KEY=your_fernet_key
groq_verification_url=groq_chat_completion_endpoint
GROQ_BASE_URL=groq_base_url
GROQ-MODEL=your_preferred_model
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET_NAME=your_supabase_bucket_name
ENV=qa
BASE_URL=your_backend_url
```

---

# Frontend `.env`

```env
VITE_API_URL=your_frontend_url
```

---

# ▶️ Running the Application

# Start Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```bash
http://localhost:8000
```

---

# Start Frontend

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

# 👨‍💻 How Users Can Use Testopia

# Step 1 — Login/Register

Create your account securely.

---

# Step 2 — Add Groq API Key

Paste your Groq API key.

---

# Step 3 — Create Project

Organize your testing workflow.

---

# Step 4 — Create Features

Add application features.

---

# Step 5 — Generate AI Test Cases

Describe your feature and generate intelligent testing scenarios instantly.

# Step 6 — Generate AI Test Script template

Select your test cases and the language and tool/framework from the dropdowns to generate automation-ready test script templates instantly.

---

# 🧠 Example Prompt

```text
Generate test cases for login page with:
- email validation
- password validation
- invalid credentials
- remember me functionality
```

---

# ⚡ Example Test Case Output

```text
NestNovaUpdated-IntelliWeave-V1-TC-002: Validate error handling for unintelligible input

Type: Functional - Negative

Preconditions:
- User is logged into the NestNova platform

Steps:
1. Open the IntelliWeave input field
2. Enter the string: "asdfghjkl"
3. Click the Submit button

Expected Result:
The system displays a validation message such as "Unable to determine type, please clarify the input" and does not create any idea, task, or goal entry.
```

# ⚡ Example Test Script Output

```text
import { test, expect } from '@playwright/test';

test.describe('Validate error handling for unintelligible input', () => {
  test.beforeEach(async ({ page }) => {
    // Precondition: User is logged in
    await page.goto('<URL>/login');
    // TODO: Add login steps or reuse authenticated session
  });

  test('Functional - Negative', async ({ page }) => {
    // Navigate to the relevant page
    await page.goto('<URL>/intelliweave');

    // Step: Open the IntelliWeave input field
    await page.click('<LOCATOR_INPUT_FIELD>');

    // Step: Enter the unintelligible string
    await page.fill('<LOCATOR_INPUT_FIELD>', '<TEST_DATA>'); // e.g., "asdfghjkl"

    // Step: Click the Submit button
    await page.click('<LOCATOR_SUBMIT_BUTTON>');

    // Assertion: Validation message is displayed
    const validationMessage = await page.locator('<LOCATOR_VALIDATION_MESSAGE>');
    await expect(validationMessage).toHaveText('Unable to determine type, please clarify the input');

    // Assertion: No new idea/task/goal entry is created
    const entryList = await page.locator('<LOCATOR_ENTRY_LIST>');
    await expect(entryList).toHaveCount(0);
  });
});
```

---

# 📚 API Endpoints

# Authentication

```http
POST /auth/
POST /auth/validate-key
POST /auth/verify-otp
POST /auth/resend-otp
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
POST /auth/token
POST /auth/logout
```

---

# Users

```http
GET  /users/current_user
POST /users/update-password
POST /users/send-change-password-otp
POST /users/update_api_key
PATCH /users/update_profile
```

---

---

# Projects

```http
GET    /projects/
GET    /projects/get_project/{project_id}
GET    /projects/search_project
POST   /projects/create_project
PATCH  /projects/update_project/{project_id}
DELETE /projects/delete_project/{project_id}
```

---

# Features

```http
GET    /projects/{id_of_project}/features/all_features
GET    /projects/{id_of_project}/features/get_features/{feature_id}
GET    /projects/{id_of_project}/features/search_features
POST   /projects/{id_of_project}/features/add_feature
PATCH  /projects/{id_of_project}/features/update_feature/{feature_id}
DELETE /projects/{id_of_project}/features/delete_feature/{feature_id}
```

---

# Documents

```http
GET    /features/{feature_id}/documents/
POST   /features/{feature_id}/documents/upload_documents
DELETE /features/{feature_id}/documents/delete_document/{document_id}
```

---

# Test Case Generation

```http
GET    /features/{feature_id}/test-cases/
GET    /features/{feature_id}/test-cases/get_testcase/{testcase_id}
GET    /features/{feature_id}/test_cases/search_testcases
POST   /features/{feature_id}/test-cases/generate-testcase
DELETE /features/{feature_id}/test_cases/delete_testcase/{testcase_version}
```

---

# Test Script Generation

```http
GET    /test-cases/{testcase_id}/scripts/
GET    /test-cases/{testcase_id}/scripts/get_script/{script_id}
POST   /test-cases/{testcase_id}/scripts/generate_script
DELETE /testcases/{testcase_id}/scripts/delete_script
```

---

# 🚀 Future Enhancements

Planned features:

- ✅ CI/CD integration
- ✅ Multiple AI tools support
- ✅ Pagination
- ✅ Dark mode
- ✅ Improved system design

---

# 🎯 Why Testopia?

Because QA engineers should spend less time writing repetitive test cases and more time building high-quality software.

Testopia helps teams:

⚡ Move faster  
🧠 Test smarter  
🔒 Stay secure  
🚀 Ship confidently  

---

# ❤️ Built With Passion

Designed and developed to modernize software testing workflows using AI-powered automation and elegant user experience.

---

<div align="center">

# ⭐ Testopia

### Intelligent QA Starts Here

</div>