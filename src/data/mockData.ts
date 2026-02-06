// Mock data for the SMC Dashboard

export interface CongestionZone {
  id: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  reportCount: number;
  peakTime: string;
}

export interface RuleRecommendation {
  id: string;
  location: string;
  problemType: 'parking' | 'hawker' | 'congestion' | 'signal';
  recommendedRule: string;
  timeWindow: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  status: 'new' | 'approved' | 'enforced' | 'ignored';
}

export interface ParkingImpactArea {
  id: string;
  road: string;
  impactScore: number;
  peakCongestionTime: string;
  reportCount: number;
  lastRuleApplied?: string;
}

export interface ObstructionHotspot {
  id: string;
  location: string;
  type: 'hawker' | 'blockage' | 'accident' | 'construction';
  peakTimes: string;
  trend: 'increasing' | 'stable' | 'reducing';
  reportCount: number;
}

export interface TrafficAlert {
  id: string;
  message: string;
  location: string;
  expectedTime: string;
  alertType: 'watch' | 'act';
}

export interface ActionItem {
  id: string;
  location: string;
  issueSummary: string;
  suggestedAction: string;
  timeSlot: string;
  enforcementType: 'Police' | 'Ward' | 'Traffic Dept';
  priority: 'high' | 'medium' | 'low';
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  stops: string[];
}

export interface BusArrival {
  routeNumber: string;
  stopName: string;
  expectedArrival: string;
  delay: number;
  delayReason?: string;
}

// Mock Data
export const congestionZones: CongestionZone[] = [
  { id: '1', location: 'Station Road Junction', severity: 'high', reportCount: 47, peakTime: '8:30 - 9:30 AM' },
  { id: '2', location: 'Murarji Peth Main Road', severity: 'high', reportCount: 38, peakTime: '5:00 - 6:30 PM' },
  { id: '3', location: 'Bus Stand Circle', severity: 'medium', reportCount: 29, peakTime: '7:00 - 8:00 AM' },
  { id: '4', location: 'Ashok Chowk', severity: 'medium', reportCount: 24, peakTime: '6:00 - 7:00 PM' },
  { id: '5', location: 'Kumbar Wada', severity: 'low', reportCount: 15, peakTime: '9:00 - 10:00 AM' },
];

export const ruleRecommendations: RuleRecommendation[] = [
  {
    id: '1',
    location: 'Station Road',
    problemType: 'parking',
    recommendedRule: 'No parking from 8:00–10:00 AM',
    timeWindow: '8:00 AM - 10:00 AM',
    priority: 'high',
    reason: 'Recurring congestion due to illegal parking during morning rush',
    status: 'new',
  },
  {
    id: '2',
    location: 'Murarji Peth',
    problemType: 'hawker',
    recommendedRule: 'Hawker-free enforcement zone during peak hours',
    timeWindow: '5:00 PM - 7:00 PM',
    priority: 'high',
    reason: '15+ citizen reports of road blockage by hawkers',
    status: 'approved',
  },
  {
    id: '3',
    location: 'Bus Stand Signal',
    problemType: 'signal',
    recommendedRule: 'Manual signal override from 8:30–9:00 AM',
    timeWindow: '8:30 AM - 9:00 AM',
    priority: 'medium',
    reason: 'Signal timing inadequate for morning traffic volume',
    status: 'new',
  },
  {
    id: '4',
    location: 'Akkalkot Road',
    problemType: 'parking',
    recommendedRule: 'One-side parking only after 7:00 PM',
    timeWindow: '7:00 PM onwards',
    priority: 'medium',
    reason: 'Evening congestion patterns show parking on both sides causes bottleneck',
    status: 'enforced',
  },
  {
    id: '5',
    location: 'Hotgi Road Junction',
    problemType: 'congestion',
    recommendedRule: 'Traffic marshal deployment during school hours',
    timeWindow: '7:30 AM - 8:30 AM, 2:30 PM - 3:30 PM',
    priority: 'low',
    reason: 'School dispersal causes temporary congestion',
    status: 'ignored',
  },
];

export const parkingImpactAreas: ParkingImpactArea[] = [
  { id: '1', road: 'Station Road', impactScore: 92, peakCongestionTime: '8:00 - 10:00 AM', reportCount: 67, lastRuleApplied: 'No parking 8-10 AM (2024)' },
  { id: '2', road: 'Murarji Peth Main Road', impactScore: 85, peakCongestionTime: '5:00 - 7:00 PM', reportCount: 54 },
  { id: '3', road: 'Jule Solapur Market Area', impactScore: 78, peakCongestionTime: '10:00 AM - 1:00 PM', reportCount: 41 },
  { id: '4', road: 'Akkalkot Road', impactScore: 71, peakCongestionTime: '6:00 - 8:00 PM', reportCount: 33, lastRuleApplied: 'One-side parking (enforced)' },
  { id: '5', road: 'Vijapur Road', impactScore: 64, peakCongestionTime: '7:00 - 9:00 AM', reportCount: 28 },
];

