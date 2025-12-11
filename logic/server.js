import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { cleanReviews } from './cleaner.js';
import { getReviews } from './scraper.js';
import { analyzeReviews } from './categorisation.js';

const app = express();
app.use(cors());
app.use(express.json());
// Serve static frontend from /public
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Preview endpoints for JSON files stored in /data
app.get('/reviews.json', (req, res) => {
    try {
        const data = fs.readFileSync('./data/reviews.json', 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
    } catch (error) {
        res.status(404).json({ error: 'reviews.json not found' });
    }
});

app.get('/reviews_clean.json', (req, res) => {
    try {
        const data = fs.readFileSync('./data/reviews_clean.json', 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
    } catch (error) {
        res.status(404).json({ error: 'reviews_clean.json not found' });
    }
});

app.get('/reviews_analysis.md', (req, res) => {
    try {
        const data = fs.readFileSync('./data/reviews_analysis.md', 'utf8');
        res.setHeader('Content-Type', 'text/markdown');
        res.status(200).send(data);
    } catch (error) {
        res.status(404).json({ error: 'reviews_analysis.md not found' });
    }
});

app.post('/api/scrape-reviews', async (req, res) => {
    const { appId, numberOfReviews, language } = req.body;
    try {
        await getReviews(appId, numberOfReviews, language);
        res.status(200).json({ message: "Reviews scraped successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error scraping reviews." });
    }
});

app.post("/api/clean-reviews", (req, res) => {
    try {
        cleanReviews();
        res.status(200).json({ message: "Reviews cleaned and saved." });
    } catch (error) {
        res.status(500).json({ error: "Error cleaning reviews." });
    }
});

app.post("/api/analyze-reviews", async (req, res) => {
    const { languageModel, chunkSize } = req.body;
    try {
        await analyzeReviews(languageModel, chunkSize);
        res.status(200).json({ message: "Reviews analyzed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error analyzing reviews." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});