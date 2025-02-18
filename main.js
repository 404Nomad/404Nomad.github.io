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

  // Helper: Retrieve item object by id
  function getItemById(itemId) {
    return items.find((itm) => itm.id === itemId);
  }

  // === LOCATIONS & STORY ===
  // In this story the player must explore various locations and collect items.
  // When all required items are obtained, the player can enter the Secret Bunker.
  const locations = {
    start: {
      description:
        "You wake up in a dark, neon-lit alley in the futuristic 2075. The rain pours down and the hum of cybernetic life fills the air. Paths lead in multiple directions.",
      commands: {
        "Go North": "alley_north",
        "Go East": "alley_east",
        "Go to Back Alley": "back_alley"
      },
      items: []
    },
    alley_north: {
      description:
        "You move north into a grim district, where towering holograms flicker above crumbling facades. Shadows hint at hidden dangers.",
      commands: {
        "Go South": "start",
        "Explore": "explore_alley_north"
      },
      items: []
    },
    explore_alley_north: {
      description:
        "Searching the dark corners, you find a battered crate. Inside, you spot a Rusty Pistol and an Ammo Clip.",
      commands: {
        "Pick up Rusty Pistol": "pickup_rusty_pistol",
        "Pick up Ammo Clip": "pickup_ammo_clip",
        "Go Back": "alley_north"
      },
      items: ["rusty_pistol", "ammo_clip"]
    },
    pickup_rusty_pistol: {
      description:
        "You pick up the Rusty Pistol. Though old, it might prove useful.",
      commands: {
        "Go Back": "alley_north"
      },
      items: []
    },
    pickup_ammo_clip: {
      description:
        "You pick up the Ammo Clip. Extra rounds could come in handy.",
      commands: {
        "Go Back": "alley_north"
      },
      items: []
    },
    alley_east: {
      description:
        "Heading east, you arrive at a bustling cyber café. Neon signs, data hackers, and digital outlaws fill the scene. A side street leads further downtown.",
      commands: {
        "Go West": "start",
        "Explore": "explore_alley_east",
        "Go to Downtown": "downtown"
      },
      items: []
    },
    explore_alley_east: {
      description:
        "You rummage through the trash behind the café and discover an Energy Bar and a half-empty Synth Drink.",
      commands: {
        "Pick up Energy Bar": "pickup_energy_bar",
        "Pick up Synth Drink": "pickup_synth_drink",
        "Go Back": "alley_east"
      },
      items: ["energy_bar", "synth_drink"]
    },
    pickup_energy_bar: {
      description:
        "You pick up the Energy Bar. It may not be gourmet, but it'll keep you going.",
      commands: {
        "Go Back": "alley_east"
      },
      items: []
    },
    pickup_synth_drink: {
      description:
        "You pick up the Synth Drink. Its neon hue is oddly inviting.",
      commands: {
        "Go Back": "alley_east"
      },
      items: []
    },
    back_alley: {
      description:
        "In a narrow back alley, glistening in a puddle, you notice a discarded Hacking Device.",
      commands: {
        "Pick up Hacking Device": "pickup_hacking_device",
        "Go Back": "start"
      },
      items: ["hacking_device"]
    },
    pickup_hacking_device: {
      description:
        "You pick up the Hacking Device. With this, you could bypass even the toughest security.",
      commands: {
        "Go Back": "start"
      },
      items: []
    },
    downtown: {
      description:
        "You arrive downtown where neon lights pulse and the air is thick with mystery. In the distance, an imposing door looms — the entrance to a Secret Bunker.",
      commands: {
        "Enter the Secret Bunker": "enter_secret_bunker",
        "Go Back": "start"
      },
      items: []
    },
    enter_secret_bunker: {
      description:
        "You approach the door. As you reach for the handle, a security system scans you.",
      // The actual transition will be intercepted to check for required items.
      commands: {
        "Attempt Entry": "final_entry",
        "Go Back": "downtown"
      },
      items: []
    },
    final_entry: {
      description:
        "Using your collected items to bypass the security systems, the door opens. You step inside the secret bunker. Congratulations! Your journey in the neon-drenched world of 2075 has reached its end.",
      commands: {
        "End Game": "end_game"
      },
      items: []
    },
    end_game: {
      description:
        "THE END - Your adventure in 2075 comes to a close. Thank you for playing!",
      commands: {},
      items: []
    }
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

  // Handles location changes and intercepts special commands.
  function handleLocationChange(destination, commandText) {
    // If the command is a "Pick up ..." action, add the item.
    if (commandText.startsWith("Pick up")) {
      const itemName = commandText.replace("Pick up ", "").trim();
      const itemObj = items.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase()
      );
      if (itemObj) {
        addItemToInventory(itemObj.id);
      }
    }
    // Special check for entering the secret bunker.
    if (commandText === "Attempt Entry") {
      const requiredItems = [
        "rusty_pistol",
        "ammo_clip",
        "energy_bar",
        "synth_drink",
        "hacking_device"
      ];
      const hasAll = requiredItems.every((id) =>
        gameState.inventory.includes(id)
      );
      if (!hasAll) {
        alert("You don't have all the necessary items to enter the bunker. Collect them all first.");
        return; // Do not change location.
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
  function addItemToInventory(itemId) {
    if (!gameState.inventory.includes(itemId)) {
      gameState.inventory.push(itemId);
      alert(`You acquired: ${getItemById(itemId).name}`);
    }
  }

  function showInventory() {
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
  closeMenuBtn.addEventListener("click", () => {
    menuPanel.classList.remove("show");
  });

  // Options toggle
  optionsToggleBtn.addEventListener("click", () => {
    optionsPanel.classList.toggle("show");
  });
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
