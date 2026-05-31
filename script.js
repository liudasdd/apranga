const weatherAdvice = {
  saulėta: "Saulėta diena. Gali rinktis lengvesnius drabužius ir kepurę.",
  vėsu: "Šiandien vėsoka. Džemperis arba megztinis padės jaustis jaukiai.",
  lietus: "Laukia lietus. Botai ir skėtis bus labai naudingi.",
  šalta: "Šalta diena. Šalikas, šilti batai ir megztinis yra geras pasirinkimas.",
};

const smartOutfits = {
  saulėta: {
    Viršus: ["marškinėliai", "👕"],
    Apačia: ["šortai", "🩳"],
    Avalynė: ["basutės", "🩴"],
    Priedas: ["kepurė", "🧢"],
  },
  vėsu: {
    Viršus: ["megztinis", "🧥"],
    Apačia: ["kelnės", "👖"],
    Avalynė: ["sportbačiai", "👟"],
    Priedas: ["kepurė", "🧢"],
  },
  lietus: {
    Viršus: ["megztinis", "🧥"],
    Apačia: ["kelnės", "👖"],
    Avalynė: ["botai", "🥾"],
    Priedas: ["skėtis", "☂️"],
  },
  šalta: {
    Viršus: ["megztinis", "🧥"],
    Apačia: ["kelnės", "👖"],
    Avalynė: ["botai", "🥾"],
    Priedas: ["šalikas", "🧣"],
  },
};

const state = {
  weather: "saulėta",
  outfit: {
    Viršus: { value: "marškinėliai", emoji: "👕" },
    Apačia: { value: "kelnės", emoji: "👖" },
    Avalynė: { value: "sportbačiai", emoji: "👟" },
    Priedas: { value: "kepurė", emoji: "🧢" },
  },
};

const summaryList = document.querySelector("#summary-list");
const weatherNote = document.querySelector("#weather-note");
const result = document.querySelector("#result");
const readyButton = document.querySelector("#ready-button");
const randomButton = document.querySelector("#random-button");
const previewTop = document.querySelector("#preview-top");
const previewBottom = document.querySelector("#preview-bottom");
const previewShoes = document.querySelector("#preview-shoes");

function setSelected(buttons, selectedButton) {
  buttons.forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function updateSummary() {
  summaryList.innerHTML = "";

  Object.entries(state.outfit).forEach(([category, item]) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${category}</span><strong>${item.emoji} ${item.value}</strong>`;
    summaryList.appendChild(listItem);
  });

  previewTop.textContent = state.outfit.Viršus.emoji;
  previewBottom.textContent = state.outfit.Apačia.emoji;
  previewShoes.textContent = state.outfit.Avalynė.emoji;
  weatherNote.textContent = weatherAdvice[state.weather];
}

function applyOutfitSuggestion() {
  const suggestion = smartOutfits[state.weather];

  Object.entries(suggestion).forEach(([category, [value, emoji]]) => {
    state.outfit[category] = { value, emoji };
    const categoryElement = document.querySelector(`[data-category="${category}"]`);
    const buttons = Array.from(categoryElement.querySelectorAll(".item"));
    const selectedButton = buttons.find((button) => button.dataset.value === value);

    if (selectedButton) {
      setSelected(buttons, selectedButton);
    }
  });

  result.textContent = "Parinkau aprangą pagal orą. Gali ją pakeisti, jei nori.";
  updateSummary();
}

document.querySelectorAll("[data-group='weather'] .choice").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("selected")));

  button.addEventListener("click", () => {
    const buttons = Array.from(button.parentElement.querySelectorAll(".choice"));
    state.weather = button.dataset.value;
    setSelected(buttons, button);
    result.textContent = "";
    updateSummary();
  });
});

document.querySelectorAll(".category").forEach((categoryElement) => {
  const category = categoryElement.dataset.category;
  const buttons = Array.from(categoryElement.querySelectorAll(".item"));

  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("selected")));

    button.addEventListener("click", () => {
      state.outfit[category] = {
        value: button.dataset.value,
        emoji: button.dataset.emoji,
      };
      setSelected(buttons, button);
      result.textContent = "";
      updateSummary();
    });
  });
});

readyButton.addEventListener("click", () => {
  const outfit = Object.values(state.outfit)
    .map((item) => item.value)
    .join(", ");

  result.textContent = `Puiku! Šiandien pasirinkta: ${outfit}.`;
});

randomButton.addEventListener("click", applyOutfitSuggestion);

updateSummary();
