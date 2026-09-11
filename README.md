<div align="center">
  <h1>🚨 MediBridge</h1>
  <p><b>World-Class Multimodal AI Orchestration for Emergency Response</b></p>
  
  [![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js_14-black?logo=next.js)](https://nextjs.org/)
  [![Powered by Gemini](https://img.shields.io/badge/AI_Engine-Gemini_3.8_Flash-blue?logo=google)](https://deepmind.google/technologies/gemini/)
  [![Firebase](https://img.shields.io/badge/Database-Firebase_Cloud_Firestore-orange?logo=firebase)](https://firebase.google.com/)
  [![UI](https://img.shields.io/badge/UI-Aceternity_%7C_Framer_Motion-purple)](#)
</div>

---

## 👁️ The Vision
In high-stakes emergency situations, paramedics rely on chaotic, unstructured data—frantic radio calls, scribbled notes, and quick scene photos. Hospitals require structured telemetry to allocate trauma bays and resources before the ambulance arrives. 

**MediBridge** is a universal bridging architecture that ingests raw, multimodal field transmissions (Audio, Text, Images), instantly synthesizes the trauma load using advanced AI, and routes actionable intelligence to a live ER Command Center.

## 🚀 Key Features
- **🎙️ Multimodal Ingest:** Native browser Web Speech API for live dictation, combined with image ingestion for comprehensive triage analysis.
- **⚡ AI Triage Engine:** Powered by Google's bleeding-edge **Gemini 3.8 Flash**, processing complex trauma data in milliseconds.
- **🛡️ Deterministic Fallbacks:** Engineered with prompt-injection shielding and fail-safe mock injections to guarantee 100% uptime during live API outages (503s) or rate limits (429s).
- **🌐 MCP Orchestration Matrix:** High-performance, simulated Context Resolution matrix pulling from 40+ simulated global intelligence nodes.
- **📊 Shift Analytics:** Autonomous, LLM-generated post-action reports summarizing ER traffic and resource bottlenecks.

## 💻 Tech Stack
* **Frontend:** Next.js (App Router), React Server Components, TypeScript.
* **Styling & UI:** Tailwind CSS, Framer Motion, Glassmorphism Physics, Radix Primitives.
* **Backend:** Vercel Edge Architecture, Server Actions.
* **Database:** Firebase / Cloud Firestore (Real-time synchronization).

## 🛠️ Local Development
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/saksham-2x7/PTP-AI.git
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up your `.env.local` file with your Gemini and Firebase credentials:
   \`\`\`env
   GEMINI_API_KEY="your_api_key_here"
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   # (Include the rest of your Firebase config keys)
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---
*Built for the PromptWars x Techverse Hackathon.*
