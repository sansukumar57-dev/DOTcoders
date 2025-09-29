"use client";

// import { KolamPattern } from "@/types/kolam";
// import { KolamExporter } from "@/utils/kolamExporter";
// import { KolamGenerator } from "@/utils/kolamGenerator";
// import {
//   durationToSpeed,
//   generateEmbedURL,
//   speedToDuration,
//   updateURL,
//   useKolamURLParams,
// } from "@/utils/urlParams";
// import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
// import { KolamDisplay } from "./KolamDisplay";

// export const KolamEditor: React.FC = (): JSX.Element => {
//   const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(
//     null
//   );
//   const [isExporting, setIsExporting] = useState(false);
//   const [showDownloadMenu, setShowDownloadMenu] = useState(false);
//   const [animationState, setAnimationState] = useState<
//     "stopped" | "playing" | "paused"
//   >("stopped");
//   const kolamRef = useRef<HTMLDivElement>(null);

//   // Get URL parameters
//   const urlParams = useKolamURLParams();
//   const [size, setSize] = useState(urlParams.size);
//   const [animationSpeed, setAnimationSpeed] = useState(
//     durationToSpeed(urlParams.duration)
//   );
//   const [animationDuration, setAnimationDuration] = useState(
//     urlParams.duration
//   );
//   const [initialAutoAnimate, setInitialAutoAnimate] = useState(
//     urlParams.initialAutoAnimate
//   );

//   const [lineWidth, setLineWidth] = useState(8);
//   const [dotRadius, setDotRadius] = useState(3);
//   const [lineColor, setLineColor] = useState("#000000");
//   const [dotColor, setDotColor] = useState("#dc2626");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [analyzing, setAnalyzing] = useState(false);
//   // Update URL when parameters change
//   useEffect(() => {
//     updateURL({ size, duration: animationDuration, initialAutoAnimate });
//   }, [size, animationDuration, initialAutoAnimate]);

//   // Update duration when speed changes
//   useEffect(() => {
//     const newDuration = speedToDuration(animationSpeed);
//     setAnimationDuration(newDuration);
//   }, [animationSpeed]);

//   // Close download menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         showDownloadMenu &&
//         !(event.target as Element).closest(".download-menu")
//       ) {
//         setShowDownloadMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showDownloadMenu]);

//   // Handle animation end detection
//   useEffect(() => {
//     if (animationState === "playing" && currentPattern) {
//       const timer = setTimeout(() => {
//         setAnimationState("stopped");
//       }, animationDuration);

//       return () => clearTimeout(timer);
//     }
//   }, [animationState, currentPattern, animationDuration]);





//   // Convert animation speed (1-10) to total animation duration - kept for UI display
//   const getAnimationTiming = (speed: number) => {
//     return speedToDuration(speed);
//   };

//   const generatePattern = useCallback(() => {
//     console.log("🎯  kolam pattern generator ");

//     try {
//       console.log("📏  Kolam generating...");
//       const pattern = KolamGenerator.generateKolam1D(size);

//       console.log("✅  generated successfully:", pattern);
//       setCurrentPattern(pattern);
//       setAnimationState("stopped"); // Reset animation when generating new pattern

//       // Start animation after a brief delay if auto-animate is enabled
//       if (initialAutoAnimate) {
//         setTimeout(() => {
//           setAnimationState("playing");
//         }, 100);
//       }
//     } catch (error) {
//       console.error("❌ Error generating :", error);
//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       alert(`Error generating pattern: ${errorMessage}`);
//     }
//   }, [size, initialAutoAnimate]);

//   // Generate initial pattern on component mount
//   useEffect(() => {
//     generatePattern();
//   }, [generatePattern]);

//   const exportPattern = async (format: "svg" | "png" | "gif") => {
//     if (!currentPattern || !kolamRef.current) return;

//     setIsExporting(true);

