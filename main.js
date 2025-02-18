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

  // === INVENTORY ELEMENTS ===
  const inventoryPanel = document.getElementById("inventory-panel");
  const closeInventoryBtn = document.getElementById("close-inventory");
  const inventoryBtn = document.getElementById("inventory-btn");
  const inventoryList = document.getElementById("inventory-list");

  // === GAME STATE ===
  let gameState = {
    currentLocation: "start",
    experience: 0,
    inventory: [],
    options: {
      largeFont: false,
    },
  };

  // === CYBERPUNK ITEMS LIST ===
  // An example set of items you could find in a futuristic 2075 setting.
  // You can expand this list as needed.
  const items = [
    {
      id: "energy_bar",
      name: "Energy Bar",
      type: "Food",
      description: "A high-protein synthetic bar to ease hunger.",
    },
    {
      id: "synth_drink",
      name: "Synth Drink",
      type: "Drinks",
      description: "A neon-colored beverage containing mild stimulants.",
    },
    {
      id: "rusty_pistol",
      name: "Rusty Pistol",
      type: "Weapon",
      description: "A basic sidearm with low accuracy but can save your life.",
    },
    {
      id: "ammo_clip",
      name: "Ammo Clip",
      type: "Ammo",
      description: "9mm caliber ammo clip compatible with most pistols.",
    },
    {
      id: "hacking_device",
      name: "Hacking Device",
      type: "Tools",
      description: "A portable neural interface used for bypassing security.",
    },
  ];

  // Helper function to retrieve an item object by ID
  function getItemById(itemId) {
    return items.find((itm) => itm.id === itemId);
  }

  // === LOCATIONS & COMMANDS ===
  // Some locations will have "items" that can be discovered via an "Explore" action.
  // Once found, a "Pick Up" button allows the user to add them to their inventory.
  const locations = {
    start: {
      description:
        "You wake up in a dark, neon-lit alley in the futuristic 2075. The rain pours down, and the distant hum of cybernetic life fills the air.",
      commands: {
        "Go North": "alley_north",
        "Go East": "alley_east",
      },
      items: [], // no items in the start location
    },
    alley_north: {
      description:
        "You move north into a more dangerous district. The environment is grim, with towering holograms flickering overhead.",
      commands: {
        "Go South": "start",
        Explore: "explore_alley_north",
      },
      items: [], // no direct items, but we have a separate 'explore' route
    },
    // A pseudo-location for exploring alley_north
    explore_alley_north: {
      description:
        "You search the dark corners and find a battered crate. Inside, there's a Rusty Pistol and an Ammo Clip.",
      commands: {
        "Pick up Rusty Pistol": "pickup_rusty_pistol",
        "Pick up Ammo Clip": "pickup_ammo_clip",
        "Go Back": "alley_north",
      },
      items: ["rusty_pistol", "ammo_clip"],
    },
    // When picking up an item, we can move to a small state for feedback
    pickup_rusty_pistol: {
      description: "You pick up the Rusty Pistol. It might come in handy.",
      commands: {
        "Go Back": "alley_north",
      },
      items: [],
    },
    pickup_ammo_clip: {
      description: "You pick up the Ammo Clip. Always good to have spare ammo.",
      commands: {
        "Go Back": "alley_north",
      },
      items: [],
    },

    alley_east: {
      description:
        "Heading east, you find a cyber café bustling with data hackers and digital outlaws.",
      commands: {
        "Go West": "start",
        Explore: "explore_alley_east",
      },
      items: [],
    },
    explore_alley_east: {
      description:
        "You spot a trash bin behind the café. Inside, there's an Energy Bar and a half-empty Synth Drink.",
      commands: {
        "Pick up Energy Bar": "pickup_energy_bar",
        "Pick up Synth Drink": "pickup_synth_drink",
        "Go Back": "alley_east",
      },
      items: ["energy_bar", "synth_drink"],
    },
    pickup_energy_bar: {
      description: "You pick up the Energy Bar. It's not the tastiest, but it'll do.",
      commands: {
        "Go Back": "alley_east",
      },
      items: [],
    },
    pickup_synth_drink: {
      description: "You pick up the Synth Drink. It's a neon pink color.",
      commands: {
        "Go Back": "alley_east",
      },
      items: [],
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
        handleLocationChange(destination, commandText);
      });
      choicesElement.appendChild(button);
    });
  }

  // This function intercepts certain commands so we can add items to the inventory
  function handleLocationChange(destination, commandText) {
    // If the command was "Pick up ..." we can parse the item from the current location
    if (commandText.startsWith("Pick up")) {
      // E.g. "Pick up Energy Bar" => item name is everything after "Pick up "
      const itemName = commandText.replace("Pick up ", "").trim();
      // Match it to our items[] data
      const itemObj = items.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
      if (itemObj) {
        addItemToInventory(itemObj.id);
      }
    }
    // Update location and re-render
    gameState.currentLocation = destination;
    renderScene();
  }

  function renderScene() {
    renderLocation();
    renderChoices();
    applyOptions();
  }

  // === INVENTORY SYSTEM ===
  // Adds an item to the player's inventory if not already there
  function addItemToInventory(itemId) {
    if (!gameState.inventory.includes(itemId)) {
      gameState.inventory.push(itemId);
      alert(`You acquired: ${getItemById(itemId).name}`);
    }
  }

  function showInventory() {
    // Clear the current list
    inventoryList.innerHTML = "";

    if (gameState.inventory.length === 0) {
      inventoryList.innerHTML = "<p>Your inventory is empty.</p>";
    } else {
      gameState.inventory.forEach((itemId) => {
        const item = getItemById(itemId);
        if (item) {
          const itemElement = document.createElement("div");
          itemElement.textContent = `${item.name} (${item.type}) - ${item.description}`;
          inventoryList.appendChild(itemElement);
        }
      });
    }
    inventoryPanel.style.display = "block";
  }

  function hideInventory() {
    inventoryPanel.style.display = "none";
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
    localStorage.setItem("gameSave", JSON.stringify(gameState));
    alert("Game Saved!");
  }

  function loadGame() {
    const saved = localStorage.getItem("gameSave");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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

  // Inventory
  inventoryBtn.addEventListener("click", showInventory);
  closeInventoryBtn.addEventListener("click", hideInventory);

  // === INITIALIZE ===
  renderScene();
});
