# 2075 Text-Based RPG

**Welcome to the neon-lit underbelly of a cyberpunk future.** In this text-based adventure, you’ll navigate rain-soaked alleys, meet digital outlaws, and collect cutting-edge gear—your choices steer your destiny.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
Set in the dystopian world of 2075, this project is a retro-style text-based RPG where you’ll collect items and make decisions in a sprawling urban maze.  
It’s inspired by the neon sheen of classic cyberpunk—where high-tech meets gritty streets.

---

## Features
- **Interactive Storytelling:** Traverse multiple locations and shape your path through choices.
- **Inventory System:** Acquire cyberpunk-era items (weapons, food, tools) to survive.
- **Dynamic UI:** Mobile-friendly design that slides out menus and panels.
- **Save & Load:** Store progress locally using `localStorage`.
- **Customizable Font Size:** Toggle large fonts for an easier reading experience.

---

## How It Works

1. **Exploration & Item Pickup**  
   - From `start`, you can go **north**, **east**, or into the **back_alley**.  
   - In `alley_north`, you can explore to snag the **Rusty Pistol** and **Ammo Clip**.  
   - In `alley_east`, you can explore to score the **Energy Bar** and **Synth Drink**.  
   - In `back_alley`, you’ll uncover a **Hacking Device**.

2. **Final Destination**  
   - From `alley_east`, head to **downtown** and select **“Enter the Secret Bunker.”**  
   - When you click **“Attempt Entry,”** the system checks if you’ve got all 5 required items.  
   - If you’re fully loaded, you’ll unlock the bunker and finish the game with a final flourish.

3. **Save/Load & Options**  
   - Your entire game state (including inventory) is automatically stashed in **localStorage**.  
   - A simple toggle button allows you to enable large fonts.  
   - View your inventory at any time from the menu for a quick gear check.

---

## Installation
1. Clone or download this repository to your local machine.  
2. Open the `index.html` file in your preferred web browser, or deploy it to a web server (such as GitHub Pages).

---

## Usage
1. **Open the Game:** Double-click `index.html` or navigate to your GitHub Pages URL hosting this project.  
2. **Navigate the World:** Click the buttons under **Choices** to travel between locations, explore, and pick up items.  
3. **Use the Menu:** Click the **☰ Menu** button to open the side panel.  
   - **Save Game / Load Game**: Persists your progress with `localStorage`.  
   - **Toggle Options**: Enable large fonts for easy reading.  
   - **View Inventory**: Displays all your collected items.  
4. **Reach the End:** When you’ve acquired the crucial gear, head downtown and attempt entry at the **Secret Bunker**.

---

## Contributing
Got a storyline idea, new item concept, or want to expand on the city’s neon-laced sprawl? Pull requests are welcome. For major changes, open an issue to discuss the scope and details.

---

## License
This project is provided “as is” under the [MIT License](LICENSE). Feel free to hack away, remix, and modify to build your own neon-fueled dystopia!

---

**Prepare your nerves, keep your cybernetics in check, and dive into the neon city.** The year is 2075—adapt or be left behind.
