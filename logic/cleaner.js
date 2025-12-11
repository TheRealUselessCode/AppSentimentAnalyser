import fs from "fs";

/**
 * Loads raw data from reviews.json, cleans the reviews, and outputs them as a JSON file.
 */

export function cleanReviews() {
  const raw = JSON.parse(fs.readFileSync("./data/reviews.json", "utf8"));
  const reviews = raw.data || raw;   // In case the structure differs

  const cleaned = reviews.map(r => ({
    id: r.id,
    date: r.date,
    score: r.score,
    text: r.text,
    thumbsUp: r.thumbsUp,
    version: r.version
  }));

  fs.writeFileSync("./data/reviews_clean.json", JSON.stringify(cleaned, null, 2), "utf8");

  console.log("Done! reviews_clean.json has been created.");
}