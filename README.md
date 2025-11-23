# Circle Drawer App

A React application for drawing and manipulating circles with adjustable diameters.

## Features

- 🎨 Draw multiple circles with different colors
- 📏 Adjust circle diameters in inches (0.25" to 10")
- 🖱️ Drag circles to reposition them
- ✏️ Double-click circles to edit diameter inline
- 📊 Real-time circle information display
- 🎯 Grid background for better positioning
- ✨ Visual diameter indicators in inches

## Setup Instructions

### Prerequisites

Make sure you have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org/)

### Installation & Running

1. Extract the `circle-drawer-app.zip` file to your desired location

2. Open a terminal/command prompt and navigate to the extracted folder:
   ```bash
   cd circle-drawer-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The app will automatically open in your browser at `http://localhost:3000`

## How to Use

### Basic Operations

- **Select a Circle**: Click on any circle to select it (it will have a black border)
- **Move a Circle**: Click and drag any circle to move it around the canvas
- **Edit Diameter (Quick)**: Double-click on any circle to edit its diameter inline
- **Adjust Diameter**: Use the number input or slider in the control panel
- **Add Circle**: Click the "Add Circle" button to create a new circle
- **Delete Circle**: Click the "Delete Circle" button to remove the selected circle

### Interface Elements

- **Diameter Input**: Enter a specific diameter value (0.25-10 inches)
- **Diameter Slider**: Drag the slider to adjust diameter smoothly (0.25" increments)
- **Inline Editor**: Double-click any circle to edit diameter directly on the canvas
  - Press Enter to save
  - Press Escape to cancel
  - Click outside to save automatically
- **Circle Info Panel**: Shows details about the selected circle
  - Circle ID
  - Current diameter
  - Radius
  - Position coordinates
  - Total number of circles

### Visual Indicators

- **Black Border**: Indicates the selected circle
- **Dashed Line**: Shows the diameter of the selected circle
- **ø Symbol**: Displays the diameter measurement in inches above the circle
- **Edit Box**: Appears when you double-click to edit diameter inline
- **Grid Background**: Helps with alignment and positioning
- **Center Dot**: Marks the center point of each circle

## Project Structure

```
circle-drawer-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CircleDrawer.js
│   │   └── CircleDrawer.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Future Enhancements (Planned)

- Collision detection to prevent circle overlap
- Draw enclosing boundary around multiple circles
- Calculate effective diameter of circle groups
- Save/load circle configurations
- Export as image

## Technologies Used

- React 18.2.0
- SVG for rendering
- CSS3 for styling
- React Hooks (useState)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm start
```

### Module Not Found

If you get module errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Browser Compatibility

Works best in modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

Enjoy drawing circles! 🎨
