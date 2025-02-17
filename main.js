document.addEventListener("DOMContentLoaded", () => {
    const storyElement = document.getElementById("story");
    const choicesElement = document.getElementById("choices");
  
    // === MENU & OPTIONS ELEMENTS ===
    const menuToggleBtn = document.getElementById("menu-toggle");
    const menuPanel = document.getElementById("menu-panel");
    const closeMenuBtn = document.getElementById("close-menu");
  
    const optionsToggleBtn = document.getElementById("options-toggle");
    const optionsPanel = document.getElementById("options-panel");
    const toggleFontSizeCheckbox = document.getElementById("toggle-font-size");
  
    const saveBtn = document.getElementById("save-btn");
    const loadBtn = document.getElementById("load-btn");
  
    // === GAME STATE ===
    let gameState = {
      currentLocation: "start",
      inventory: [],
      experience: 0,
      options: {
        largeFont: false,
      },
    };
  
    // === LOCATIONS & COMMANDS ===
    const locations = {
      start: {
        description:
          "You wake up in a dark, neon-lit alley in the futuristic 2075. The rain pours down, and the distant hum of cybernetic life fills the air.",
        commands: {
          "Go North": "alley_north",
          "Go East": "alley_east",
        },
      },
      alley_north: {
        description:
          "You move north into a more dangerous district. The environment is grim, with towering holograms flickering overhead.",
        commands: {
          "Go South": "start",
        },
      },
      alley_east: {
        description:
          "Heading east, you find a cyber café bustling with data hackers and digital outlaws.",
        commands: {
          "Go West": "start",
        },
      },
    };
  
    // === RENDER FUNCTIONS ===
    function renderLocation() {
      const location = locations[gameState.currentLocation];
      storyElement.innerHTML = `<p>${location.description}</p>`;
    }
  
    function renderChoices() {
      const location = locations[gameState.currentLocation];
      choicesElement.innerHTML = ""; // Clear existing buttons
  
      Object.entries(location.commands).forEach(([commandText, destination]) => {
        const button = document.createElement("button");
        button.classList.add("choice-button");
        button.textContent = commandText;
        button.addEventListener("click", () => {
          gameState.currentLocation = destination;
          renderScene();
        });
        choicesElement.appendChild(button);
      });
    }
  
    function renderScene() {
      renderLocation();
      renderChoices();
      applyOptions();
    }
  
    // === OPTIONS & UI MODES ===
    function applyOptions() {
      // Toggle large font if chosen
      if (gameState.options.largeFont) {
        document.body.style.fontSize = "20px";
      } else {
        document.body.style.fontSize = "16px";
      }
    }
  
    // === SAVE & LOAD ===
    function saveGame() {
      // Convert gameState to a JSON string
      localStorage.setItem("gameSave", JSON.stringify(gameState));
      alert("Game Saved!");
    }
  
    function loadGame() {
      const saved = localStorage.getItem("gameSave");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Overwrite the existing gameState with the loaded data
          Object.assign(gameState, parsed);
          renderScene();
          alert("Game Loaded!");
        } catch (err) {
          alert("Failed to load game data.");
        }
      } else {
        alert("No saved game found.");
      }
    }
  
    // === EVENT LISTENERS ===
  
    // Menu toggle
    menuToggleBtn.addEventListener("click", () => {
      menuPanel.classList.toggle("show");
    });
  
    // Close menu button
    closeMenuBtn.addEventListener("click", () => {
      menuPanel.classList.remove("show");
    });
  
    // Options toggle
    optionsToggleBtn.addEventListener("click", () => {
      optionsPanel.classList.toggle("show");
    });
  
    // Font size option
    toggleFontSizeCheckbox.addEventListener("change", (e) => {
      gameState.options.largeFont = e.target.checked;
      applyOptions();
    });
  
    // Save / Load
    saveBtn.addEventListener("click", saveGame);
    loadBtn.addEventListener("click", loadGame);
  
    // === INITIALIZE ===
    renderScene();
  });
  