export const obstructionHotspots: ObstructionHotspot[] = [
  { id: '1', location: 'Murarji Peth Vegetable Market', type: 'hawker', peakTimes: '6:00 AM - 11:00 AM', trend: 'increasing', reportCount: 89 },
  { id: '2', location: 'Station Road Near Railway Gate', type: 'blockage', peakTimes: '8:00 - 9:00 AM, 5:00 - 6:00 PM', trend: 'stable', reportCount: 56 },
  { id: '3', location: 'Bus Stand Footpath', type: 'hawker', peakTimes: 'All day', trend: 'increasing', reportCount: 43 },
  { id: '4', location: 'Ashok Chowk Construction Site', type: 'construction', peakTimes: '7:00 AM - 6:00 PM', trend: 'stable', reportCount: 31 },
  { id: '5', location: 'Hotgi Road School Zone', type: 'blockage', peakTimes: '7:30 - 8:30 AM', trend: 'reducing', reportCount: 22 },
];

export const trafficAlerts: TrafficAlert[] = [
  { id: '1', message: 'Expected congestion near Bus Stand', location: 'Bus Stand Circle', expectedTime: '5:30 PM', alertType: 'act' },
  { id: '2', message: 'School dispersal traffic expected', location: 'Hotgi Road', expectedTime: '2:30 PM', alertType: 'watch' },
  { id: '3', message: 'Market closing rush anticipated', location: 'Murarji Peth', expectedTime: '6:00 PM', alertType: 'watch' },
  { id: '4', message: 'Railway gate closure scheduled', location: 'Station Road', expectedTime: '4:15 PM', alertType: 'act' },
];

export const actionItems: ActionItem[] = [
  {
    id: '1',
    location: 'Station Road Junction',
    issueSummary: 'Illegal parking causing morning congestion',
    suggestedAction: 'Deploy tow truck and issue challans',
    timeSlot: '7:30 AM - 9:30 AM',
    enforcementType: 'Traffic Dept',
    priority: 'high',
  },
  {
    id: '2',
    location: 'Murarji Peth',
    issueSummary: 'Hawker encroachment blocking traffic',
    suggestedAction: 'Coordinate with Ward office for removal',
    timeSlot: '5:00 PM - 7:00 PM',
    enforcementType: 'Ward',
    priority: 'high',
  },
  {
    id: '3',
    location: 'Bus Stand Signal',
    issueSummary: 'Signal timing inadequate for traffic volume',
    suggestedAction: 'Deploy manual traffic control',
    timeSlot: '8:00 AM - 9:30 AM',
    enforcementType: 'Police',
    priority: 'medium',
  },
  {
    id: '4',
    location: 'Akkalkot Road',
    issueSummary: 'Double-side parking causing bottleneck',
    suggestedAction: 'Enforce one-side parking rule',
    timeSlot: '6:00 PM - 8:00 PM',
    enforcementType: 'Traffic Dept',
    priority: 'medium',
  },
  {
    id: '5',
    location: 'Jule Solapur Market',
    issueSummary: 'Loading/unloading blocking lane',
    suggestedAction: 'Restrict commercial loading hours',
    timeSlot: '10:00 AM - 12:00 PM',
    enforcementType: 'Ward',
    priority: 'low',
  },
];

export const busRoutes: BusRoute[] = [
  { id: '1', routeNumber: '1', routeName: 'Bus Stand - Railway Station', stops: ['Bus Stand', 'Ashok Chowk', 'Murarji Peth', 'Station Road', 'Railway Station'] },
  { id: '2', routeNumber: '2', routeName: 'Akkalkot Road - Hotgi Road', stops: ['Akkalkot Naka', 'Ashok Chowk', 'Bus Stand', 'Kumbar Wada', 'Hotgi Road'] },
  { id: '3', routeNumber: '3', routeName: 'Vijapur Road - Jule Solapur', stops: ['Vijapur Naka', 'New City', 'Bus Stand', 'Murarji Peth', 'Jule Solapur'] },
  { id: '4', routeNumber: '4', routeName: 'Barshi Road - MIDC', stops: ['Barshi Naka', 'Industrial Area', 'Bus Stand', 'Railway Station', 'MIDC'] },
  { id: '5', routeNumber: '5', routeName: 'Tuljapur Road - Central Bus Stand', stops: ['Tuljapur Naka', 'Siddheshwar Temple', 'Old City', 'Central Bus Stand'] },
  { id: '6', routeNumber: '6', routeName: 'Pandharpur Road - Industrial Area', stops: ['Pandharpur Naka', 'Solapur University', 'MIDC', 'Industrial Area'] },
];

