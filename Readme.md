# HiringBuddy
DEMO link- https://hiringbuddy-1.onrender.com/
A modern, AI-powered recruitment platform built with Next.js, React, and Tailwind CSS. HiringBuddy streamlines candidate management, interview scheduling, and communication, leveraging AI for resume and video analysis.

## Features

- Candidate management dashboard
- Job postings and application tracking
- AI-powered resume and video analysis (Google Gemini)
- Automated interview invitation emails (Gmail + Nodemailer)
- Professional message generation for candidate communication
- Modern UI with Tailwind CSS and Radix UI components

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Generative AI (Gemini)](https://ai.google.dev/)
- [Nodemailer](https://nodemailer.com/) (Gmail SMTP)
- [Zod](https://zod.dev/) (validation)
- [Sonner](https://sonner.emilkowal.ski/) (notifications)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Nehan21-Gaidhani/HiringBuddy
```

### 2. Install Dependencies

This project uses [pnpm](https://pnpm.io/):

```sh
pnpm install
```

Or use npm/yarn if you prefer (update lockfiles accordingly):

```sh
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Google Gemini API Key (for AI resume/video analysis)
GEMINI_API_KEY=your_google_gemini_api_key

# OpenAI API Key (for message generation)
OPENAI_API_KEY=your_openai_api_key

# Email (Gmail SMTP) for sending interview invites
EMAIL_SERVER_USER=your_gmail_address@gmail.com
EMAIL_SERVER_PASSWORD=your_gmail_app_password
EMAIL_FROM_ADDRESS="Your Company Name <your_gmail_address@gmail.com>"
```

> **Note:**  
> - For Gmail, you must use an [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled.
> - Never commit your `.env.local` file to version control.

### 4. Run the Development Server

```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                # Next.js app directory (pages, API routes, etc.)
│   ├── api/            # API endpoints (resume/video analysis, invites, etc.)
│   ├── candidates/     # Candidate management UI
│   ├── communication/  # Candidate communication UI
│   ├── jobs/           # Job postings UI
│   ├── send-invite/    # Interview invite UI
│   └── videoanalysis/  # Video analysis UI
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (PDF utils, etc.)
├── public/             # Static assets (images, videos, resumes)
├── styles/             # Global styles
├── .env.local          # Environment variables (not committed)
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Available Scripts

- `pnpm dev` — Start the development server
- `pnpm build` — Build for production
- `pnpm start` — Start the production server
- `pnpm lint` — Lint the codebase

## API Endpoints

### Analyze Resume

`POST /api/analyze-resume`

- **Body:** `FormData` with `resume` (file), `position` (string)
- **Description:** Analyzes a resume PDF using Google Gemini AI.

### Analyze Video

`POST /api/analyze-video`

- **Body:** JSON with `candidateId`, `videoFilename`
- **Description:** Analyzes a candidate's video using Google Gemini AI.

### Send Single Interview Invite

`POST /api/send-single-invite`

- **Body:** JSON with candidate and interview details
- **Description:** Sends an interview invitation email via Gmail.

### Generate Message

`POST /api/generate-message`

- **Body:** JSON with `candidateName`, `position`, `messageType`, `context`
- **Description:** Generates a professional message using OpenAI GPT-4o.

## Customization

- **UI Theme:** Tailwind CSS and Radix UI are used for styling. Edit `tailwind.config.ts` and `app/globals.css` as needed.
- **Component Aliases:** See [`components.json`](components.json) for import path aliases.

## Deployment

You can deploy this app to [Render](https://render.com/) or any Node.js hosting provider.

1. Push your code to a GitHub repository.
2. Create a new Web Service on Render and connect your repository.
3. Set the following environment variables in the Render dashboard:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `EMAIL_SERVER_USER`
   - `EMAIL_SERVER_PASSWORD`
   - `EMAIL_FROM_ADDRESS`
4. Set the build command to `pnpm install && pnpm build`.
5. Set the start command to `pnpm start`.
6. Deploy your service.

For more details, see [Render's Node.js deployment guide](https://render.com/docs/deploy-node-express-app).

## License

MIT

---

**Made with ❤️ by the HiringBuddy Team**
