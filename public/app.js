const statusEl = document.getElementById('status');
const rawOut = document.getElementById('rawOut');
const cleanOut = document.getElementById('cleanOut');
const analysisOut = document.getElementById('analysisOut');

const appIdEl = document.getElementById('appId');
const languageEl = document.getElementById('language');
const numEl = document.getElementById('num');
const modelEl = document.getElementById('model');
const chunkEl = document.getElementById('chunk');

const btnScrape = document.getElementById('btnScrape');
const btnClean = document.getElementById('btnClean');
const btnAnalyze = document.getElementById('btnAnalyze');

function setStatus(text) {
	statusEl.textContent = text;
}

async function fetchJson(path) {
	try {
		const res = await fetch(path);
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

async function refreshPreviews() {
	const raw = await fetchJson('/reviews.json');
	rawOut.value = raw ? JSON.stringify(raw, null, 2) : '';

	const clean = await fetchJson('/reviews_clean.json');
	cleanOut.value = clean ? JSON.stringify(clean, null, 2) : '';

	const analysis = await fetchJson('/reviews_analysis.json');
	analysisOut.value = analysis ? JSON.stringify(analysis, null, 2) : '';
}

btnScrape.addEventListener('click', async () => {
	const appId = appIdEl.value.trim();
	const language = languageEl.value.trim();
	const numberOfReviews = Number(numEl.value);
	if (!appId) {
		setStatus('Please provide an App ID.');
		return;
	}

	setStatus('Scraping in progress...');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/scrape-reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ appId, numberOfReviews, language })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Error while scraping');
		setStatus('Scrape finished.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Error: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

btnClean.addEventListener('click', async () => {
	setStatus('Cleaning in progress...');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/clean-reviews', { method: 'POST' });
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Error while cleaning');
		setStatus('Cleaning finished.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Error: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

btnAnalyze.addEventListener('click', async () => {
	const languageModel = modelEl.value.trim() || 'gemma3';
	const chunkSize = Number(chunkEl.value) || 30;
	setStatus('Analysis in progress... (Ollama)');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/analyze-reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ languageModel, chunkSize })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Error during analysis');
		setStatus('Analysis finished.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Error: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

// Initial load
refreshPreviews();