//     try {
//       switch (format) {
//         case "svg":
//           await KolamExporter.downloadSVG(currentPattern);
//           break;
//         case "png":
//           await KolamExporter.downloadPNG(
//             kolamRef.current,
//             currentPattern.name
//           );
//           break;
//         case "gif":
//           await KolamExporter.downloadAnimatedGIF(
//             kolamRef.current,
//             currentPattern,
//             currentPattern.name,
//             { format: "gif", frameCount: 30, delay: animationDuration }
//           );
//           break;
//       }
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Export failed. Please try again.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const getEmbedCode = async () => {
//     if (!currentPattern) return;

//     try {
//       const embedURL = generateEmbedURL({
//         size,
//         background: "black", // Default amber-900 background
//         brush: "#ffffff", // Default white brush
//       });

//       const embedCode = `<img src="${embedURL}" alt="Kolam Pattern" style="max-width: 100%; height: auto;" />`;

//       await navigator.clipboard.writeText(embedCode);
//       alert("Embed to clipboard! This will display the kolam as an SVG image.");
//     } catch (error) {
//       console.error("Failed to generate embed code:", error);
//       alert("Failed to copy embed code. Please try again.");
//     }
//   };

//   // Add these handler functions
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const analyzePattern = async () => {
//     if (!uploadedImage) return;

//     setAnalyzing(true);
//     // Simulate analysis process
//     setTimeout(() => {
//       setAnalyzing(false);
//       // Set analysis results here
//     }, 2000);
//   };

//   const recreateDesign = () => {
//     if (!uploadedImage) return;
//     // Logic to recreate design from uploaded image
//     console.log("Recreating design from uploaded image...");
//   };

//   const copyRawSVG = async () => {
//     if (!currentPattern) return;

//     try {
//       const svgContent = await KolamExporter.exportAsSVG(currentPattern);
//       await navigator.clipboard.writeText(svgContent);
//       alert(
//         "Raw SVG code copied to clipboard! You can paste this directly into HTML or image editing software."
//       );
//     } catch (error) {
//       console.error("Failed to copy raw SVG:", error);
//       alert("Failed to copy raw SVG. Please try again.");
//     }
//   };






//   return (
//     <div className="kolam-editor bg-amber-300 text-black-800 min-h-screen border-bottom-4 border-blue-300 flex flex-col">
     
// 	  <div className="kolam-editor bg-amber-500 min-h-screen">
// 			{/* Header */}
// 			<header className="bg-gradient-to-r from-teal-600 to-green-500 text-white shadow-lg">
// 				<nav className="max-w-7xl mx-auto px-4 py-4">
// 					<div className="flex justify-between items-center">
// 						<div className="flex items-center space-x-4">
// 							<h1 className="text-2xl font-bold">Rangoli<span className="text-red-500">X</span></h1>
							
// 						</div>
// 						<div className="hidden md:flex space-x-6">
// 							<a href="#" className="hover:underline text-2xl">Home</a>
							
// 							{/* <a href="#" className="hover:underline text-2xl ">Kolam</a> */}
// 							<a href="#" className="hover:underline text-2xl">Culture & Heritage</a>
// 							<a href="#" className="hover:underline text-2xl">Mathematical Significance</a>
// 							<a href="#" className="hover:underline text-2xl">Analyse Kolam</a>
// 							<a href="#" className="hover:underline text-2xl">Gallery</a>
// 						</div>
// 					</div>
// 				</nav>
// 			</header>

// 			{/* Hero Section */}
// 			<section className="bg-gradient-to-br bg-white  py-16">
// 				<div className="max-w-7xl mx-auto px-4 text-center">
// 					<h2 className="text-5xl font-bold text-gray-800 mb-4">
// 						Rangoli<span className="text-red-600">X</span>
// 					</h2>
// 					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
// 						Symmetry, Culture, and Mathematics Reimagined
// 					</p>
// 					<p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
// 						Discover the profound beauty of Kolam art — ancient geometric patterns that weave together mathematics, spirituality, and cultural heritage into daily life across South India.
// 					</p>
					
// 					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
// 						<button className="bg-white border-2 border-teal-500 text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
// 							Analyse a Kolam
// 						</button>
// 						<button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
// 							Generate a Kolam
// 						</button>
// 						<button className="bg-white border-2 border-orange-500 text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
// 							Explore Digital Archive
// 						</button>
// 						<button className="bg-white border-2 border-purple-500 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
// 							Learn About Kolam
// 						</button>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Main Content */}
// 			<main className="max-w-7xl mx-auto px-4 py-12">
// 				{/* Kolam Display Section */}
// 				<section className="mb-16">
// 					<div className="kolam-display-area">
// 						{currentPattern ? (
// 							<div
// 								ref={kolamRef}
// 								className="kolam-container relative flex justify-center items-center bg-black border-4 border-white p-8 rounded-2xl shadow-lg"
// 							>
// 								<KolamDisplay
// 									pattern={currentPattern}
// 									animate={animationState === 'playing'}
// 									animationState={animationState}
// 									animationTiming={getAnimationTiming(animationSpeed)}
// 									className="kolam-main"
// 								/>

// 								{/* Save button overlaid on canvas */}
// 								{currentPattern && (
// 									<div className="absolute top-4 right-4">
// 										<div className="relative download-menu">
// 											{showDownloadMenu && (
// 												<div className="absolute right-0 mt-2 bg-amber-500 border-2 border-white rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
// 													<button
// 														onClick={() => { exportPattern('svg'); setShowDownloadMenu(false); }}
// 														className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
// 													>
// 														📄 Download SVG
// 													</button>
// 													<button
// 														onClick={() => { exportPattern('png'); setShowDownloadMenu(false); }}
// 														className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
// 													>
// 														🖼️ Download PNG
// 													</button>
// 													<hr className="my-1 border-white" />
// 													<button
// 														onClick={() => { getEmbedCode(); setShowDownloadMenu(false); }}
// 														className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
// 													>
// 														📋 Copy Embed Code
// 													</button>
// 													<button
// 														onClick={() => { copyRawSVG(); setShowDownloadMenu(false); }}
// 														className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
// 													>
// 														📄 Copy Raw SVG
// 													</button>
// 												</div>
// 											)}
// 											<button
// 												onClick={() => setShowDownloadMenu(!showDownloadMenu)}
// 												disabled={isExporting}
// 												className="p-3 bg-orange-500/80 border-2 text-white rounded-lg hover:bg-red-300/90 transition-colors disabled:opacity-50 shadow-lg backdrop-blur-sm"
// 												style={{ borderColor: '#ffffff', backgroundColor: 'blue' }}
// 												title="Download Options"
// 											>
// 												{isExporting ? '⏳' : '💾 SAVE'}
// 											</button>
// 										</div>
// 									</div>
// 								)}
// 							</div>
// 						) : (
// 							<div className="no-pattern text-center py-12 bg-black border-2 border-white rounded-2xl">
// 								<p className="text-amber-100 text-lg">
// 									Loading your first kolam...
// 								</p>
// 							</div>
// 						)}
// 					</div>
// 				</section>

// 				{/* Controls Section */}
// 				<section className="bg-orange-500 border-4 border-white rounded-2xl p-6 mb-12">
// 					<h2 className="text-xl font-semibold mb-4 text-amber-100 flex items-center">
// 						<span className="mr-2">⚙️</span>
// 						Kolam Parameters
// 					</h2>

// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// 						{/* Size Parameter */}
// 						<div className="parameter-group">
// 							<label htmlFor="size" className="block text-sm font-medium text-red-500 mb-2">
// 								Grid Size
// 							</label>
// 							<div className="flex items-center space-x-3">
// 								<input
// 									id="size"
// 									type="range"
// 									min="3"
// 									max="15"
// 									value={size}
// 									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSize(parseInt(e.target.value))}
// 									className="flex-1"
// 									style={{ accentColor: 'black' }}
// 								/>
// 								<div className="bg-blue-700 px-3 py-1 rounded text-white min-w-[3rem] text-center">
// 									{size}
// 								</div>
// 							</div>
// 							<div className="text-xs text-amber-100 mt-1">
// 								Creates a {size}x{size} pattern grid
// 							</div>
// 						</div>

// 						{/* Animation Speed Parameter */}
// 						<div className="parameter-group">
// 							<label htmlFor="animationSpeed" className="block text-sm font-medium text-amber-100 mb-2">
// 								Animation Duration
// 							</label>
// 							<div className="flex items-center space-x-3">
// 								<input
// 									id="animationSpeed"
// 									type="range"
// 									min="1"
// 									max="10"
// 									value={animationSpeed}
// 									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimationSpeed(parseInt(e.target.value))}
// 									className="flex-1"
// 									style={{ accentColor: '#000' }}
// 								/>
// 								<div className="bg-blue-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
// 									{animationSpeed}
// 								</div>
// 							</div>
// 							<div className="text-xs text-red-500 mt-1">
// 								Total: {(animationDuration / 1000).toFixed(1)}s
// 							</div>
// 						</div>

// 						{/* Auto-animate Parameter */}
// 						<div className="parameter-group">
// 							<label htmlFor="autoAnimate" className="block text-sm font-medium text-amber-100 mb-2">
// 								Auto-animate
// 							</label>
// 							<div className="flex items-center space-x-3">
// 								<label className="flex items-center cursor-pointer">
// 									<input
// 										id="autoAnimate"
// 										type="checkbox"
// 										checked={initialAutoAnimate}
// 										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialAutoAnimate(e.target.checked)}
// 										className="sr-only"
// 									/>
// 									<div className={`relative w-12 h-6 rounded-full transition-colors ${initialAutoAnimate ? 'bg-amber-400' : 'bg-blue-700'}`}>
// 										<div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${initialAutoAnimate ? 'translate-x-6' : 'translate-x-0'}`}></div>
// 									</div>
// 									<span className="ml-3 text-amber-100 font-medium">
// 										{initialAutoAnimate ? 'On' : 'Off'}
// 									</span>
// 								</label>
// 							</div>
// 							<div className="text-xs text-amber-100 mt-1">
// 								Auto-play animation on generate
// 							</div>
// 						</div> 
// 					</div>

// 					{/* Controls */}
// 					<div className="flex justify-center items-center gap-6">
// 						{currentPattern && (
// 							<button
// 								onClick={() => {
// 									if (animationState === 'playing') {
// 										setAnimationState('stopped');
// 									} else {
// 										setAnimationState('playing');
// 									}
// 								}}
// 								className="px-6 py-3 bg-blue-600 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg flex items-center gap-2"
// 								style={{ backgroundColor: animationState === 'playing' ? '#f0c75e' : undefined, color: animationState === 'playing' ? '#92400e' : undefined }}
// 								title={animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
// 							>
// 								{animationState === 'playing' ? '⏹️' : '▶️'}
// 								{animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
// 							</button>
// 						)}

// 						<button
// 							onClick={() => generatePattern()}
// 							className="px-8 py-3 border-2 border-white text-white rounded-lg hover:opacity-40 bg-emerald-100 transition-colors font-medium shadow-lg"
// 							style={{ backgroundColor: 'green' }}
// 						>
// 							Generate Kolam
// 						</button>
// 					</div>
// 				</section>

// 				{/* Kolam Analyzer Section */}
// 				<section className="bg-gradient-to-br from-bg-orange-500 to-red-600 border-4 border-white rounded-2xl p-6 mb-12">
// 					<h2 className="text-2xl font-bold mb-6 text-white flex items-center justify-center">
// 						<span className="mr-3 text-3xl">🔍</span>
// 						Kolam Analyzer & Generator
// 					</h2>

// 					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						
// 						{/* Left Column - Image Upload & Analysis */}
// 						<div className="space-y-6">
// 							{/* Upload Section */}
// 							<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
// 								<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
// 									<span className="mr-2">📤</span>
// 									Upload Kolam Image
// 								</h3>
								
// 								{/* Upload Area */}
// 								<div className="border-3 border-dashed border-white/40 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer mb-4">
// 									<input
// 										type="file"
// 										accept="image/*"
// 										onChange={handleImageUpload}
// 										className="hidden"
// 										id="kolam-upload"
// 									/>
// 									<label htmlFor="kolam-upload" className="cursor-pointer flex flex-col items-center justify-center">
// 										{uploadedImage ? (
// 											<>
// 												<div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden border-2 border-yellow-400">
// 													<img 
// 														src={uploadedImage} 
// 														alt="Uploaded kolam" 
// 														className="w-full h-full object-cover"
// 													/>
// 												</div>
// 												<span className="text-white font-semibold">Image Uploaded!</span>
// 												<span className="text-yellow-300 text-sm mt-1">Click to change</span>
// 											</>
// 										) : (
// 											<>
// 												<span className="text-5xl mb-3">📁</span>
// 												<span className="text-white font-semibold">Drag & drop or click to upload</span>
// 												<span className="text-white/70 text-sm mt-2">PNG, JPG, WEBP up to 10MB</span>
// 											</>
// 										)}
// 									</label>
// 								</div>

// 								{/* Action Buttons */}
// 								<div className="flex gap-3">
// 									<button
// 										onClick={analyzePattern}
// 										disabled={!uploadedImage || analyzing}
// 										className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
// 									>
// 										<span>🔍</span>
// 										{analyzing ? 'Analyzing...' : 'Analyze Image'}
// 									</button>
// 									<button
// 										onClick={recreateDesign}
// 										disabled={!uploadedImage}
// 										className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
// 									>
// 										<span>🎨</span>
// 										Recreate Design
// 									</button>
// 								</div>
// 							</div>

// 							{/* Analysis Results */}
// 							<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
// 								<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
// 									<span className="mr-2">📊</span>
// 									Analysis Results
// 								</h3>
								
// 								<div className="grid grid-cols-2 gap-4">
// 									<div className="bg-black/30 rounded-lg p-4 text-center">
// 										<div className="text-2xl text-yellow-400 mb-1">•</div>
// 										<div className="text-white/70 text-sm">Dot Count</div>
// 										<div className="text-white font-bold text-lg">390</div>
// 									</div>
// 									<div className="bg-black/30 rounded-lg p-4 text-center">
// 										<div className="text-2xl text-blue-400 mb-1">↻</div>
// 										<div className="text-white/70 text-sm">Contour Count</div>
// 										<div className="text-white font-bold text-lg">68</div>
// 									</div>
// 									<div className="bg-black/30 rounded-lg p-4 text-center">
// 										<div className="text-2xl text-green-400 mb-1">⧉</div>
// 										<div className="text-white/70 text-sm">Grid Size</div>
// 										<div className="text-white font-bold text-lg">6×9</div>
// 									</div>
// 									<div className="bg-black/30 rounded-lg p-4 text-center">
// 										<div className="text-2xl text-red-400 mb-1">⇄</div>
// 										<div className="text-white/70 text-sm">Symmetric</div>
// 										<div className="text-green-400 font-bold text-lg">Yes</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Right Column - Customization & Parameters */}
// 						<div className="space-y-6">
// 							{/* Customization Controls */}
// 							<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
// 								<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
// 									<span className="mr-2">🎨</span>
// 									Design Customization
// 								</h3>
								
// 								<div className="space-y-4">
// 									{/* Line Color */}
// 									<div className="flex items-center justify-between">
// 										<span className="text-white font-medium">Line Color:</span>
// 										<div className="flex items-center gap-3">
// 											<input 
// 												type="color" 
// 												value={lineColor}
// 												onChange={(e) => setLineColor(e.target.value)}
// 												className="w-10 h-10 rounded-lg border-2 border-white cursor-pointer"
// 											/>
// 											<div className="w-6 h-6 rounded border border-white" style={{backgroundColor: lineColor}}></div>
// 										</div>
// 									</div>

// 									{/* Dot Color */}
// 									<div className="flex items-center justify-between">
// 										<span className="text-white font-medium">Dot Color:</span>
// 										<div className="flex items-center gap-3">
// 											<input 
// 												type="color" 
// 												value={dotColor}
// 												onChange={(e) => setDotColor(e.target.value)}
// 												className="w-10 h-10 rounded-lg border-2 border-white cursor-pointer"
// 											/>
// 											<div className="w-6 h-6 rounded border border-white" style={{backgroundColor: dotColor}}></div>
// 										</div>
// 									</div>

// 									{/* Line Width */}
// 									<div className="flex items-center justify-between">
// 										<span className="text-white font-medium">Line Width:</span>
// 										<div className="flex items-center gap-3">
// 											<input 
// 												type="range" 
// 												min="1" 
// 												max="15" 
// 												value={lineWidth}
// 												onChange={(e) => setLineWidth(parseInt(e.target.value))}
// 												className="w-32 accent-yellow-400"
// 											/>
// 											<span className="text-white font-bold w-8 text-center">{lineWidth}</span>
// 										</div>
// 									</div>

// 									{/* Dot Radius */}
// 									<div className="flex items-center justify-between">
// 										<span className="text-white font-medium">Dot Radius:</span>
// 										<div className="flex items-center gap-3">
// 											<input 
// 												type="range" 
// 												min="1" 
// 												max="10" 
// 												value={dotRadius}
// 												onChange={(e) => setDotRadius(parseInt(e.target.value))}
// 												className="w-32 accent-yellow-400"
// 											/>
// 											<span className="text-white font-bold w-8 text-center">{dotRadius}</span>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>



























// 						{/* Analysis Features */}
//             <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-2xl font-semibold mb-6 text-center">
//                 Analysis Features
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white/20 p-2 rounded-lg">
//                     <span className="text-xl">⧉</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-lg mb-1">Symmetry Detection</h4>
//                     <p className="text-white/90 text-sm">
//                       Identifies rotational, reflectional, and translational symmetries
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white/20 p-2 rounded-lg">
//                     <span className="text-xl">•</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-lg mb-1">Pattern Analysis</h4>
//                     <p className="text-white/90 text-sm">
//                       Analyzes dot grids, line patterns, and geometric structures
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white/20 p-2 rounded-lg">
//                     <span className="text-xl">π</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-lg mb-1">Mathematical Insights</h4>
//                     <p className="text-white/90 text-sm">
//                       Provides mathematical properties and topological information
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white/20 p-2 rounded-lg">
//                     <span className="text-xl">🏛️</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-lg mb-1">Cultural Context</h4>
//                     <p className="text-white/90 text-sm">
//                       Explains cultural significance and traditional usage
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>






// 					</div>
// 				</section>

// 				{/* About Section */}
// 				<section className="bg-white rounded-2xl p-8 shadow-lg mb-12">
// 					<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About This Project</h2>
// 					<p className="text-lg text-gray-700 mb-6 text-center">
// 						This project explores the traditional art of Kolam — a cultural practice of South India blending art, ingenuity, and mathematics. The goal is to study its design principles, recreate Kolam using computer programs, and preserve its heritage through modern technology.
// 					</p>
// 					<p className="text-lg text-gray-700 mb-8 text-center">
// 						Kolams (also called Muggu, Rangoli, Rangavalli) are significant cultural traditions of India, blending art, ingenuity, and culture. The challenge is to capture their mathematical, symmetrical, and cultural essence in a programmatic and visual way.
// 					</p>
					
// 					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// 						<div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-center">
// 							<h3 className="text-xl font-semibold text-amber-800 mb-3">Research & Analysis</h3>
// 							<p className="text-gray-700">Study traditional design principles and mathematical foundations of Kolam patterns</p>
// 						</div>
// 						<div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
// 							<h3 className="text-xl font-semibold text-green-800 mb-3">Digital Recreation</h3>
// 							<p className="text-gray-700">Develop computer programs to recreate and generate authentic Kolam designs</p>
// 						</div>
// 						<div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
// 							<h3 className="text-xl font-semibold text-blue-800 mb-3">Heritage Preservation</h3>
// 							<p className="text-gray-700">Preserve cultural knowledge through modern technology and digital archives</p>
// 						</div>
// 					</div>
// 				</section>

// 				{/* Explore Dimensions Section */}
// 				<section className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl p-8 shadow-lg">
// 					<h2 className="text-3xl font-bold mb-8 text-center">Explore Kolam Dimensions</h2>
// 					<p className="text-xl text-center mb-12 opacity-90">
// 						Discover how this ancient art form connects mathematics, spirituality, and cultural heritage
// 					</p>
					
// 					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// 						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
// 							<h3 className="text-xl font-semibold mb-4">Sacred Geometry</h3>
// 							<p className="opacity-90">Explore the mathematical precision and spiritual symbolism embedded in every Kolam pattern.</p>
// 						</div>
// 						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
// 							<h3 className="text-xl font-semibold mb-4">Cultural Heritage</h3>
// 							<p className="opacity-90">Discover how Kolam connects generations through festivals, rituals, and daily traditions.</p>
// 						</div>
// 						<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
// 							<h3 className="text-xl font-semibold mb-4">Traditional Methods</h3>
// 							<p className="opacity-90">Uncover the algorithmic thinking and geometric principles that govern traditional patterns.</p>
// 						</div>
// 					</div>
// 				</section>
// 			</main>

// 			{/* Footer */}
// 			<footer className="bg-gray-800 text-white py-8">
// 				<div className="max-w-7xl mx-auto px-4 text-center">
// 					<div className="flex justify-center items-center gap-6 mb-4">
// 						<a
// 							href="https://www.linkedin.com/"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 							className="hover:opacity-75 transition-opacity flex items-center gap-2"
// 							title="LinkedIn"
// 						>
// 							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
// 								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
// 							</svg>
// 							<span className="text-sm">LinkedIn</span>
// 						</a>
// 						<a
// 							href="https://github.com/"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 							className="hover:opacity-75 transition-opacity flex items-center gap-2"
// 							title="GitHub"
// 						>
// 							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
// 								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
// 							</svg>
// 							<span className="text-sm">GitHub</span>
// 						</a>
// 					</div>
// 					<p className="text-gray-400 text-sm">
// 						© 2025 Kolam Heritage Project. Preserving traditional art through modern technology.
// 					</p>
// 				</div>
// 			</footer>
// 		</div>





























    
          
        
    













//     </div>
//   );
// };




// import React, { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
// import { KolamPattern } from "@/types/kolam";
// import { KolamExporter } from "@/utils/kolamExporter";
// import { KolamGenerator } from "@/utils/kolamGenerator";
// import {
//   durationToSpeed,
//   generateEmbedURL,
//   speedToDuration,
//   updateURL,
//   useKolamURLParams,
// } from "@/utils/urlParams";
// import { KolamDisplay } from "./KolamDisplay";

// interface AnalysisResults {
//   symmetry: string;
//   dotGrid: string;
//   geometricStructures: string;
//   mathematicalProperties: string;
//   culturalSignificance: string;
// }

// export const KolamEditor: React.FC = () => {
//   // State declarations with TypeScript types
//   const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(null);
//   const [isExporting, setIsExporting] = useState(false);
//   const [showDownloadMenu, setShowDownloadMenu] = useState(false);
//   const [animationState, setAnimationState] = useState<"stopped" | "playing" | "paused">("stopped");
  
//   const [lineWidth, setLineWidth] = useState(8);
//   const [dotRadius, setDotRadius] = useState(3);
//   const [lineColor, setLineColor] = useState("#000000");
//   const [dotColor, setDotColor] = useState("#dc2626");
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [analyzing, setAnalyzing] = useState(false);
  
//   // Input method state
//   const [selectedMethod, setSelectedMethod] = useState<"upload" | "draw">("upload");
//   const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

//   // Refs
//   const kolamRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   // Get URL parameters
//   const urlParams = useKolamURLParams();
//   const [size, setSize] = useState(urlParams.size);
//   const [animationSpeed, setAnimationSpeed] = useState(durationToSpeed(urlParams.duration));
//   const [animationDuration, setAnimationDuration] = useState(urlParams.duration);
//   const [initialAutoAnimate, setInitialAutoAnimate] = useState(urlParams.initialAutoAnimate);

//   // Update URL when parameters change
//   useEffect(() => {
//     updateURL({ size, duration: animationDuration, initialAutoAnimate });
//   }, [size, animationDuration, initialAutoAnimate]);

//   // Update duration when speed changes
//   useEffect(() => {
//     const newDuration = speedToDuration(animationSpeed);
//     setAnimationDuration(newDuration);
//   }, [animationSpeed]);

//   // Close download menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         showDownloadMenu &&
//         !(event.target as Element).closest(".download-menu")
//       ) {
//         setShowDownloadMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showDownloadMenu]);

//   // Handle animation end detection
//   useEffect(() => {
//     if (animationState === "playing" && currentPattern) {
//       const timer = setTimeout(() => {
//         setAnimationState("stopped");
//       }, animationDuration);

//       return () => clearTimeout(timer);
//     }
//   }, [animationState, currentPattern, animationDuration]);

//   // Convert animation speed (1-10) to total animation duration
//   const getAnimationTiming = (speed: number) => {
//     return speedToDuration(speed);
//   };

//   const generatePattern = useCallback(() => {
//     console.log("🎯  kolam pattern generator ");

//     try {
//       console.log("📏  Kolam generating...");
//       const pattern = KolamGenerator.generateKolam1D(size);

//       console.log("✅  generated successfully:", pattern);
//       setCurrentPattern(pattern);
//       setAnimationState("stopped"); // Reset animation when generating new pattern

//       // Start animation after a brief delay if auto-animate is enabled
//       if (initialAutoAnimate) {
//         setTimeout(() => {
//           setAnimationState("playing");
//         }, 100);
//       }
//     } catch (error) {
//       console.error("❌ Error generating :", error);
//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       alert(`Error generating pattern: ${errorMessage}`);
//     }
//   }, [size, initialAutoAnimate]);

//   // Generate initial pattern on component mount
//   useEffect(() => {
//     generatePattern();
//   }, [generatePattern]);

//   const exportPattern = async (format: "svg" | "png" | "gif") => {
//     if (!currentPattern || !kolamRef.current) return;

//     setIsExporting(true);

//     try {
//       switch (format) {
//         case "svg":
//           await KolamExporter.downloadSVG(currentPattern);
//           break;
//         case "png":
//           await KolamExporter.downloadPNG(
//             kolamRef.current,
//             currentPattern.name
//           );
//           break;
//         case "gif":
//           await KolamExporter.downloadAnimatedGIF(
//             kolamRef.current,
//             currentPattern,
//             currentPattern.name,
//             { format: "gif", frameCount: 30, delay: animationDuration }
//           );
//           break;
//       }
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Export failed. Please try again.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const getEmbedCode = async () => {
//     if (!currentPattern) return;

//     try {
//       const embedURL = generateEmbedURL({
//         size,
//         background: "black",
//         brush: "#ffffff",
//       });

//       const embedCode = `<img src="${embedURL}" alt="Kolam Pattern" style="max-width: 100%; height: auto;" />`;

//       await navigator.clipboard.writeText(embedCode);
//       alert("Embed to clipboard! This will display the kolam as an SVG image.");
//     } catch (error) {
//       console.error("Failed to generate embed code:", error);
//       alert("Failed to copy embed code. Please try again.");
//     }
//   };

//   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     handleImageUpload(event);
//   };

//   const analyzePattern = async () => {
//     if (!uploadedImage) return;

//     setAnalyzing(true);
//     // Simulate analysis process
//     setTimeout(() => {
//       setAnalyzing(false);
//       setAnalysisResults({
//         symmetry: "Rotational symmetry detected (4-fold)",
//         dotGrid: "7x7 dot grid with interlocking patterns",
//         geometricStructures: "Complex looping patterns with multiple intersections",
//         mathematicalProperties: "Eulerian path detected, topological genus: 1",
//         culturalSignificance: "Traditional South Indian design for festivals"
//       });
//     }, 2000);
//   };

//   const recreateDesign = () => {
//     if (!uploadedImage) return;
//     console.log("Recreating design from uploaded image...");
//   };

//   const copyRawSVG = async () => {
//     if (!currentPattern) return;

//     try {
//       const svgContent = await KolamExporter.exportAsSVG(currentPattern);
//       await navigator.clipboard.writeText(svgContent);
//       alert(
//         "Raw SVG code copied to clipboard! You can paste this directly into HTML or image editing software."
//       );
//     } catch (error) {
//       console.error("Failed to copy raw SVG:", error);
//       alert("Failed to copy raw SVG. Please try again.");
//     }
//   };

//   // Drawing functions
//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!canvasRef.current) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setIsDrawing(true);
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing || !canvasRef.current) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const clearCanvas = () => {
//     if (!canvasRef.current) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   return (
//     <div className="kolam-editor bg-amber-300 text-black-800 min-h-screen border-bottom-4 border-blue-300 flex flex-col">
//       <div className="kolam-editor bg-amber-500 min-h-screen">
//         {/* Header */}
//         <header className="bg-gradient-to-r from-teal-600 to-green-500 text-white shadow-lg">
//           <nav className="max-w-7xl mx-auto px-4 py-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-2xl font-bold">Rangoli<span className="text-red-500">X</span></h1>
//               </div>
//               <div className="hidden md:flex space-x-6">
//                 <a href="#" className="hover:underline text-2xl">Home</a>
//                 {/* <a href="#" className="hover:underline text-2xl">Culture & Heritage</a> */}
//                 <a href="#" className="hover:underline text-2xl">Mathematical Significance</a>
//                 <a href="#" className="hover:underline text-2xl">Analyse Kolam</a>
//                 <a href="#" className="hover:underline text-2xl"></a>
//               </div>
//             </div>
//           </nav>
//         </header>

//         {/* Hero Section */}
//         <section className="bg-gradient-to-br bg-white py-16">
//           <div className="max-w-7xl mx-auto px-4 text-center">
//             <h2 className="text-5xl font-bold text-gray-800 mb-4">
//               Rangoli<span className="text-red-600">X</span>
//             </h2>
//             <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//               Symmetry, Culture, and Mathematics Reimagined
//             </p>
//             <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
//               Discover the profound beauty of Kolam art — ancient geometric patterns that weave together mathematics, spirituality, and cultural heritage into daily life across South India.
//             </p>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
//               <button className="bg-white border-2 border-teal-500 text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
//                 Analyse a Kolam
//               </button>
//               <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
//                 Generate a Kolam
//               </button>
//               <button className="bg-white border-2 border-orange-500 text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
//                 Explore Digital Archive
//               </button>
//               <button className="bg-white border-2 border-purple-500 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
//                 Learn About Kolam
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Main Content */}
//         <main className="max-w-7xl mx-auto px-4 py-12">
//           {/* Kolam Display Section */}
//           <section className="mb-16">
//             <div className="kolam-display-area">
//               {currentPattern ? (
//                 <div
//                   ref={kolamRef}
//                   className="kolam-container relative flex justify-center items-center bg-black border-4 border-white p-8 rounded-2xl shadow-lg"
//                 >
//                   <KolamDisplay
//                     pattern={currentPattern}
//                     animate={animationState === 'playing'}
//                     animationState={animationState}
//                     animationTiming={getAnimationTiming(animationSpeed)}
//                     className="kolam-main"
//                   />

//                   {/* Save button overlaid on canvas */}
//                   {currentPattern && (
//                     <div className="absolute top-4 right-4">
//                       <div className="relative download-menu">
//                         {showDownloadMenu && (
//                           <div className="absolute right-0 mt-2 bg-amber-500 border-2 border-white rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
//                             <button
//                               onClick={() => { exportPattern('svg'); setShowDownloadMenu(false); }}
//                               className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
//                             >
//                               📄 Download SVG
//                             </button>
//                             <button
//                               onClick={() => { exportPattern('png'); setShowDownloadMenu(false); }}
//                               className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
//                             >
//                               🖼️ Download PNG
//                             </button>
//                             <hr className="my-1 border-white" />
//                             <button
//                               onClick={() => { getEmbedCode(); setShowDownloadMenu(false); }}
//                               className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
//                             >
//                               📋 Copy Embed Code
//                             </button>
//                             <button
//                               onClick={() => { copyRawSVG(); setShowDownloadMenu(false); }}
//                               className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
//                             >
//                               📄 Copy Raw SVG
//                             </button>
//                           </div>
//                         )}
//                         <button
//                           onClick={() => setShowDownloadMenu(!showDownloadMenu)}
//                           disabled={isExporting}
//                           className="p-3 bg-orange-500/80 border-2 text-white rounded-lg hover:bg-red-300/90 transition-colors disabled:opacity-50 shadow-lg backdrop-blur-sm"
//                           style={{ borderColor: '#ffffff', backgroundColor: 'blue' }}
//                           title="Download Options"
//                         >
//                           {isExporting ? '⏳' : '💾 SAVE'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="no-pattern text-center py-12 bg-black border-2 border-white rounded-2xl">
//                   <p className="text-amber-100 text-lg">
//                     Loading your first kolam...
//                   </p>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Controls Section */}
//           <section className="bg-orange-500 border-4 border-white rounded-2xl p-6 mb-12">
//             <h2 className="text-xl font-semibold mb-4 text-amber-100 flex items-center">
//               <span className="mr-2">⚙️</span>
//               Kolam Parameters
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Size Parameter */}
//               <div className="parameter-group">
//                 <label htmlFor="size" className="block text-sm font-medium text-red-500 mb-2">
//                   Grid Size
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <input
//                     id="size"
//                     type="range"
//                     min="3"
//                     max="15"
//                     value={size}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSize(parseInt(e.target.value))}
//                     className="flex-1"
//                     style={{ accentColor: 'black' }}
//                   />
//                   <div className="bg-blue-700 px-3 py-1 rounded text-white min-w-[3rem] text-center">
//                     {size}
//                   </div>
//                 </div>
//                 <div className="text-xs text-amber-100 mt-1">
//                   Creates a {size}x{size} pattern grid
//                 </div>
//               </div>

//               {/* Animation Speed Parameter */}
//               <div className="parameter-group">
//                 <label htmlFor="animationSpeed" className="block text-sm font-medium text-amber-100 mb-2">
//                   Animation Duration
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <input
//                     id="animationSpeed"
//                     type="range"
//                     min="1"
//                     max="10"
//                     value={animationSpeed}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimationSpeed(parseInt(e.target.value))}
//                     className="flex-1"
//                     style={{ accentColor: '#000' }}
//                   />
//                   <div className="bg-blue-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
//                     {animationSpeed}
//                   </div>
//                 </div>
//                 <div className="text-xs text-red-500 mt-1">
//                   Total: {(animationDuration / 1000).toFixed(1)}s
//                 </div>
//               </div>

//               {/* Auto-animate Parameter */}
//               <div className="parameter-group">
//                 <label htmlFor="autoAnimate" className="block text-sm font-medium text-amber-100 mb-2">
//                   Auto-animate
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       id="autoAnimate"
//                       type="checkbox"
//                       checked={initialAutoAnimate}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialAutoAnimate(e.target.checked)}
//                       className="sr-only"
//                     />
//                     <div className={`relative w-12 h-6 rounded-full transition-colors ${initialAutoAnimate ? 'bg-amber-400' : 'bg-blue-700'}`}>
//                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${initialAutoAnimate ? 'translate-x-6' : 'translate-x-0'}`}></div>
//                     </div>
//                     <span className="ml-3 text-amber-100 font-medium">
//                       {initialAutoAnimate ? 'On' : 'Off'}
//                     </span>
//                   </label>
//                 </div>
//                 <div className="text-xs text-amber-100 mt-1">
//                   Auto-play animation on generate
//                 </div>
//               </div> 
//             </div>

//             {/* Controls */}
//             <div className="flex justify-center items-center gap-6">
//               {currentPattern && (
//                 <button
//                   onClick={() => {
//                     if (animationState === 'playing') {
//                       setAnimationState('stopped');
//                     } else {
//                       setAnimationState('playing');
//                     }
//                   }}
//                   className="px-6 py-3 bg-blue-600 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg flex items-center gap-2"
//                   style={{ backgroundColor: animationState === 'playing' ? '#f0c75e' : undefined, color: animationState === 'playing' ? '#92400e' : undefined }}
//                   title={animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
//                 >
//                   {animationState === 'playing' ? '⏹️' : '▶️'}
//                   {animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
//                 </button>
//               )}

//               <button
//                 onClick={() => generatePattern()}
//                 className="px-8 py-3 border-2 border-white text-white rounded-lg hover:opacity-40 bg-emerald-100 transition-colors font-medium shadow-lg"
//                 style={{ backgroundColor: 'green' }}
//               >
//                 Generate Kolam
//               </button>
//             </div>
//           </section>

//           {/* Kolam Analyzer Section */}
//           <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
//             <div className="max-w-6xl mx-auto">
//               {/* Header */}
//               <div className="text-center mb-12">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-4">
//                   Kolam Input Methods
//                 </h1>
//                 <p className="text-xl text-gray-600">
//                   Choose how you want to provide your Kolam pattern for analysis
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//                 {/* Left Column - Input Methods */}
//                 <div className="space-y-8">
//                   {/* Method Selection */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//                       Choose Input Method
//                     </h2>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <button
//                         onClick={() => setSelectedMethod('upload')}
//                         className={`p-6 rounded-xl border-2 transition-all duration-300 ${
//                           selectedMethod === 'upload'
//                             ? 'border-teal-500 bg-teal-50 text-teal-700'
//                             : 'border-gray-200 bg-white text-gray-600 hover:border-teal-300'
//                         }`}
//                       >
//                         <div className="text-4xl mb-3">📤</div>
//                         <h3 className="font-semibold text-lg mb-2">Upload Image</h3>
//                         <p className="text-sm opacity-75">Use existing Kolam images</p>
//                       </button>

//                       <button
//                         onClick={() => setSelectedMethod('draw')}
//                         className={`p-6 rounded-xl border-2 transition-all duration-300 ${
//                           selectedMethod === 'draw'
//                             ? 'border-orange-500 bg-orange-50 text-orange-700'
//                             : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
//                         }`}
//                       >
//                         <div className="text-4xl mb-3">✏️</div>
//                         <h3 className="font-semibold text-lg mb-2">Draw Pattern</h3>
//                         <p className="text-sm opacity-75">Create your own design</p>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Upload Section */}
//                   {selectedMethod === 'upload' && (
//                     <div className="bg-white rounded-2xl shadow-lg p-6">
//                       <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                         <span className="mr-3">🖼️</span>
//                         Upload Kolam Image
//                       </h3>
                      
//                       <p className="text-gray-600 mb-4">
//                         Support for JPG, PNG, and other common image formats
//                       </p>

//                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={handleFileUpload}
//                           accept="image/*"
//                           className="hidden"
//                           id="kolam-upload"
//                         />
//                         <label
//                           htmlFor="kolam-upload"
//                           className="cursor-pointer flex flex-col items-center justify-center"
//                         >
//                           <div className="text-5xl mb-4">📁</div>
//                           <p className="text-gray-700 font-semibold mb-2">Choose File</p>
//                           <p className="text-gray-500 text-sm">Click to browse or drag and drop</p>
//                         </label>
//                       </div>

//                       {uploadedImage && (
//                         <div className="mt-4">
//                           <h4 className="font-semibold text-gray-700 mb-2">Preview:</h4>
//                           <img
//                             src={uploadedImage}
//                             alt="Uploaded kolam"
//                             className="w-full max-w-md mx-auto rounded-lg shadow-md"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Draw Section */}
//                   {selectedMethod === 'draw' && (
//                     <div className="bg-white rounded-2xl shadow-lg p-6">
//                       <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                         <span className="mr-3">🎨</span>
//                         Draw Your Kolam Pattern
//                       </h3>

//                       <div className="border-2 border-gray-200 rounded-xl p-4 mb-4">
//                         <canvas
//                           ref={canvasRef}
//                           width={400}
//                           height={400}
//                           className="w-full h-96 bg-white border border-gray-300 rounded cursor-crosshair"
//                           onMouseDown={startDrawing}
//                           onMouseMove={draw}
//                           onMouseUp={stopDrawing}
//                           onMouseLeave={stopDrawing}
//                         />
//                       </div>

//                       <div className="flex gap-3">
//                         <button
//                           onClick={clearCanvas}
//                           className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
//                         >
//                           Clear Canvas
//                         </button>
//                         <button
//                           onClick={analyzePattern}
//                           className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
//                         >
//                           Analyze Drawing
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Right Column - Analysis Results */}
//                 <div className="space-y-8">
//                   {/* Analysis Results Card */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                       <span className="mr-3">📊</span>
//                       Analysis Results
//                     </h2>

