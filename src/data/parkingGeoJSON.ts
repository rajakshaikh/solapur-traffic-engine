// src/data/parkingGeoJSON.ts
// GeoJSON data for Solapur parking zones, pressure areas, and no-parking zones

export interface ParkingZone {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: "parking";
    capacity?: number;
    address: string;
    availability: "likely_available" | "limited" | "likely_full";
    walkingDistance?: number;
    walkingTime?: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface PressureZone {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: "pressure_zone";
    severity: "high" | "medium" | "low";
    peakTime: string;
    reportCount: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][]; // Array of coordinate rings
  };
}

export interface NoParkingZone {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: "no_parking";
    reason: string;
    timeWindow?: string;
  };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
}

// Sample parking locations in Solapur (designated parking areas)
export const parkingZonesGeoJSON: ParkingZone[] = [
  {
    type: "Feature",
    properties: {
      id: "p1",
      name: "Railway Colony Ground Parking",
      type: "parking",
      capacity: 50,
      address: "Near Railway Station, Station Road",
      availability: "likely_available",
      walkingDistance: 300,
      walkingTime: 4,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9064, 17.6599],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p2",
      name: "Municipal Parking - Market Road",
      type: "parking",
      capacity: 80,
      address: "Market Road, Near Jule Solapur",
      availability: "limited",
      walkingDistance: 450,
      walkingTime: 6,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9200, 17.6510],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p3",
      name: "Bus Stand Parking Area",
      type: "parking",
      capacity: 60,
      address: "Solapur Bus Stand Circle",
      availability: "likely_full",
      walkingDistance: 200,
      walkingTime: 3,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9130, 17.6555],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p4",
      name: "Ashok Chowk Parking",
      type: "parking",
      capacity: 40,
      address: "Ashok Chowk Junction",
      availability: "likely_available",
      walkingDistance: 350,
      walkingTime: 5,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9178, 17.6632],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p5",
      name: "Murarji Peth Parking Lot",
      type: "parking",
      capacity: 35,
      address: "Murarji Peth Main Road",
      availability: "limited",
      walkingDistance: 500,
      walkingTime: 7,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9021, 17.6589],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p6",
      name: "Akkalkot Road Parking",
      type: "parking",
      capacity: 45,
      address: "Akkalkot Road, Near Naka",
      availability: "likely_available",
      walkingDistance: 600,
      walkingTime: 8,
    },
    geometry: {
      type: "Point",
      coordinates: [75.8980, 17.6480],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "p7",
      name: "Vijapur Road Parking",
      type: "parking",
      capacity: 30,
      address: "Vijapur Road",
      availability: "likely_available",
      walkingDistance: 550,
      walkingTime: 7,
    },
    geometry: {
      type: "Point",
      coordinates: [75.9250, 17.6700],
    },
  },
];

// Pressure zones as polygons (areas with parking congestion)
export const pressureZonesGeoJSON: PressureZone[] = [
  {
    type: "Feature",
    properties: {
      id: "pr1",
      name: "Station Road Junction",
      type: "pressure_zone",
      severity: "high",
      peakTime: "8:30 - 9:30 AM",
      reportCount: 47,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9040, 17.6580],
          [75.9090, 17.6580],
          [75.9090, 17.6620],
          [75.9040, 17.6620],
          [75.9040, 17.6580],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "pr2",
      name: "Murarji Peth Main Road",
      type: "pressure_zone",
      severity: "high",
      peakTime: "5:00 - 6:30 PM",
      reportCount: 38,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9000, 17.6570],
          [75.9050, 17.6570],
          [75.9050, 17.6610],
          [75.9000, 17.6610],
          [75.9000, 17.6570],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "pr3",
      name: "Bus Stand Circle",
      type: "pressure_zone",
      severity: "medium",
      peakTime: "7:00 - 8:00 AM",
      reportCount: 29,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9110, 17.6540],
          [75.9150, 17.6540],
          [75.9150, 17.6570],
          [75.9110, 17.6570],
          [75.9110, 17.6540],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "pr4",
      name: "Ashok Chowk",
      type: "pressure_zone",
      severity: "medium",
      peakTime: "6:00 - 7:00 PM",
      reportCount: 24,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9160, 17.6620],
          [75.9200, 17.6620],
          [75.9200, 17.6650],
          [75.9160, 17.6650],
          [75.9160, 17.6620],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "pr5",
      name: "Jule Solapur Market",
      type: "pressure_zone",
      severity: "medium",
      peakTime: "10:00 AM - 1:00 PM",
      reportCount: 41,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9180, 17.6490],
          [75.9220, 17.6490],
          [75.9220, 17.6530],
          [75.9180, 17.6530],
          [75.9180, 17.6490],
        ],
      ],
    },
  },
];

// No-parking zones (restricted areas)
export const noParkingZonesGeoJSON: NoParkingZone[] = [
  {
    type: "Feature",
    properties: {
      id: "np1",
      name: "Station Road (Peak Hours)",
      type: "no_parking",
      reason: "No parking 8:00-10:00 AM",
      timeWindow: "8:00 AM - 10:00 AM",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9050, 17.6590],
          [75.9080, 17.6590],
          [75.9080, 17.6610],
          [75.9050, 17.6610],
          [75.9050, 17.6590],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "np2",
      name: "Murarji Peth (Evening)",
      type: "no_parking",
      reason: "Hawker-free enforcement zone",
      timeWindow: "5:00 PM - 7:00 PM",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9010, 17.6585],
          [75.9040, 17.6585],
          [75.9040, 17.6605],
          [75.9010, 17.6605],
          [75.9010, 17.6585],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "np3",
      name: "Bus Stand Circle",
      type: "no_parking",
      reason: "No parking near bus stop",
      timeWindow: "All day",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [75.9120, 17.6550],
          [75.9140, 17.6550],
          [75.9140, 17.6565],
          [75.9120, 17.6565],
          [75.9120, 17.6550],
        ],
      ],
    },
  },
];

// Bus stop locations (for informational layer)
export interface BusStop {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: "bus_stop";
    routes: string[];
    nextArrival?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export const busStopsGeoJSON: BusStop[] = [
  {
    type: "Feature",
    properties: {
      id: "bs1",
      name: "Bus Stand",
      type: "bus_stop",
      routes: ["1", "2", "3", "4"],
      nextArrival: "10:15 AM",
    },
    geometry: {
      type: "Point",
      coordinates: [75.9130, 17.6555],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "bs2",
      name: "Ashok Chowk",
      type: "bus_stop",
      routes: ["1", "2"],
      nextArrival: "10:22 AM",
    },
    geometry: {
      type: "Point",
      coordinates: [75.9178, 17.6632],
    },
  },
  {
    type: "Feature",
    properties: {
      id: "bs3",
      name: "Station Road",
      type: "bus_stop",
      routes: ["1"],
      nextArrival: "10:35 AM",
    },
    geometry: {
      type: "Point",
      coordinates: [75.9064, 17.6599],
    },
  },
];
