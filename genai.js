// netlify/functions/genai.js
import fetch from "node-fetch";

export async function handler(event, context) {
  // Méthode POST attendue
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body || "{}");

  const API_KEY = process.env.GEMINI_SERVER_KEY; // server-side env var (no VITE_ prefix)

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server: API key not configured" })};
  }

  try {
    // Exemple d'appel à l'API Generative AI — adapte l'URL et le corps selon l'API réelle
    const resp = await fetch("https://generativeai.googleapis.com/v1/models/text-bison:generate?key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message })};
  }
}
