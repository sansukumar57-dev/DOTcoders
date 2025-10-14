## DOTcoders


A sophisticated web application for generating authentic South Indian kolam patterns using advanced mathematical algorithms and modern web technologies. Developed for Smart India Hackathon 2025.


🎯 Project Overview
DOTcoders revolutionizes the traditional art of kolam drawing by combining mathematical precision with digital creativity. Our platform enables users to generate, animate, and export intricate kolam patterns while preserving the cultural authenticity and aesthetic beauty of this ancient art form.

✨ Key Features
🎨 Advanced Kolam Generation
16 Curve Patterns: Mathematical algorithms with 16 distinct curve types for authentic pattern creation

Connectivity Rules: Sophisticated rules ensuring proper pattern flow and traditional aesthetics

Symmetry Control: Generate symmetrical patterns with automatic mirroring capabilities

Vector-Based Rendering: Smooth curves using SVG paths for authentic traditional appearance


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.







## Features

- 🎨 **Advanced Kolam Generation**: Create authentic kolam patterns using algorithms with 16 curve types
- 🔬 **Mathematical Precision**: Connectivity rules ensure proper pattern flow and traditional aesthetics  
- 🔄 **Symmetry Control**: Generate symmetrical patterns with automatic mirroring
- 📐 **Smooth Curves**: Vector-based curved lines using SVG paths for authentic traditional appearance
- ✨ **Smooth Animations**: Watch patterns come to life with progressive drawing animations
- 📤 **Multiple Export Formats**: Download your creations as SVG, or PNG
- 🔗 **Easy Embedding**: Get embed codes to use kolams on other websites
- 📱 **Responsive Design**: Works beautifully on desktop and mobile devices
- ⚡ **Fast Performance**: SVG-based rendering for optimal performance

## Technologies Used

- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **SVG** for 2D drawing and animations
- **html2canvas** for SVG to canvas conversion
- **python** for backend
- **python libaries** converting and analysing the kolam designs

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```




Backend
Python with Flask/FastAPI for robust backend operations

Mathematical Libraries for kolam pattern analysis and generation

Image Processing for format conversion and optimization

 
```bash
backend>red>app.py&&ui.html
cd backend
cd red
pip install requirements.txt
py app.py  # for recreate the kolam image

cd ..

#in backend has one app.py
#run the app.py
py app.py # for ui of that py
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

🚀 Quick Start
Prerequisites
Node.js 18+

Python 3.8+

pnpm (recommended) or npm/yarn/bun

## Usage

1. **Generate Patterns**: Click on any pattern button (Square, Diamond, Star, Traditional Pulli) to create a kolam
2. **Enable Animation**: Toggle the animation checkbox to see the pattern draw itself
3. **Export**: Choose from SVG, PNG, or animated GIF export options
4. **Embed**: Copy the embed code to use the kolam on other websites

## Kolam Patterns

### Advanced Generation Algorithm
Based on academic research algorithms, our kolam generator uses:
- **16 Curve Patterns**: Each grid cell can contain one of 16 mathematically defined curve patterns
- **Connectivity Rules**: Sophisticated rules ensure patterns connect properly with neighboring cells
- **Symmetry Generation**: Automatic 1D and 2D symmetrical pattern generation
- **Smooth Curves**: Vector-based curved lines for authentic kolam aesthetics


bash
git clone https://github.com/sansukumar57-dev/DOTcoders-kolam.git
cd dotcoders-kolam
Install dependencies and start development server

bash
cd backend
cd red

pip install -r requirements.txt
python app.py
Access the application
Open http://localhost:3000 in your browser to see the application.

VIDEO: 

https://github.com/user-attachments/assets/e778b2c7-8150-40a0-9c2d-085a6511b086



🎮 Usage Guide
Generating Kolam Patterns
Select Pattern Type: Choose from Square, Diamond, Star, or Traditional Pulli patterns

Customize Parameters: Adjust symmetry, complexity, and animation settings

Enable Animation: Toggle animation to watch the pattern draw itself

Export Results: Download in your preferred format or copy embed code

Pattern Types Available
Square Patterns: Grid-based symmetrical designs

Diamond Patterns: Angular and geometric compositions

Star Patterns: Radial and celestial-inspired designs

Traditional Pulli: Authentic dot-based kolam patterns

🔬 Technical Implementation





backend/                        # Main Flask application
├──               
├── red/              
│   ├── app.py/           # User uploads here THE MAIN RECREATION PROCESS IS HAPPEN
│   └── requirements.txt   # Dependencies 
├── app.py # ui for the backend is there
└── static/                        # Frontend assets (if external) in future
    ├── css/
    ├── js/
    └── images/
Advanced Generation Algorithm
Our kolam generator employs sophisticated algorithms based on academic research:

16 Curve Pattern System: Each grid cell can contain one of 16 mathematically defined curve patterns

Connectivity Enforcement: Rules ensure patterns connect properly with neighboring cells

Symmetry Generation: Automatic 1D and 2D symmetrical pattern generation

Vector Precision: Mathematical curves for authentic kolam aesthetics

Performance Optimization
SVG-Based Rendering: Optimal performance with scalable vector graphics

Efficient Algorithms: Fast pattern generation even for complex designs

Progressive Loading: Smooth user experience with optimized resource loading

🎯 SIH 2025 Implementation
Innovation Highlights
Digital Preservation: Modern technology meets traditional art preservation

Mathematical Modeling: Algorithmic approach to cultural pattern generation

Accessibility: Making kolam art accessible to global audiences

Educational Value: Demonstrating mathematical principles in traditional art

Impact Areas
Cultural Heritage: Digital preservation of traditional art forms

STEM Education: Demonstrating mathematics in cultural context

Creative Technology: Bridging art and technology

Global Accessibility: Making Indian cultural art forms accessible worldwide

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Development Workflow
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is developed for Smart India Hackathon 2025. See the LICENSE file for details.

🙏 Acknowledgments
Smart India Hackathon 2025 for the platform

Traditional kolam artists and cultural practitioners

Academic researchers in mathematical art and pattern generation

Open source community for invaluable tools and libraries

📞 Contact & Support


Team: DOTcoders

Event: Smart India Hackathon 2025

Email: [sansukumar57@gmail.com]
YouTube:[Youtube link: https://youtube.com/@dotcoders-o1t?feature=shared]

Issues: GitHub Issues

<div align="center">
Made with ❤️ for Smart India Hackathon 2025

Preserving Tradition Through Technology

</div>

