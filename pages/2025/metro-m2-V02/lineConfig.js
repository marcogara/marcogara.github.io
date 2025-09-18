// ========================================
// LINE CONFIGURATION FILE
// ========================================

const lineConfigs = {
    M2: {
        // Starting point coordinates
        startX: 700,
        startY: 200,
        
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
                    { name: "Promenade/Am Steinberg", position: 0.1 },
                    { name: "P Alle/ Ostseestr.", position: 0.3},
                    { name: "Enrich-Weinert.Str.", position: 0.5 },
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
        name: "M2",
        color: "#ff6b6b",
        labelDirection: "right"
    },
    M3: {
        // Starting point coordinates
        startX: 500,
        startY: 1100,
        
        // Line segments with direction and stations
        segments: [
            {
                direction: 0,    // 1
                length: 200,      // length of this segment in pixels
                stations: [
                    { name: "S Warschauer Str.", position: 0 },
                    { name: "", position: 0.3 },
                    { name: "", position: 0.5 }
                ]
            },
            {
                direction: 315,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 280,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "S+U Frankfurter Allee", position: 0.5 }
                ]
            },
            {
                direction: 275,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 280,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "Landsberger Allee/​Weißenseer W.", position: 0.5 }
                ]
            },
            {
                direction: 225,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 100,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "", position: 0.85 }
                ]
            },
            {
                direction: 175,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 50,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.5 }
                ]
            },
            {
                direction: 215,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 100,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "", position: 0.5 },
                    { name: "Gustav-Adolf-Str./​Langhansstr.", position: 0.8 },
                ]
            },
            {
                direction: 181,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 700,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.37 },
                    { name: "Stahlheimer Str.", position: 0.6 },
                    { name: "Schönhauser Allee", position: 0.8 },
                ]
            },
            {
                direction: 225,  
                length: 200,
                stations: [
                    { name: "", position: 0.1 },
                    { name: "Björnsonstr.", position: 0.7 },
                    { name: "S Bornholmer Str.", position: 1 }
                ]
            },
            {
                direction: 181,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 400,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "", position: 0.85 }
                ]
            },
            {
                direction: 135,    // degrees (0=right, 90=down, 180=left, 270=up)
                length: 400,      // length of this segment in pixels
                stations: [
                    { name: "", position: 0.3 },
                    { name: "Virchow-Klinikum", position: 0.85 }
                ]
            }
        ],
        
        // Line properties
        name: "M13",
        color: "#4ecdc4",
        labelDirection: "top"
    }
};