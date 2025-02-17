document.addEventListener("DOMContentLoaded", () => {
    const storyElement = document.getElementById("story");
    const choicesElement = document.getElementById("choices");
  
    // Basic game state
    const gameState = {
      currentLocation: "start",
      inventory: [],
      experience: 0,
    };
  
    // Define locations and their possible commands
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
  
    /**
     * Renders the description of the current location
     */
    function renderLocation() {
      const location = locations[gameState.currentLocation];
      storyElement.innerHTML = `<p>${location.description}</p>`;
    }
  
    /**
     * Renders a set of buttons corresponding to available commands in the current location
     */
    function renderChoices() {
      const location = locations[gameState.currentLocation];
      choicesElement.innerHTML = ""; // Clear existing buttons
  
      // Create a button for each possible command in the current location
      Object.entries(location.commands).forEach(([commandText, destination]) => {
        const button = document.createElement("button");
        button.classList.add("choice-button");
        button.textContent = commandText;
        button.addEventListener("click", () => {
          gameState.currentLocation = destination;
          renderLocation();
          renderChoices();
        });
        choicesElement.appendChild(button);
      });
    }
  
    // Initial render
    renderLocation();
    renderChoices();
  });
  