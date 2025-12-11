import gplay from "google-play-scraper";
import fs from "fs";

/**
 * Scrapes app reviews from the Google Play Store and saves them to reviews.json.
 */

export async function getReviews(appId, numberOfReviews, language) {
  const data = await gplay.reviews({
    appId: appId,
    sort: gplay.sort.RATING,
    num: numberOfReviews,
    lang: language,
  });

  // Write the full response to a JSON file
  fs.writeFileSync(
    "./data/reviews.json",
    JSON.stringify(data, null, 2),   // nicely formatted
    "utf8"
  );

  console.log("Done! reviews.json has been created.");
}
