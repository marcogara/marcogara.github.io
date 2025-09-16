// ========================================
// LINE CONFIGURATION FILE
// ========================================

const lineConfig = {
    // Starting point coordinates
    startX: 700,
    startY: 100,
    
    // Line segments with direction and stations
    segments: [
        {
            direction: 135,    // degrees (0=right, 90=down, 180=left, 270=up)
            length: 300,      // length of this segment in pixels
            stations: [
                { name: "Heinersdorf", position: 0 },      // position 0-1 along segment
                { name: "Rothenbachstr.", position: 0.2 },
                { name: "Heinersdorf Kirche", position: 0.4 },
                { name: "Am Wasserturm", position: 0.6 },
                { name: "Tino-Schwierzina-Str.", position: 0.8 },
                { name: "Am Steinberg", position: 0.9 }
            ]
        },
        {
            direction: 95,  
            length: 250,
            stations: [
                { name: "Promenade/Am Steinberg", position: 0.2 },
                { name: "P Alle/ Ostseestr.", position: 0.5 },
                { name: "S Bahn P Alee", position: 0.7 },
                { name: "Froeblestr.", position: 0.9 }
            ]
        },
        {
            direction: 135,  
            length: 280,
            stations: [
                { name: "P Alle/Danziger Str.", position: 0.1 },
                { name: "Marienburger Str.", position: 0.3 },
                { name: "Knackstr.", position: 0.5 },
                { name: "P Alle/Metzer Str.", position: 0.7 },
                { name: "Memhardstr.", position: 0.9 }
            ]
        },
        {
            direction: 45,    
            length: 50,
            stations: [
                { name: "Alex", position: 1 }
            ]
        }
    ],
    
    // Line properties
    name: "Red Line",
    color: "#ff6b6b"
};