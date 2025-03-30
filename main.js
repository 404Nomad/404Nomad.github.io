function getQuitData() {
  const data = localStorage.getItem("quitData");
  return data ? JSON.parse(data) : null;
}

function saveQuitData(data) {
  localStorage.setItem("quitData", JSON.stringify(data));
}

function resetQuitData() {
  localStorage.removeItem("quitData");
}

// Données des améliorations centralisées
const improvementsData = {
  heartRate: {
    threshold: 20,
    desc: "Your heart rate and blood pressure drop"
  },
  carbon: {
    threshold: 12 * 60,
    desc: "The carbon monoxide level in your blood drops to normal"
  },
  circulation: {
    threshold: 14 * 24 * 60,
    desc: "Your circulation improves and your lung function increases"
  },
  coughing: {
    threshold: 30 * 24 * 60,
    desc: "Coughing and shortness of breath decrease"
  },
  riskCoronary: {
    threshold: 365 * 24 * 60,
    desc: "Your risk of coronary heart disease is about half that of a smoker's"
  },
  strokeRisk: {
    threshold: 5 * 365 * 24 * 60,
    desc: "The stroke risk is that of a nonsmoker's"
  },
  lungCancer: {
    threshold: 10 * 365 * 24 * 60,
    desc: "Your risk of lung cancer falls to about half that of a smoker and your risk of cancer of the mouth, throat, esophagus, bladder, cervix, and pancreas decreases"
  },
  coronaryHeartDisease: {
    threshold: 15 * 365 * 24 * 60,
    desc: "The risk of coronary heart disease is that of a nonsmoker's"
  }
};

function loadData() {
  const data = getQuitData();
  if (!data) return;

  const lastSmoke = new Date(data.lastSmoke);
  const now = new Date();
  const elapsed = now - lastSmoke;
  const elapsedMinutes = elapsed / 60000;
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);

  document.getElementById("timeSince").textContent = `${days}d ${hours}h ${minutes}min`;
  document.getElementById("daysQuit").textContent = days;

  const avoided = days * data.dailyCigs;
  const money = (avoided / data.cigsPerPack) * data.packPrice;
  const timeSaved = (avoided * 11) / 60;

  document.getElementById("cigsAvoided").textContent = avoided;
  document.getElementById("moneySaved").textContent = money.toFixed(2);
  document.getElementById("timeSaved").textContent = timeSaved.toFixed(1);

  // Seuils de durée (en minutes)
  const thresholds = {
    heartRate: improvementsData.heartRate.threshold,
    carbon: improvementsData.carbon.threshold,
    circulation: improvementsData.circulation.threshold,
    coughing: improvementsData.coughing.threshold,
    riskCoronary: improvementsData.riskCoronary.threshold,
    strokeRisk: improvementsData.strokeRisk.threshold,
    lungCancer: improvementsData.lungCancer.threshold,
    coronaryHeartDisease: improvementsData.coronaryHeartDisease.threshold
  };

  // Calcul des pourcentages
  const calcPercent = (threshold) =>
    Math.min(100, (elapsedMinutes / threshold) * 100);

  const progressValues = {
    heartRate: calcPercent(thresholds.heartRate),
    carbon: calcPercent(thresholds.carbon),
    circulation: calcPercent(thresholds.circulation),
    coughing: calcPercent(thresholds.coughing),
    riskCoronary: calcPercent(thresholds.riskCoronary),
    strokeRisk: calcPercent(thresholds.strokeRisk),
    lungCancer: calcPercent(thresholds.lungCancer),
    coronaryHeartDisease: calcPercent(thresholds.coronaryHeartDisease)
  };

  let completed = 0;

  Object.entries(progressValues).forEach(([key, value]) => {
    const progress = Math.floor(value);
    if (progress >= 100) completed++;

    const bar = document.getElementById(`progress-${key}`);
    const label = document.getElementById(`percent-${key}`);

    if (bar) bar.style.width = `${progress}%`;
    if (label) label.textContent = `${progress}`;
  });

  // Mise à jour du compteur
  const heartLabel = document.getElementById("healthProgressCount");
  if (heartLabel) {
    heartLabel.textContent = `${completed}/8`;
  }

  // Calcul de la moyenne pour l'amélioration globale de la santé
  const average =
    Object.values(progressValues).reduce((a, b) => a + b, 0) /
    Object.keys(progressValues).length;
  document.getElementById("healthImprovement").textContent = Math.floor(average);
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset all data?")) {
    resetQuitData();
    showView("settings");
  }
});

const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      lastSmoke: document.getElementById("lastSmoke").value,
      dailyCigs: parseInt(document.getElementById("dailyCigs").value, 10),
      cigsPerPack: parseInt(document.getElementById("cigsPerPack").value, 10),
      packPrice: parseFloat(document.getElementById("packPrice").value)
    };
    saveQuitData(data);
    showView("dashboard");
    loadData();
  });
}

function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.classList.toggle("hidden", view.id !== viewId);
  });
  const navLinks = document.querySelectorAll(".bottom-nav a");
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-view") === viewId);
  });
}

const navLinks = document.querySelectorAll(".bottom-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const viewId = link.getAttribute("data-view");
    showView(viewId);
    if (viewId === "dashboard" || viewId === "health") {
      loadData();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (!getQuitData()) {
    showView("settings");
  } else {
    showView("dashboard");
    loadData();
  }
});

setInterval(() => {
  const current = document.querySelector(".view:not(.hidden)");
  if (current && (current.id === "dashboard" || current.id === "health")) {
    loadData();
  }
}, 60000);

// Fonction pour afficher le détail d'une amélioration
function showImprovementDetail(improvementKey) {
  const improvement = improvementsData[improvementKey];
  if (!improvement) return;
  const data = getQuitData();
  if (!data) return;
  const lastSmoke = new Date(data.lastSmoke);
  const now = new Date();
  const elapsedMinutes = (now - lastSmoke) / 60000;
  const threshold = improvement.threshold;
  const progress = Math.min(100, (elapsedMinutes / threshold) * 100);
  const progressFloor = Math.floor(progress);
  document.getElementById("detailPercentage").textContent = `${progressFloor}%`;
  document.getElementById("detailDesc").textContent = improvement.desc;
  if (progressFloor >= 100) {
    document.getElementById("detailCountdown").textContent = "You did it!";
  } else {
    const remainingMinutes = threshold - elapsedMinutes;
    const days = Math.floor(remainingMinutes / (60 * 24));
    const hours = Math.floor((remainingMinutes % (60 * 24)) / 60);
    const minutes = Math.floor(remainingMinutes % 60);
    document.getElementById("detailCountdown").textContent = `${days}d ${hours}h ${minutes}min remaining`;
  }
  showView("improvementDetail");
}

// Ajout des écouteurs sur chaque amélioration
document.querySelectorAll(".improvement").forEach((el) => {
  el.addEventListener("click", () => {
    const key = el.id.replace("impr-", "");
    showImprovementDetail(key);
  });
});

// Bouton retour dans la vue détail
document.getElementById("backFromDetail").addEventListener("click", () => {
  showView("health");
});
