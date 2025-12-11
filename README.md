# App Sentiment Analyser

Pull Google Play Store reviews for any app, clean them, and analyze sentiment with a local LLM via Ollama.

<img width="1063" height="1160" alt="App UI" src="https://github.com/user-attachments/assets/b93606b2-1e9f-4d9e-b34e-59f07df00a40" />

## Prerequisites

- Install Ollama: https://ollama.com/download
- Install an Ollama model (e.g., `llama3`, `mistral`).

## Installation

1. Clone this repository.
2. Open a terminal in the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The app runs at http://localhost:3000.

## Usage

1. Open the app in your browser at http://localhost:30000.
2. Get the App ID from Google Play:
    - Go to https://play.google.com/store/
    - Search and open the app’s page.
    - Copy the `id=` value from the URL.
      - Example: For Clash Royale, `https://play.google.com/store/apps/details?id=com.supercell.clashroyale` → App ID is `com.supercell.clashroyale`.
3. In the app, paste the App ID into the `Id` field.
4. Click `Scrape Reviews`.
    - Choose language.
    - Choose how many reviews to fetch (use a large number to get all).
    - Wait until you see “Scrape finished.”
5. Click `Clean`.
    - Wait until you see “Cleaning finished.”
6. Configure analysis in the “Analysis” section:
    - Select your installed Ollama model.
    - Choose a chunk size (30 is a good default).
7. Click `Analyze`.
    - Wait until you see “Analyzing finished.” (may take a while).

## Tips

- If analysis is slow, try a smaller chunk size or a faster model.
- Ensure the chosen Ollama model is downloaded before analyzing.
- Re-run `Scrape Reviews` if you change language or want more reviews.

## Troubleshooting

- Can’t open the app: Ensure the server is running (`npm start`) and visit http://localhost:30000.
- Model not found: Run `ollama list` to verify installed models, then install with `ollama pull <model>`.
- Empty results: Confirm the App ID is correct and available in your selected language.