//                     {analyzing ? (
//                       <div className="text-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
//                         <p className="text-gray-600">Analyzing your Kolam pattern...</p>
//                       </div>
//                     ) : analysisResults ? (
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 gap-4">
//                           <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
//                             <h4 className="font-semibold text-amber-800 mb-2">Symmetry Detection</h4>
//                             <p className="text-amber-700">{analysisResults.symmetry}</p>
//                           </div>
                          
//                           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
//                             <h4 className="font-semibold text-blue-800 mb-2">Pattern Analysis</h4>
//                             <p className="text-blue-700">{analysisResults.dotGrid}</p>
//                             <p className="text-blue-700 mt-1">{analysisResults.geometricStructures}</p>
//                           </div>
                          
//                           <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
//                             <h4 className="font-semibold text-green-800 mb-2">Mathematical Insights</h4>
//                             <p className="text-green-700">{analysisResults.mathematicalProperties}</p>
//                           </div>
                          
//                           <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
//                             <h4 className="font-semibold text-purple-800 mb-2">Cultural Context</h4>
//                             <p className="text-purple-700">{analysisResults.culturalSignificance}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-12 bg-gray-50 rounded-xl">
//                         <div className="text-6xl mb-4">🔍</div>
//                         <p className="text-gray-600 text-lg">
//                           Upload an image or draw a pattern to see analysis results
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Analysis Features */}
//                   <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl shadow-lg p-6">
//                     <h2 className="text-2xl font-semibold mb-6 text-center">
//                       Analysis Features
//                     </h2>

