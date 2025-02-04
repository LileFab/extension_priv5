const ETATS = {
	LIBRE: "libre",
	PRIS: "pris",
};

const TEXTEETAT = {
	LIBRE: "Je prends priv 5 !",
	PRIS: "Je rends priv 5",
};

const recupererEtat = async () => {
	const resp = await fetch("https://api.fleisch.fr/extension/etat", {
		method: "GET",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
	const data = await resp.json();
	state = data.state;
	console.log(state);
	if (state === "0") return ETATS.LIBRE;
	else return ETATS.PRIS;
};

const setState = async (newState) => {
	fetch(`https://api.fleisch.fr/extension/etat/${newState}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
};

let etatActuel = null;

document.addEventListener("DOMContentLoaded", async () => {
	const boutonStatusPprod = document.getElementById("toggle-status-pprod");
	const indicateurStatusPprod = document.getElementById(
		"status-indicator-pprod"
	);
	const textButtonPprod = document.getElementById("button-text-pprod");

	function update(etat) {
		indicateurStatusPprod.className = `status-indicator status-${etat}`;
		textButtonPprod.textContent = `${
			etat === ETATS.LIBRE ? TEXTEETAT.LIBRE : TEXTEETAT.PRIS
		}`;
	}

	function demarrerPolling() {
		setInterval(async () => {
			etatActuel = await recupererEtat();
			update(etatActuel);
		}, 1000); // Vérifie toutes les seconde
	}

	boutonStatusPprod.addEventListener("click", async () => {
		etatActuel = await recupererEtat();
		await setState(etatActuel === ETATS.LIBRE ? "1" : "0");
		update(etatActuel);
	});

	demarrerPolling();
	etatActuel = await recupererEtat();
	update(etatActuel);
});
