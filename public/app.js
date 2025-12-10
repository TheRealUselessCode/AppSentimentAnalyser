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
	const raw = await fetch('/reviews.json').then(r => r.ok ? r.text() : '');
	rawOut.value = raw || '';

	const clean = await fetch('/reviews_clean.json').then(r => r.ok ? r.text() : '');
	cleanOut.value = clean || '';

	const analysis = await fetch('/reviews_analysis.json').then(r => r.ok ? r.text() : '');
	analysisOut.value = analysis || '';
}

btnScrape.addEventListener('click', async () => {
	const appId = appIdEl.value.trim();
	const language = languageEl.value.trim();
	const numberOfReviews = Number(numEl.value);
	if (!appId) {
		setStatus('Bitte App-ID angeben.');
		return;
	}

	setStatus('Scrape läuft...');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/scrape-reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ appId, numberOfReviews, language })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Fehler beim Scrapen');
		setStatus('Scrape fertig.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Fehler: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

btnClean.addEventListener('click', async () => {
	setStatus('Bereinigung läuft...');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/clean-reviews', { method: 'POST' });
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Fehler bei der Bereinigung');
		setStatus('Bereinigung fertig.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Fehler: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

btnAnalyze.addEventListener('click', async () => {
	const languageModel = modelEl.value.trim() || 'gemma3';
	const chunkSize = Number(chunkEl.value) || 30;
	setStatus('Analyse läuft... (Ollama)');
	btnScrape.disabled = true; btnClean.disabled = true; btnAnalyze.disabled = true;
	try {
		const res = await fetch('/api/analyze-reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ languageModel, chunkSize })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || 'Fehler bei der Analyse');
		setStatus('Analyse fertig.');
		await refreshPreviews();
	} catch (e) {
		console.error(e);
		setStatus('Fehler: ' + e.message);
	} finally {
		btnScrape.disabled = false; btnClean.disabled = false; btnAnalyze.disabled = false;
	}
});

// Initial load
refreshPreviews();
