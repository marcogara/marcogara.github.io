const Osm = {
   parseRoads: (data) => {
       const nodes = data.elements.filter((n) => n.type == "node");

       const lats = nodes.map((n) => n.lat);
       const lons = nodes.map((n) => n.lon);

       const minLat = Math.min(...lats);
       const maxLat = Math.max(...lats);
       const minLon = Math.min(...lons);
       const maxLon = Math.max(...lons);

       const deltaLat = maxLat - minLat;
       const deltaLon = maxLon - minLon;

       const height = deltaLat * 111000; // Height in meters
       const width = deltaLon * 111000 * Math.cos(degToRad((maxLat + minLat) / 2)); // Width in meters

       const metersPerPixelX = width / myCanvas.width;
       const metersPerPixelY = height / myCanvas.height;

       const points = [];
       const segments = [];
       for (const node of nodes) {
           const y = (maxLat - node.lat) * 111000 / metersPerPixelY; //Flipped and meters per pixel adjusted
           const x = (node.lon - minLon) * 111000 * Math.cos(degToRad((maxLat + minLat) / 2)) / metersPerPixelX; // meters per pixel adjusted
           points.id = node.id;
           points.push(new Point(x * 10, y * 10)); // <---- SCALE HERE
       }




       graph.points = points;
       graph.segments = segments;
   }
}