//                     <div className="space-y-4">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white/20 p-2 rounded-lg">
//                           <span className="text-xl">⧉</span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-lg mb-1">Symmetry Detection</h4>
//                           <p className="text-white/90 text-sm">
//                             Identifies rotational, reflectional, and translational symmetries
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white/20 p-2 rounded-lg">
//                           <span className="text-xl">•</span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-lg mb-1">Pattern Analysis</h4>
//                           <p className="text-white/90 text-sm">
//                             Analyzes dot grids, line patterns, and geometric structures
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white/20 p-2 rounded-lg">
//                           <span className="text-xl">π</span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-lg mb-1">Mathematical Insights</h4>
//                           <p className="text-white/90 text-sm">
//                             Provides mathematical properties and topological information
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-4">
//                         <div className="bg-white/20 p-2 rounded-lg">
//                           <span className="text-xl">🏛️</span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-lg mb-1">Cultural Context</h4>
//                           <p className="text-white/90 text-sm">
//                             Explains cultural significance and traditional usage
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="text-center">
//                 {selectedMethod === 'upload' && uploadedImage && (
//                   <button
//                     onClick={analyzePattern}
//                     disabled={analyzing}
//                     className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
//                   >
//                     {analyzing ? 'Analyzing...' : 'Analyze Uploaded Image'}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>
// 		  <br />
// 		  <section className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl p-8 shadow-lg">
//             <h2 className="text-3xl font-bold mb-8 text-center">Explore Kolam Dimensions</h2>
//             <p className="text-xl text-center mb-12 opacity-90">
//               Discover how this ancient art form connects mathematics, spirituality, and cultural heritage
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
//                 <h3 className="text-xl font-semibold mb-4">Sacred Geometry</h3>
//                 <p className="opacity-90">Explore the mathematical precision and spiritual symbolism embedded in every Kolam pattern.</p>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
//                 <h3 className="text-xl font-semibold mb-4">Cultural Heritage</h3>
//                 <p className="opacity-90">Discover how Kolam connects generations through festivals, rituals, and daily traditions.</p>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
//                 <h3 className="text-xl font-semibold mb-4">Traditional Methods</h3>
//                 <p className="opacity-90">Uncover the algorithmic thinking and geometric principles that govern traditional patterns.</p>
//               </div>
//             </div>
//           </section><br/>

