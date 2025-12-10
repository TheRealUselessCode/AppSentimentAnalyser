import fs from "fs";

/**
 * Lädt die Rohdaten aus reviews.json, bereinigt die Reviews und gibt sie als JSON-Datei aus.
 */

export function cleanReviews() {
  const raw = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
  const reviews = raw.data || raw;   // Falls Struktur unterschiedlich ist

  const cleaned = reviews.map(r => ({
    id: r.id,
    date: r.date,
    score: r.score,
    text: r.text,
    thumbsUp: r.thumbsUp,
    version: r.version
  }));

  fs.writeFileSync("reviews_clean.json", JSON.stringify(cleaned, null, 2), "utf8");

  console.log("Fertig! reviews_clean.json wurde erstellt.");
}