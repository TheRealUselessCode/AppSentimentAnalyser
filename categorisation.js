import fs from "fs";
import ollama from "ollama";

/**
 * Analysiert die bereinigten Reviews in reviews_clean.json mithilfe von Ollama und speichert die Analyse in reviews_analysis.json.
 */

export async function analyzeReviews(languageModel = "gemma3", chunkSize = 30) {
    const raw = JSON.parse(fs.readFileSync("reviews_clean.json", "utf8"));
    const reviews = raw.data || raw;

    const results = [];

    for (let i = 0; i < reviews.length; i += chunkSize) {

        console.log(`Processing reviews ${i + 1} to ${Math.min(i + chunkSize, reviews.length)}...`);

        const analysis = await reviewChunk(reviews.slice(i, i + chunkSize), languageModel);

        results.push(analysis);
    }

    const merged = await mergeAllReviews(results, languageModel);
    fs.writeFileSync("reviews_analysis.json", JSON.stringify({ merged }, null, 2));

    console.log("DONE!");
}

async function reviewChunk(reviews, languageModel) {
    console.log(`Analyzing chunk with ${reviews.length} reviews...`);

    const textBlock = reviews
        .map(r => `Stars: ${r.score}\nText: ${r.text}\nThumbs Up: ${r.thumbsUpCount}`)
        .join("\n\n");

    const prompt = `
Analyse the following app reviews and provide insights into common themes, strengths, weaknesses, feature requests, and bugs.
This is only one chunk of reviews, there are many more. The final goal is to provide an overview of what users like and dislike about the app to create a better version.

${textBlock}

Take note of the amount of thumbs ups as this may indicate particularly helpful reviews.

Return structured insights:
1. Most important positive points
2. Biggest criticisms
3. Frequent feature requests
4. Recurring bugs
5. Summary of overall sentiment

Answer in English.
`;

    const response = await ollama.chat({
        model: languageModel,
        messages: [{ role: "user", content: prompt }],
    });

    const text = response.message.content;

    console.log(`Chunk analyzed. ${text}`);
    return text;
}


async function mergeAllReviews(results, languageModel) {
    console.log(`Merging ${results.length} chunk results...`);

    const prompt = `
Summarize the following partial analyses:

The main goal is to provide an overview of what users like and dislike about the app to create a better version.

${results.map((text, i) => `Analyse ${i + 1}:\n${text}`).join("\n\n")}

Return structured insights:
1. Most important positive points
2. Biggest criticisms
3. Frequent feature requests
4. Recurring bugs
5. Summary of overall sentiment

Keep yourself concise and focused but don't leave out important details.

Answer in English.
`;

    const response = await ollama.chat({
        model: languageModel,
        messages: [{ role: "user", content: prompt }],
    });

    return response.message.content;
}