export const busArrivals: BusArrival[] = [
  { routeNumber: '1', stopName: 'Bus Stand', expectedArrival: '10:15 AM', delay: 5, delayReason: 'Traffic on Station Road' },
  { routeNumber: '2', stopName: 'Ashok Chowk', expectedArrival: '10:22 AM', delay: 0 },
  { routeNumber: '3', stopName: 'Bus Stand', expectedArrival: '10:30 AM', delay: 12, delayReason: 'Congestion near Murarji Peth' },
  { routeNumber: '1', stopName: 'Railway Station', expectedArrival: '10:35 AM', delay: 8, delayReason: 'Heavy traffic' },
];

// Bus Schedule Data (Timetable format)
export interface BusScheduleEntry {
  id: string;
  routeNumber: string;
  routeName: string;
  from: string;
  to: string;
  majorStops: string[];
  scheduledTime: string;
  expectedDelayMinutes: number;
  delayReason?: string;
}

export const busScheduleEntries: BusScheduleEntry[] = [
  {
    id: '1',
    routeNumber: '1',
    routeName: 'Bus Stand - Railway Station',
    from: 'Bus Stand',
    to: 'Railway Station',
    majorStops: ['Ashok Chowk', 'Murarji Peth', 'Station Road'],
    scheduledTime: '6:00 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '2',
    routeNumber: '1',
    routeName: 'Bus Stand - Railway Station',
    from: 'Bus Stand',
    to: 'Railway Station',
    majorStops: ['Ashok Chowk', 'Murarji Peth', 'Station Road'],
    scheduledTime: '6:15 AM',
    expectedDelayMinutes: 5,
    delayReason: 'Morning rush traffic',
  },
  {
    id: '3',
    routeNumber: '1',
    routeName: 'Bus Stand - Railway Station',
    from: 'Bus Stand',
    to: 'Railway Station',
    majorStops: ['Ashok Chowk', 'Murarji Peth', 'Station Road'],
    scheduledTime: '6:30 AM',
    expectedDelayMinutes: 8,
    delayReason: 'Heavy congestion on Station Road',
  },
  {
    id: '4',
    routeNumber: '2',
    routeName: 'Akkalkot Road - Hotgi Road',
    from: 'Akkalkot Naka',
    to: 'Hotgi Road',
    majorStops: ['Ashok Chowk', 'Bus Stand', 'Kumbar Wada'],
    scheduledTime: '6:15 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '5',
    routeNumber: '2',
    routeName: 'Akkalkot Road - Hotgi Road',
    from: 'Akkalkot Naka',
    to: 'Hotgi Road',
    majorStops: ['Ashok Chowk', 'Bus Stand', 'Kumbar Wada'],
    scheduledTime: '6:35 AM',
    expectedDelayMinutes: 3,
    delayReason: 'Minor traffic at Ashok Chowk',
  },
  {
    id: '6',
    routeNumber: '3',
    routeName: 'Vijapur Road - Jule Solapur',
    from: 'Vijapur Naka',
    to: 'Jule Solapur',
    majorStops: ['New City', 'Bus Stand', 'Murarji Peth'],
    scheduledTime: '6:30 AM',
    expectedDelayMinutes: 12,
    delayReason: 'Hawker congestion at Murarji Peth',
  },
  {
    id: '7',
    routeNumber: '3',
    routeName: 'Vijapur Road - Jule Solapur',
    from: 'Vijapur Naka',
    to: 'Jule Solapur',
    majorStops: ['New City', 'Bus Stand', 'Murarji Peth'],
    scheduledTime: '6:55 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '8',
    routeNumber: '4',
    routeName: 'Barshi Road - MIDC',
    from: 'Barshi Naka',
    to: 'MIDC',
    majorStops: ['Industrial Area', 'Bus Stand', 'Railway Station'],
    scheduledTime: '7:00 AM',
    expectedDelayMinutes: 6,
    delayReason: 'Industrial traffic',
  },
  {
    id: '9',
    routeNumber: '5',
    routeName: 'Tuljapur Road - Central Bus Stand',
    from: 'Tuljapur Naka',
    to: 'Central Bus Stand',
    majorStops: ['Siddheshwar Temple', 'Old City'],
    scheduledTime: '6:00 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '10',
    routeNumber: '5',
    routeName: 'Tuljapur Road - Central Bus Stand',
    from: 'Tuljapur Naka',
    to: 'Central Bus Stand',
    majorStops: ['Siddheshwar Temple', 'Old City'],
    scheduledTime: '6:20 AM',
    expectedDelayMinutes: 4,
    delayReason: 'Temple area congestion',
  },
  {
    id: '11',
    routeNumber: '6',
    routeName: 'Pandharpur Road - Industrial Area',
    from: 'Pandharpur Naka',
    to: 'Industrial Area',
    majorStops: ['Solapur University', 'MIDC'],
    scheduledTime: '6:45 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '12',
    routeNumber: '7',
    routeName: 'City Circular - Clockwise',
    from: 'Bus Stand',
    to: 'Bus Stand (Circular)',
    majorStops: ['Ashok Chowk', 'Railway Station', 'Vijapur Road', 'Akkalkot Road'],
    scheduledTime: '6:00 AM',
    expectedDelayMinutes: 10,
    delayReason: 'Peak hour traffic',
  },
  {
    id: '13',
    routeNumber: '7',
    routeName: 'City Circular - Clockwise',
    from: 'Bus Stand',
    to: 'Bus Stand (Circular)',
    majorStops: ['Ashok Chowk', 'Railway Station', 'Vijapur Road', 'Akkalkot Road'],
    scheduledTime: '6:15 AM',
    expectedDelayMinutes: 0,
  },
  {
    id: '14',
    routeNumber: '8',
    routeName: 'City Circular - Anti-Clockwise',
    from: 'Bus Stand',
    to: 'Bus Stand (Circular)',
    majorStops: ['Akkalkot Road', 'Vijapur Road', 'Railway Station', 'Ashok Chowk'],
    scheduledTime: '6:10 AM',
    expectedDelayMinutes: 7,
    delayReason: 'Railway crossing delay',
  },
];

