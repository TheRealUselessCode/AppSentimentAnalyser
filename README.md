# App Sentiment Analyser 

This app allows you to pull all of the reviews from an app in the Google-Play-Store, clean them and auto evaluate them with the help of an LLM.

<img width="1093" height="939" alt="image" src="https://github.com/user-attachments/assets/91a2ddf3-9d1a-4b70-9edb-a334ca6e6881" />

## How To Use:

### Prerequisits

1. Install Ollama https://ollama.com/download
2. Install the model you want to use

---

### Installation

1. Clone this repository
2. Open a terminal
3. Type `npm install`
4. Type `npm start` 

---

### Usage

1. Open a new tab in you browser and go to the url "https://localhost:30000"
2. Welcome to the overlay!
3. Get the App-Id of the app you want to analyse
    1. Head to https://play.google.com/store/
    2. Search for the app you want to analyse
    3. Click on it
    4. Take the App-Id from the url (For example the url for clash royale: `https://play.google.com/store/apps/details?id=com.supercell.clashroyale&pcampaignid=merch_published_cluster_promotion_battlestar_deals_week_10x_points_games_cluster&utm_source=emea_Med` leaves us with the section **id=com.supercell.clashroyale**)
4. Enter the App-Id in the Id field (In our case: com.supercell.clashroyale)
5. Press `Scrape Reviews`
6. Select the language of the reviews you want to scrape
7. Select the number of reviews you want to scrap (to get all just take a really high number)
8. Wait for the app to say "Scrape finished."
9. Press `Clean`
10. Wait for the app to say "Cleaning finished."
11. Configure your analysis under the "Analysis" card in the bottom
    1. Choose your model (make sure you have it installed)
    2. Select an appropiate chunk size (30 seems to work well)
12. Press `Analyze
13. Wait for the app to say "Analysing finshed." (Note: it may take a good while)