//           {/* About Section */}
//           <section className="bg-white rounded-2xl p-8 shadow-lg mb-12">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About This Project</h2>
//             <p className="text-lg text-gray-700 mb-6 text-center">
//               This project explores the traditional art of Kolam — a cultural practice of South India blending art, ingenuity, and mathematics. The goal is to study its design principles, recreate Kolam using computer programs, and preserve its heritage through modern technology.
//             </p>
//             <p className="text-lg text-gray-700 mb-8 text-center">
//               Kolams (also called Muggu, Rangoli, Rangavalli) are significant cultural traditions of India, blending art, ingenuity, and culture. The challenge is to capture their mathematical, symmetrical, and cultural essence in a programmatic and visual way.
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-center">
//                 <h3 className="text-xl font-semibold text-amber-800 mb-3">Research & Analysis</h3>
//                 <p className="text-gray-700">Study traditional design principles and mathematical foundations of Kolam patterns</p>
//               </div>
//               <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
//                 <h3 className="text-xl font-semibold text-green-800 mb-3">Digital Recreation</h3>
//                 <p className="text-gray-700">Develop computer programs to recreate and generate authentic Kolam designs</p>
//               </div>
//               <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
//                 <h3 className="text-xl font-semibold text-blue-800 mb-3">Heritage Preservation</h3>
//                 <p className="text-gray-700">Preserve cultural knowledge through modern technology and digital archives</p>
//               </div>
//             </div>
//           </section>