// Summary statistics

// Citizen Reported Issues
export type ReportStatus = 'received' | 'under_review' | 'action_planned' | 'closed';

export interface CitizenReport {
  id: string;
  reportId: string;
  phoneNumber: string;
  issueType: 'parking' | 'hawker' | 'blocked' | 'signal';
  location: string;
  description: string;
  dateTime: string;
  status: ReportStatus;
  statusUpdatedAt: string;
  hasPhoto: boolean;
}

export const citizenReports: CitizenReport[] = [
  {
    id: '1',
    reportId: 'SLP-2024-00147',
    phoneNumber: '9876543210',
    issueType: 'parking',
    location: 'Station Road, near Railway Gate',
    description: 'Multiple vehicles parked in no-parking zone blocking traffic',
    dateTime: '2024-01-15 08:45 AM',
    status: 'action_planned',
    statusUpdatedAt: '2024-01-15 02:30 PM',
    hasPhoto: true,
  },
  {
    id: '2',
    reportId: 'SLP-2024-00148',
    phoneNumber: '9876543210',
    issueType: 'hawker',
    location: 'Murarji Peth Main Road',
    description: 'Street vendors blocking half the road',
    dateTime: '2024-01-15 10:20 AM',
    status: 'under_review',
    statusUpdatedAt: '2024-01-15 11:00 AM',
    hasPhoto: true,
  },
  {
    id: '3',
    reportId: 'SLP-2024-00142',
    phoneNumber: '9876543210',
    issueType: 'signal',
    location: 'Ashok Chowk Junction',
    description: 'Traffic signal not working since morning',
    dateTime: '2024-01-14 09:15 AM',
    status: 'closed',
    statusUpdatedAt: '2024-01-14 04:00 PM',
    hasPhoto: false,
  },
  {
    id: '4',
    reportId: 'SLP-2024-00149',
    phoneNumber: '9988776655',
    issueType: 'blocked',
    location: 'Hotgi Road, School Zone',
    description: 'Construction debris blocking one lane',
    dateTime: '2024-01-15 11:30 AM',
    status: 'received',
    statusUpdatedAt: '2024-01-15 11:30 AM',
    hasPhoto: true,
  },
  {
    id: '5',
    reportId: 'SLP-2024-00150',
    phoneNumber: '9988776655',
    issueType: 'parking',
    location: 'Bus Stand Circle',
    description: 'Auto-rickshaws parked illegally near bus stop',
    dateTime: '2024-01-15 12:00 PM',
    status: 'under_review',
    statusUpdatedAt: '2024-01-15 01:15 PM',
    hasPhoto: false,
  },
];

export const reportStatusLabels: Record<ReportStatus, string> = {
  received: 'Received',
  under_review: 'Under Review',
  action_planned: 'Action Planned',
  closed: 'Closed',
};

export const dashboardStats = {
  activeCongestionZones: 5,
  newRuleRecommendations: 3,
  highRiskParkingAreas: 4,
  obstructionHotspots: 5,
  peakHourAlerts: 4,
  totalReportsToday: 127,
  resolvedActionsToday: 8,
  pendingActions: 12,
};
