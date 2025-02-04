// Définition des états possibles de la salle
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

// État initial de la salle (nous utiliserons le stockage Chrome plus tard)
let etatActuel = null;

// Attendre que le document soit chargé avant d'exécuter notre code
document.addEventListener("DOMContentLoaded", async () => {
	// Récupération des éléments de l'interface
	const boutonStatusPprod = document.getElementById("toggle-status-pprod");
	const indicateurStatusPprod = document.getElementById(
		"status-indicator-pprod"
	);
	const textButtonPprod = document.getElementById("button-text-pprod");

	// Fonction pour mettre à jour l'affichage
	function update(etat) {
		// Mise à jour des classes CSS
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

	// Gestion du clic sur le bouton
	boutonStatusPprod.addEventListener("click", async () => {
		// Changement de l'état
		etatActuel = await recupererEtat();
		await setState(etatActuel === ETATS.LIBRE ? "1" : "0");
		// Mise à jour de l'interface
		update(etatActuel);
	});

	// Initialisation de l'interface
	demarrerPolling();
	etatActuel = await recupererEtat();
	update(etatActuel);
});