//           {/* Explore Dimensions Section */}
          
//         </main>

//         {/* Footer */}
//         <footer className="bg-gray-800 text-white py-8">
//           <div className="max-w-7xl mx-auto px-4 text-center">
//             <div className="flex justify-center items-center gap-6 mb-4">
//               <a
//                 href="https://www.linkedin.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:opacity-75 transition-opacity flex items-center gap-2"
//                 title="LinkedIn"
//               >
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                 </svg>
//                 <span className="text-sm">LinkedIn</span>
//               </a>
//               <a
//                 href="https://github.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:opacity-75 transition-opacity flex items-center gap-2"
//                 title="GitHub"
//               >
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                 </svg>
//                 <span className="text-sm">GitHub</span>
//               </a>
//             </div>
//             <p className="text-gray-400 text-sm">
//               © 2025 Kolam Heritage Project. Preserving traditional art through modern technology.
//             </p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };



// export default KolamEditor;  const clearCanvas = () => {
// 	const canvas = canvasRef.current;
// 	if (!canvas) return;
// 	const ctx = canvas.getContext('2d');
// 	if (!ctx) return;			
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	setAnalysisResults(null);
//   };

// function setAnalysisResults(arg0: null) {
// 	throw new Error("Function not implemented.");
// }



"use client";

import React, { useCallback, useEffect, useRef, useState, ChangeEvent } from "react";
import { KolamPattern } from "@/types/kolam";
import { KolamExporter } from "@/utils/kolamExporter";
import { KolamGenerator } from "@/utils/kolamGenerator";
import {
  durationToSpeed,
  generateEmbedURL,
  speedToDuration,
  updateURL,
  useKolamURLParams,
} from "@/utils/urlParams";
import { KolamDisplay } from "./KolamDisplay";

interface AnalysisResults {
  symmetry: string;
  dotGrid: string;
  geometricStructures: string;
  mathematicalProperties: string;
  culturalSignificance: string;
}

