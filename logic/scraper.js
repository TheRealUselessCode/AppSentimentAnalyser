import gplay from "google-play-scraper";
import fs from "fs";

/**
 * Scraped die Reviews einer App aus dem Google Play Store und speichert sie in reviews.json.
 */

export async function getReviews(appId, numberOfReviews, language) {
  const data = await gplay.reviews({
    appId: appId,
    sort: gplay.sort.RATING,
    num: numberOfReviews,
    lang: language,
  });

  // komplette Antwort in eine JSON-Datei schreiben
  fs.writeFileSync(
    "./data/reviews.json",
    JSON.stringify(data, null, 2),   // schön formatiert
    "utf8"
  );

  console.log("Fertig! reviews.json wurde erstellt.");
}
