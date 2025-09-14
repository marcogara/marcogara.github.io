// metroConfig.js - Global configuration constants for metro simulation

// Station names for the metro line
const METRO_STATIONS = [
    'Am Steinberg', 'Prenzlauer Prom./Am Steinberg', 'Prenzlauer Allee/Ostseestr.',
    'Enrich-Weinert.Str.',  'S P Allee', 'FroebelStr.', 'PAllee/Danziger', 'Marienburger Str.',
    'Knaackstr.', 'PAllee/Metzer Str.', 'Mollstr.', 'Alex/Mem', 'Alexanderplatz'
];

// Station configuration with timetables and walking times
const STATION_CONFIG = {
    "Tino": {
        name: "Tino",
        walkingTime: 8 * 60 * 1000, // 8 minutes in milliseconds
        timetable: [12, 32, 52] // minutes past each hour
    },
    "Am Steinberg": {
        name: "Am Steinberg",
        walkingTime: 10 * 60 * 1000, // 10 minutes in milliseconds
        timetable: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58] // minutes past each hour
    }
};

// Station timing intervals (in minutes)
const STATION_INTERVALS = {
    'Am Steinberg': 0, // Starting point
    'Prenzlauer Prom./Am Steinberg': 1, // 1 minute from Am Steinberg
    'Prenzlauer Allee/Ostseestr.': 3, // 2 more minutes (total 3 from start)
    'Enrich-Weinert.Str.': 4, // 1 more minute (total 4 from start)
    'S P Allee': 5, // 1 more minute (total 5 from start)
    'FroebelStr.': 6,
    'PAllee/Danziger': 7,
    'Marienburger Str.':8,
    'Knaackstr.': 9,
    'PAllee/Metzer Str.': 10,
    'Mollstr.': 11,
    'Alex/Mem': 12,
    'Alexanderplatz': 14
};

// Simulation timing constants
const SIMULATION_CONFIG = {
    departureInterval: 5 * 60 * 1000, // 5 minutes in milliseconds (matches timetable frequency)
    journeyDuration: 14 * 60 * 1000, // 14 minutes in milliseconds (complete route)
    updateInterval: 100, // milliseconds for timer updates
    displayUpdateInterval: 1000 // milliseconds for station display updates
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        METRO_STATIONS,
        STATION_CONFIG,
        STATION_INTERVALS,
        SIMULATION_CONFIG
    };
} else {
    // Browser environment - make available globally
    window.METRO_STATIONS = METRO_STATIONS;
    window.STATION_CONFIG = STATION_CONFIG;
    window.STATION_INTERVALS = STATION_INTERVALS;
    window.SIMULATION_CONFIG = SIMULATION_CONFIG;
}