export const KolamEditor: React.FC = () => {
  // State declarations with TypeScript types
  const [currentPattern, setCurrentPattern] = useState<KolamPattern | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [animationState, setAnimationState] = useState<"stopped" | "playing" | "paused">("stopped");
  
  const [lineWidth, setLineWidth] = useState(8);
  const [dotRadius, setDotRadius] = useState(3);
  const [lineColor, setLineColor] = useState("#000000");
  const [dotColor, setDotColor] = useState("#dc2626");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Input method state
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "draw">("upload");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  // Refs
  const kolamRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Get URL parameters
  const urlParams = useKolamURLParams();
  const [size, setSize] = useState(urlParams.size);
  const [animationSpeed, setAnimationSpeed] = useState(durationToSpeed(urlParams.duration));
  const [animationDuration, setAnimationDuration] = useState(urlParams.duration);
  const [initialAutoAnimate, setInitialAutoAnimate] = useState(urlParams.initialAutoAnimate);

  // Update URL when parameters change
  useEffect(() => {
    updateURL({ size, duration: animationDuration, initialAutoAnimate });
  }, [size, animationDuration, initialAutoAnimate]);

  // Update duration when speed changes
  useEffect(() => {
    const newDuration = speedToDuration(animationSpeed);
    setAnimationDuration(newDuration);
  }, [animationSpeed]);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDownloadMenu &&
        !(event.target as Element).closest(".download-menu")
      ) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadMenu]);

  // Handle animation end detection
  useEffect(() => {
    if (animationState === "playing" && currentPattern) {
      const timer = setTimeout(() => {
        setAnimationState("stopped");
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [animationState, currentPattern, animationDuration]);

  // Convert animation speed (1-10) to total animation duration
  const getAnimationTiming = (speed: number) => {
    return speedToDuration(speed);
  };

  const generatePattern = useCallback(() => {
    console.log("🎯  kolam pattern generator ");

    try {
      console.log("📏  Kolam generating...");
      const pattern = KolamGenerator.generateKolam1D(size);

      console.log("✅  generated successfully:", pattern);
      setCurrentPattern(pattern);
      setAnimationState("stopped"); // Reset animation when generating new pattern

      // Start animation after a brief delay if auto-animate is enabled
      if (initialAutoAnimate) {
        setTimeout(() => {
          setAnimationState("playing");
        }, 100);
      }
    } catch (error) {
      console.error("❌ Error generating :", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Error generating pattern: ${errorMessage}`);
    }
  }, [size, initialAutoAnimate]);

  // Generate initial pattern on component mount
  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const exportPattern = async (format: "svg" | "png" | "gif") => {
    if (!currentPattern || !kolamRef.current) return;

    setIsExporting(true);

    try {
      switch (format) {
        case "svg":
          await KolamExporter.downloadSVG(currentPattern);
          break;
        case "png":
          await KolamExporter.downloadPNG(
            kolamRef.current,
            currentPattern.name
          );
          break;
        case "gif":
          await KolamExporter.downloadAnimatedGIF(
            kolamRef.current,
            currentPattern,
            currentPattern.name,
            { format: "gif", frameCount: 30, delay: animationDuration }
          );
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getEmbedCode = async () => {
    if (!currentPattern) return;

    try {
      const embedURL = generateEmbedURL({
        size,
        background: "black",
        brush: "#ffffff",
      });

      const embedCode = `<img src="${embedURL}" alt="Kolam Pattern" style="max-width: 100%; height: auto;" />`;

      await navigator.clipboard.writeText(embedCode);
      alert("Embed to clipboard! This will display the kolam as an SVG image.");
    } catch (error) {
      console.error("Failed to generate embed code:", error);
      alert("Failed to copy embed code. Please try again.");
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event);
  };

  const analyzePattern = async () => {
    if (!uploadedImage) return;

    setAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResults({
        symmetry: "Rotational symmetry detected (4-fold)",
        dotGrid: "7x7 dot grid with interlocking patterns",
        geometricStructures: "Complex looping patterns with multiple intersections",
        mathematicalProperties: "Eulerian path detected, topological genus: 1",
        culturalSignificance: "Traditional South Indian design for festivals"
      });
    }, 2000);
  };

  const recreateDesign = () => {
    if (!uploadedImage) return;
    console.log("Recreating design from uploaded image...");
  };

  const copyRawSVG = async () => {
    if (!currentPattern) return;

    try {
      const svgContent = await KolamExporter.exportAsSVG(currentPattern);
      await navigator.clipboard.writeText(svgContent);
      alert(
        "Raw SVG code copied to clipboard! You can paste this directly into HTML or image editing software."
      );
    } catch (error) {
      console.error("Failed to copy raw SVG:", error);
      alert("Failed to copy raw SVG. Please try again.");
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Login handler
  const handleLogin = () => {
    // Add your login logic here
    console.log("Login clicked");
    // You can implement authentication modal or redirect to login page
    alert("Login feature coming soon!");
  };

  return (
    <div className="kolam-editor bg-amber-300 text-black-800 min-h-screen border-bottom-4 border-blue-300 flex flex-col">
      <div className="kolam-editor bg-amber-500 min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-green-500 text-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Rangoli<span className="text-red-500">X</span></h1>
              </div>
              <div className="hidden md:flex space-x-6 items-center">
                <a href="#" className="hover:underline text-2xl">Home</a>
                <a href="#" className="hover:underline text-2xl">Culture & Heritage</a>
                <a href="#" className="hover:underline text-2xl">Mathematical Significance</a>
                <a href="#" className="hover:underline text-2xl">Analyse Kolam</a>
                {/* <a href="#" className="hover:underline text-2xl">Gallery</a> */}
                
                {/* Login Icon */}
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 transition-colors duration-300 rounded-full px-4 py-2 ml-4"
                  title="Login to your account"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  <span className="text-lg font-medium">Login</span>
                </button>
              </div>

              {/* Mobile menu with login */}
              <div className="md:hidden flex items-center space-x-4">
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 transition-colors duration-300 rounded-full px-3 py-2"
                  title="Login"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  <span className="text-sm">Login</span>
                </button>
                
                {/* Mobile menu button (you can add hamburger menu functionality here) */}
                <button className="text-white p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Rest of the component remains the same */}
        {/* Hero Section */}
        <section className="bg-gradient-to-br bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Rangoli<span className="text-red-600">X</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Symmetry, Culture, and Mathematics Reimagined
            </p>
            <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
              Discover the profound beauty of Kolam art — ancient geometric patterns that weave together mathematics, spirituality, and cultural heritage into daily life across South India.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <button className="bg-white border-2 border-teal-500 text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
                Analyse a Kolam
              </button>
              <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                Generate a Kolam
              </button>
              <button className="bg-white border-2 border-orange-500 text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Explore Digital Archive
              </button>
              <button className="bg-white border-2 border-purple-500 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Learn About Kolam
              </button>
            </div>
          </div>
        </section>

        {/* Main Content - The rest of your existing content remains unchanged */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Kolam Display Section */}
          <section className="mb-16">
            <div className="kolam-display-area">
              {currentPattern ? (
                <div
                  ref={kolamRef}
                  className="kolam-container relative flex justify-center items-center bg-black border-4 border-white p-8 rounded-2xl shadow-lg"
                >
                  <KolamDisplay
                    pattern={currentPattern}
                    animate={animationState === 'playing'}
                    animationState={animationState}
                    animationTiming={getAnimationTiming(animationSpeed)}
                    className="kolam-main"
                  />

                  {/* Save button overlaid on canvas */}
                  {currentPattern && (
                    <div className="absolute top-4 right-4">
                      <div className="relative download-menu">
                        {showDownloadMenu && (
                          <div className="absolute right-0 mt-2 bg-amber-500 border-2 border-white rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
                            <button
                              onClick={() => { exportPattern('svg'); setShowDownloadMenu(false); }}
                              className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
                            >
                              📄 Download SVG
                            </button>
                            <button
                              onClick={() => { exportPattern('png'); setShowDownloadMenu(false); }}
                              className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
                            >
                              🖼️ Download PNG
                            </button>
                            <hr className="my-1 border-white" />
                            <button
                              onClick={() => { getEmbedCode(); setShowDownloadMenu(false); }}
                              className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
                            >
                              📋 Copy Embed Code
                            </button>
                            <button
                              onClick={() => { copyRawSVG(); setShowDownloadMenu(false); }}
                              className="w-full text-left px-4 py-2 text-amber-100 hover:bg-gray-500 transition-colors"
                            >
                              📄 Copy Raw SVG
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                          disabled={isExporting}
                          className="p-3 bg-orange-500/80 border-2 text-white rounded-lg hover:bg-red-300/90 transition-colors disabled:opacity-50 shadow-lg backdrop-blur-sm"
                          style={{ borderColor: '#ffffff', backgroundColor: 'blue' }}
                          title="Download Options"
                        >
                          {isExporting ? '⏳' : '💾 SAVE'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-pattern text-center py-12 bg-black border-2 border-white rounded-2xl">
                  <p className="text-amber-100 text-lg">
                    Loading your first kolam...
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Controls Section */}
          <section className="bg-orange-500 border-4 border-white rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4 text-amber-100 flex items-center">
              <span className="mr-2">⚙️</span>
              Kolam Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Size Parameter */}
              <div className="parameter-group">
                <label htmlFor="size" className="block text-sm font-medium text-red-500 mb-2">
                  Grid Size
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="size"
                    type="range"
                    min="3"
                    max="15"
                    value={size}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSize(parseInt(e.target.value))}
                    className="flex-1"
                    style={{ accentColor: 'black' }}
                  />
                  <div className="bg-blue-700 px-3 py-1 rounded text-white min-w-[3rem] text-center">
                    {size}
                  </div>
                </div>
                <div className="text-xs text-amber-100 mt-1">
                  Creates a {size}x{size} pattern grid
                </div>
              </div>

              {/* Animation Speed Parameter */}
              <div className="parameter-group">
                <label htmlFor="animationSpeed" className="block text-sm font-medium text-amber-100 mb-2">
                  Animation Duration
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="animationSpeed"
                    type="range"
                    min="1"
                    max="10"
                    value={animationSpeed}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimationSpeed(parseInt(e.target.value))}
                    className="flex-1"
                    style={{ accentColor: '#000' }}
                  />
                  <div className="bg-blue-700 px-3 py-1 rounded text-amber-100 min-w-[3rem] text-center">
                    {animationSpeed}
                  </div>
                </div>
                <div className="text-xs text-red-500 mt-1">
                  Total: {(animationDuration / 1000).toFixed(1)}s
                </div>
              </div>

              {/* Auto-animate Parameter */}
              <div className="parameter-group">
                <label htmlFor="autoAnimate" className="block text-sm font-medium text-amber-100 mb-2">
                  Auto-animate
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      id="autoAnimate"
                      type="checkbox"
                      checked={initialAutoAnimate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialAutoAnimate(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${initialAutoAnimate ? 'bg-amber-400' : 'bg-blue-700'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${initialAutoAnimate ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="ml-3 text-amber-100 font-medium">
                      {initialAutoAnimate ? 'On' : 'Off'}
                    </span>
                  </label>
                </div>
                <div className="text-xs text-amber-100 mt-1">
                  Auto-play animation on generate
                </div>
              </div> 
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6">
              {currentPattern && (
                <button
                  onClick={() => {
                    if (animationState === 'playing') {
                      setAnimationState('stopped');
                    } else {
                      setAnimationState('playing');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: animationState === 'playing' ? '#f0c75e' : undefined, color: animationState === 'playing' ? '#92400e' : undefined }}
                  title={animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
                >
                  {animationState === 'playing' ? '⏹️' : '▶️'}
                  {animationState === 'playing' ? 'Stop Animation' : 'Play Animation'}
                </button>
              )}

              <button
                onClick={() => generatePattern()}
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:opacity-40 bg-emerald-100 transition-colors font-medium shadow-lg"
                style={{ backgroundColor: 'green' }}
              >
                Generate Kolam
              </button>
            </div>
          </section>

          {/* Kolam Analyzer Section */}
          <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Kolam Input Methods
                </h1>
                <p className="text-xl text-gray-600">
                  Choose how you want to provide your Kolam pattern for analysis
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Left Column - Input Methods */}
                <div className="space-y-8">
                  {/* Method Selection */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                      Choose Input Method
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedMethod('upload')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === 'upload'
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">📤</div>
                        <h3 className="font-semibold text-lg mb-2">Upload Image</h3>
                        <p className="text-sm opacity-75">Use existing Kolam images</p>
                      </button>

                      <button
                        onClick={() => setSelectedMethod('draw')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === 'draw'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">✏️</div>
                        <h3 className="font-semibold text-lg mb-2">Draw Pattern</h3>
                        <p className="text-sm opacity-75">Create your own design</p>
                      </button>
                    </div>
                  </div>

                  {/* Upload Section */}
                  {selectedMethod === 'upload' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">🖼️</span>
                        Upload Kolam Image
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        Support for JPG, PNG, and other common image formats
                      </p>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                          id="kolam-upload"
                        />
                        <label
                          htmlFor="kolam-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <div className="text-5xl mb-4">📁</div>
                          <p className="text-gray-700 font-semibold mb-2">Choose File</p>
                          <p className="text-gray-500 text-sm">Click to browse or drag and drop</p>
                        </label>
                      </div>

                      {uploadedImage && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Preview:</h4>
                          <img
                            src={uploadedImage}
                            alt="Uploaded kolam"
                            className="w-full max-w-md mx-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Draw Section */}
                  {selectedMethod === 'draw' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">🎨</span>
                        Draw Your Kolam Pattern
                      </h3>

                      <div className="border-2 border-gray-200 rounded-xl p-4 mb-4">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={400}
                          className="w-full h-96 bg-white border border-gray-300 rounded cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={clearCanvas}
                          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                          Clear Canvas
                        </button>
                        <button
                          onClick={analyzePattern}
                          className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                        >
                          Analyze Drawing
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Analysis Results */}
                <div className="space-y-8">
                  {/* Analysis Results Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="mr-3">📊</span>
                      Analysis Results
                    </h2>

                    {analyzing ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Analyzing your Kolam pattern...</p>
                      </div>
                    ) : analysisResults ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                            <h4 className="font-semibold text-amber-800 mb-2">Symmetry Detection</h4>
                            <p className="text-amber-700">{analysisResults.symmetry}</p>
                          </div>
                          
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <h4 className="font-semibold text-blue-800 mb-2">Pattern Analysis</h4>
                            <p className="text-blue-700">{analysisResults.dotGrid}</p>
                            <p className="text-blue-700 mt-1">{analysisResults.geometricStructures}</p>
                          </div>
                          
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <h4 className="font-semibold text-green-800 mb-2">Mathematical Insights</h4>
                            <p className="text-green-700">{analysisResults.mathematicalProperties}</p>
                          </div>
                          
                          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                            <h4 className="font-semibold text-purple-800 mb-2">Cultural Context</h4>
                            <p className="text-purple-700">{analysisResults.culturalSignificance}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-600 text-lg">
                          Upload an image or draw a pattern to see analysis results
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Analysis Features */}
                  <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                      Analysis Features
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <span className="text-xl">⧉</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Symmetry Detection</h4>
                          <p className="text-white/90 text-sm">
                            Identifies rotational, reflectional, and translational symmetries
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <span className="text-xl">•</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Pattern Analysis</h4>
                          <p className="text-white/90 text-sm">
                            Analyzes dot grids, line patterns, and geometric structures
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <span className="text-xl">π</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Mathematical Insights</h4>
                          <p className="text-white/90 text-sm">
                            Provides mathematical properties and topological information
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <span className="text-xl">🏛️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Cultural Context</h4>
                          <p className="text-white/90 text-sm">
                            Explains cultural significance and traditional usage
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                {selectedMethod === 'upload' && uploadedImage && (
                  <button
                    onClick={analyzePattern}
                    disabled={analyzing}
                    className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Uploaded Image'}
                  </button>
                )}
              </div>
            </div>
          </section>
		  <br/><br/>


          {/* About Section */}
          <section className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About This Project</h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              This project explores the traditional art of Kolam — a cultural practice of South India blending art, ingenuity, and mathematics. The goal is to study its design principles, recreate Kolam using computer programs, and preserve its heritage through modern technology.
            </p>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Kolams (also called Muggu, Rangoli, Rangavalli) are significant cultural traditions of India, blending art, ingenuity, and culture. The challenge is to capture their mathematical, symmetrical, and cultural essence in a programmatic and visual way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-center">
                <h3 className="text-xl font-semibold text-amber-800 mb-3">Research & Analysis</h3>
                <p className="text-gray-700">Study traditional design principles and mathematical foundations of Kolam patterns</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Digital Recreation</h3>
                <p className="text-gray-700">Develop computer programs to recreate and generate authentic Kolam designs</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Heritage Preservation</h3>
                <p className="text-gray-700">Preserve cultural knowledge through modern technology and digital archives</p>
              </div>
            </div>
          </section>

          {/* Explore Dimensions Section */}
          <section className="bg-gradient-to-r from-teal-600 to-green-500 text-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Kolam Dimensions</h2>
            <p className="text-xl text-center mb-12 opacity-90">
              Discover how this ancient art form connects mathematics, spirituality, and cultural heritage
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                <h3 className="text-xl font-semibold mb-4">Sacred Geometry</h3>
                <p className="opacity-90">Explore the mathematical precision and spiritual symbolism embedded in every Kolam pattern.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                <h3 className="text-xl font-semibold mb-4">Cultural Heritage</h3>
                <p className="opacity-90">Discover how Kolam connects generations through festivals, rituals, and daily traditions.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                <h3 className="text-xl font-semibold mb-4">Traditional Methods</h3>
                <p className="opacity-90">Uncover the algorithmic thinking and geometric principles that govern traditional patterns.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-6 mb-4">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity flex items-center gap-2"
                title="LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity flex items-center gap-2"
                title="GitHub"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Kolam Heritage Project. Preserving traditional art through modern technology.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};