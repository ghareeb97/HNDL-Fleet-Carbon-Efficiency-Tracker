import { useState, useEffect } from 'react';
import { Truck, Gauge, Leaf, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Users, Calendar, MapPin, Plus, X, Package, Droplet, Settings, Wind, Timer, TreePine, Filter } from 'lucide-react';
import type { Vehicle, FormData, Inspection, VehicleDatabase, NewVehicle, Emissions, ProviderStats } from './types';

const vehicleDatabase: VehicleDatabase = {
  'Toyota': {
    models: ['Hiace', 'Coaster', 'Dyna'],
    fuelConsumption: { 'Hiace': 11.5, 'Coaster': 13.2, 'Dyna': 10.8 }
  },
  'Mercedes': {
    models: ['Sprinter', 'Actros', 'Atego'],
    fuelConsumption: { 'Sprinter': 12.1, 'Actros': 28.5, 'Atego': 18.3 }
  },
  'Isuzu': {
    models: ['NPR', 'NQR', 'FTR'],
    fuelConsumption: { 'NPR': 14.2, 'NQR': 16.8, 'FTR': 22.4 }
  },
  'Ford': {
    models: ['Transit', 'F-150', 'Ranger'],
    fuelConsumption: { 'Transit': 11.9, 'F-150': 13.5, 'Ranger': 9.2 }
  },
  'Hyundai': {
    models: ['H350', 'Mighty', 'HD120'],
    fuelConsumption: { 'H350': 10.8, 'Mighty': 15.6, 'HD120': 17.2 }
  }
};

const predefinedDestinations = [
  'Cairo Downtown',
  'Giza Pyramids Area',
  'New Cairo',
  'Nasr City',
  '6th October City',
  'Heliopolis',
  'Maadi',
  'Zamalek',
  'Sheikh Zayed',
  'Smart Village'
];

const FleetCarbonTracker = () => {
  const [activeTab, setActiveTab] = useState('inspection');
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehicleManager, setShowVehicleManager] = useState(false);
  const [newDestination, setNewDestination] = useState('');
  const [destinations, setDestinations] = useState<string[]>(predefinedDestinations);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [loadPhoto, setLoadPhoto] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    vehiclePlate: '',
    providerName: '',
    make: '',
    model: '',
    year: '',
    fuelType: 'Diesel',
    fuelEconomy: '',
    loadWeight: '',
    loadPhoto: null,
    tireCount: 4,
    tires: Array(4).fill({ pressure: '', treadDepth: '' }),
    oilCondition: 'clean',
    airFilter: 'clean',
    acUsage: false,
    includeIdleTime: false,
    idleTimePerStop: 15,
    stops: [{ location: '', lat: null, lng: null }],
    googleDistance: 0,
    abnormalities: ''
  });

  const [newVehicle, setNewVehicle] = useState<NewVehicle>({
    plate: '',
    providerName: '',
    make: '',
    model: '',
    year: '',
    fuelType: 'Diesel',
    fuelEconomy: '',
    tireCount: 4,
    tires: Array(4).fill({ pressure: '35', treadDepth: '7.0' })
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await loadVehicles();
    await loadInspections();
    await loadDestinations();

    // Load dummy data if no data exists (first time use)
    const hasVehicles = await window.storage.get('fleet-vehicles');
    const hasInspections = await window.storage.get('fleet-inspections');

    if (!hasVehicles || !hasInspections) {
      await loadDummyData();
    }
  };

  const loadDummyData = async () => {
    // Create dummy vehicles
    const dummyVehicles: Vehicle[] = [
      {
        id: 1,
        plate: 'ABC-1234',
        providerName: 'Express Logistics',
        make: 'Toyota',
        model: 'Hiace',
        year: '2022',
        fuelType: 'Diesel',
        fuelEconomy: '11.5',
        tireCount: 4,
        tires: [
          { pressure: '34', treadDepth: '6.5' },
          { pressure: '35', treadDepth: '6.8' },
          { pressure: '33', treadDepth: '6.2' },
          { pressure: '35', treadDepth: '6.7' }
        ],
        lastOdometer: 45280
      },
      {
        id: 2,
        plate: 'XYZ-5678',
        providerName: 'Fast Delivery Co',
        make: 'Mercedes',
        model: 'Sprinter',
        year: '2021',
        fuelType: 'Diesel',
        fuelEconomy: '12.1',
        tireCount: 4,
        tires: [
          { pressure: '36', treadDepth: '7.2' },
          { pressure: '35', treadDepth: '7.0' },
          { pressure: '36', treadDepth: '7.1' },
          { pressure: '35', treadDepth: '6.9' }
        ],
        lastOdometer: 38950
      },
      {
        id: 3,
        plate: 'DEF-9012',
        providerName: 'Express Logistics',
        make: 'Isuzu',
        model: 'NPR',
        year: '2023',
        fuelType: 'Diesel',
        fuelEconomy: '14.2',
        tireCount: 6,
        tires: [
          { pressure: '35', treadDepth: '8.0' },
          { pressure: '34', treadDepth: '7.8' },
          { pressure: '35', treadDepth: '8.1' },
          { pressure: '35', treadDepth: '7.9' },
          { pressure: '36', treadDepth: '8.0' },
          { pressure: '35', treadDepth: '7.7' }
        ],
        lastOdometer: 12450
      },
      {
        id: 4,
        plate: 'GHI-3456',
        providerName: 'Swift Transport',
        make: 'Ford',
        model: 'Transit',
        year: '2022',
        fuelType: 'Diesel',
        fuelEconomy: '11.9',
        tireCount: 4,
        tires: [
          { pressure: '35', treadDepth: '6.0' },
          { pressure: '34', treadDepth: '5.8' },
          { pressure: '35', treadDepth: '6.2' },
          { pressure: '36', treadDepth: '6.1' }
        ],
        lastOdometer: 28760
      }
    ];

    // Create dummy inspections across different months
    const dummyInspections: Inspection[] = [];
    const today = new Date();

    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const inspectionsPerMonth = Math.floor(Math.random() * 3) + 3; // 3-5 inspections per month

      for (let i = 0; i < inspectionsPerMonth; i++) {
        const vehicle = dummyVehicles[Math.floor(Math.random() * dummyVehicles.length)];
        const inspectionDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, Math.floor(Math.random() * 28) + 1);
        const distance = Math.floor(Math.random() * 100) + 50; // 50-150 km
        const loadWeight = Math.floor(Math.random() * 500) + 200; // 200-700 kg
        const stopCount = Math.floor(Math.random() * 4) + 2; // 2-5 stops

        const stops = Array(stopCount).fill(null).map(() => ({
          location: destinations[Math.floor(Math.random() * destinations.length)],
          lat: null,
          lng: null
        }));

        const formData: FormData = {
          date: inspectionDate.toISOString().split('T')[0],
          vehiclePlate: vehicle.plate,
          providerName: vehicle.providerName,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          fuelType: vehicle.fuelType,
          fuelEconomy: vehicle.fuelEconomy,
          loadWeight: loadWeight.toString(),
          loadPhoto: null,
          tireCount: vehicle.tireCount,
          tires: vehicle.tires.map(t => ({
            pressure: (parseFloat(t.pressure) + (Math.random() * 2 - 1)).toFixed(0),
            treadDepth: (parseFloat(t.treadDepth) - Math.random() * 0.3).toFixed(1)
          })),
          oilCondition: Math.random() > 0.8 ? 'degraded' : 'clean',
          airFilter: Math.random() > 0.7 ? 'dusty' : 'clean',
          acUsage: Math.random() > 0.5,
          includeIdleTime: true,
          idleTimePerStop: 15,
          stops,
          googleDistance: distance,
          abnormalities: Math.random() > 0.8 ? 'Minor oil leak detected' : ''
        };

        const emissions = calculateEmissions(formData);

        dummyInspections.push({
          ...formData,
          id: Date.now() + i + monthOffset * 100,
          timestamp: inspectionDate.toISOString(),
          odometerEnd: vehicle.lastOdometer + distance,
          emissions
        });
      }
    }

    // Sort inspections by date
    dummyInspections.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Save dummy data
    try {
      await window.storage.set('fleet-vehicles', JSON.stringify(dummyVehicles));
      await window.storage.set('fleet-inspections', JSON.stringify(dummyInspections));

      setVehicles(dummyVehicles);
      setInspections(dummyInspections);
    } catch (error) {
      console.error('Failed to save dummy data:', error);
    }
  };

  const loadDestinations = async () => {
    try {
      const result = await window.storage.get('fleet-destinations');
      if (result) {
        setDestinations(JSON.parse(result.value));
      }
    } catch (error) {
      setDestinations(predefinedDestinations);
    }
  };

  const addDestination = async () => {
    if (newDestination.trim() && !destinations.includes(newDestination.trim())) {
      const updated = [...destinations, newDestination.trim()];
      setDestinations(updated);
      try {
        await window.storage.set('fleet-destinations', JSON.stringify(updated));
        setNewDestination('');
      } catch (error) {
        console.error('Failed to save destination:', error);
      }
    }
  };

  const loadVehicles = async () => {
    try {
      const result = await window.storage.get('fleet-vehicles');
      if (result) {
        setVehicles(JSON.parse(result.value));
      }
    } catch (error) {
      setVehicles([]);
    }
  };

  const loadInspections = async () => {
    try {
      const result = await window.storage.get('fleet-inspections');
      if (result) {
        setInspections(JSON.parse(result.value));
      }
    } catch (error) {
      setInspections([]);
    }
  };

  const saveVehicle = async () => {
    if (!newVehicle.plate || !newVehicle.providerName || !newVehicle.make || !newVehicle.model || !newVehicle.year) {
      alert('Please fill in all required fields');
      return;
    }

    const vehicleData = {
      ...newVehicle,
      id: Date.now(),
      lastOdometer: 0
    };

    const updated = [...vehicles, vehicleData];
    setVehicles(updated);

    try {
      await window.storage.set('fleet-vehicles', JSON.stringify(updated));
      alert('Vehicle added successfully!');
      setNewVehicle({
        plate: '',
        providerName: '',
        make: '',
        model: '',
        year: '',
        fuelType: 'Diesel',
        fuelEconomy: '',
        tireCount: 4,
        tires: Array(4).fill({ pressure: '35', treadDepth: '7.0' })
      });
      setShowVehicleManager(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save vehicle');
    }
  };

  const handleVehicleSelect = (plate: string) => {
    const vehicle = vehicles.find(v => v.plate === plate);
    if (vehicle) {
      setFormData({
        ...formData,
        vehiclePlate: vehicle.plate,
        providerName: vehicle.providerName,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        fuelType: vehicle.fuelType,
        fuelEconomy: vehicle.fuelEconomy,
        tireCount: vehicle.tireCount,
        tires: vehicle.tires.map(t => ({ ...t }))
      });
    }
  };

  const handleMakeChange = (make: string, isNew = false) => {
    if (isNew) {
      setNewVehicle({
        ...newVehicle,
        make,
        model: '',
        fuelEconomy: ''
      });
    } else {
      setFormData({
        ...formData,
        make,
        model: '',
        fuelEconomy: ''
      });
    }
  };

  const handleModelChange = (model: string, isNew = false) => {
    if (isNew) {
      const make = newVehicle.make;
      const fuelConsumption = vehicleDatabase[make as keyof VehicleDatabase]?.fuelConsumption[model] || '';
      setNewVehicle({
        ...newVehicle,
        model,
        fuelEconomy: fuelConsumption.toString()
      });
    } else {
      const make = formData.make;
      const fuelConsumption = vehicleDatabase[make as keyof VehicleDatabase]?.fuelConsumption[model] || '';
      setFormData({
        ...formData,
        model,
        fuelEconomy: fuelConsumption.toString()
      });
    }
  };

  const saveInspection = async () => {
    if (!formData.vehiclePlate || !formData.date) {
      alert('Please select a vehicle and date');
      return;
    }

    const finalOdometer = parseFloat((formData.odometerStart || 0).toString()) + formData.googleDistance;

    const newInspection = {
      ...formData,
      odometerEnd: finalOdometer,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      emissions: calculateEmissions(formData)
    };

    const updated = [...inspections, newInspection];
    setInspections(updated);

    const vehicleIndex = vehicles.findIndex(v => v.plate === formData.vehiclePlate);
    if (vehicleIndex !== -1) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[vehicleIndex].lastOdometer = finalOdometer;
      updatedVehicles[vehicleIndex].tires = formData.tires.map(t => ({ ...t }));
      setVehicles(updatedVehicles);

      try {
        await window.storage.set('fleet-vehicles', JSON.stringify(updatedVehicles));
      } catch (error) {
        console.error('Failed to update vehicle data:', error);
      }
    }

    try {
      await window.storage.set('fleet-inspections', JSON.stringify(updated));
      alert('Inspection saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save inspection');
    }
  };

  const calculateEmissions = (data: FormData): Emissions => {
    const baseConsumption = parseFloat(data.fuelEconomy) || 9;
    const distance = parseFloat(data.googleDistance.toString()) || 0;
    const loadWeight = parseFloat(data.loadWeight) || 0;

    const avgPressureLoss = data.tires.reduce((sum, tire) => {
      const pressure = parseFloat(tire.pressure) || 35;
      return sum + Math.max(0, 35 - pressure);
    }, 0) / data.tireCount;
    const pressureImpact = avgPressureLoss * 0.002;

    const oilImpact = data.oilCondition === 'degraded' ? 0.01 : 0;

    const filterImpact = data.airFilter === 'dusty' ? 0.05 : data.airFilter === 'very_dusty' ? 0.10 : 0;

    const loadImpact = (loadWeight / 100) * 0.004;

    const adjustedConsumption = baseConsumption * (1 + pressureImpact + oilImpact + filterImpact) + (loadImpact * 100);
    const fuelUsed = (adjustedConsumption * distance) / 100;

    const emissionFactors: { [key: string]: number } = {
      'Diesel': 2.75,
      'Gasoline': 2.31,
      'CNG': 1.89,
      'Electric': 0
    };
    const emissionFactor = emissionFactors[data.fuelType] || 2.75;
    const fuelEmissions = fuelUsed * emissionFactor;

    const tireWear = data.tireCount * 0.25;

    const oilContribution = (26 / 10000) * distance;

    const totalIdleStops = data.stops.length;
    const idleTime = data.includeIdleTime ? (totalIdleStops * data.idleTimePerStop) : 0;
    const idleEmissions = data.fuelType === 'Electric' ? 0 : (idleTime / 60) * 1.0 * emissionFactor;

    return {
      fuel: fuelEmissions,
      tires: tireWear,
      oil: oilContribution,
      idle: idleEmissions,
      total: fuelEmissions + tireWear + oilContribution + idleEmissions
    };
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vehiclePlate: '',
      providerName: '',
      make: '',
      model: '',
      year: '',
      fuelType: 'Diesel',
      fuelEconomy: '',
      loadWeight: '',
      loadPhoto: null,
      tireCount: 4,
      tires: Array(4).fill({ pressure: '', treadDepth: '' }),
      oilCondition: 'clean',
      airFilter: 'clean',
      acUsage: false,
      includeIdleTime: false,
      idleTimePerStop: 15,
      stops: [{ location: '', lat: null, lng: null }],
      googleDistance: 0,
      abnormalities: ''
    });
    setLoadPhoto(null);
  };

  const getReportData = () => {
    let filteredInspections = inspections;

    if (dateFilter.start) {
      filteredInspections = filteredInspections.filter(i => i.date >= dateFilter.start);
    }
    if (dateFilter.end) {
      filteredInspections = filteredInspections.filter(i => i.date <= dateFilter.end);
    }

    if (filteredInspections.length === 0) return null;

    const totalEmissions = filteredInspections.reduce((sum, i) => sum + i.emissions.total, 0);
    const totalDistance = filteredInspections.reduce((sum, i) => sum + ((typeof i.googleDistance === 'number' ? i.googleDistance : parseFloat(i.googleDistance)) || 0), 0);
    const totalIdleTime = filteredInspections.reduce((sum, i) => {
      const stops = i.stops?.length || 0;
      return sum + (i.includeIdleTime ? (stops * i.idleTimePerStop) : 0);
    }, 0);

    const emissionsBySource = {
      fuel: filteredInspections.reduce((sum, i) => sum + i.emissions.fuel, 0),
      tires: filteredInspections.reduce((sum, i) => sum + i.emissions.tires, 0),
      oil: filteredInspections.reduce((sum, i) => sum + i.emissions.oil, 0),
      idle: filteredInspections.reduce((sum, i) => sum + i.emissions.idle, 0)
    };

    const providerStats: { [key: string]: ProviderStats } = {};
    filteredInspections.forEach(i => {
      if (!providerStats[i.providerName]) {
        providerStats[i.providerName] = { trips: 0, emissions: 0, distance: 0 };
      }
      providerStats[i.providerName].trips++;
      providerStats[i.providerName].emissions += i.emissions.total;
      providerStats[i.providerName].distance += (typeof i.googleDistance === 'number' ? i.googleDistance : parseFloat(i.googleDistance)) || 0;
    });

    const treesNeeded = Math.ceil((totalEmissions / 1000) * 45);

    // Calculate monthly emissions trend
    const monthlyEmissions: { [key: string]: number } = {};
    filteredInspections.forEach(i => {
      const date = new Date(i.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyEmissions[monthKey]) {
        monthlyEmissions[monthKey] = 0;
      }
      monthlyEmissions[monthKey] += i.emissions.total / 1000; // Convert to tons
    });

    // Sort by month and prepare chart data
    const sortedMonths = Object.keys(monthlyEmissions).sort();
    const monthlyTrend = sortedMonths.map(month => ({
      month,
      emissions: monthlyEmissions[month]
    }));

    return {
      totalEmissions: totalEmissions / 1000,
      totalDistance,
      totalIdleTime,
      emissionsPerKm: totalDistance > 0 ? totalEmissions / totalDistance : 0,
      emissionsBySource,
      providerStats,
      treesNeeded,
      fleetEfficiencyScore: calculateFleetScore(filteredInspections, totalIdleTime, totalDistance),
      monthlyTrend
    };
  };

  const calculateFleetScore = (inspections: Inspection[], totalIdleTime: number, totalDistance: number): number => {
    let score = 100;

    const avgIdleRatio = totalIdleTime / (totalDistance / 60);
    if (avgIdleRatio > 0.1) score -= (avgIdleRatio - 0.1) * 200;

    const tirePressureScore = inspections.reduce((sum, i) => {
      const avgPressure = i.tires.reduce((s, t) => s + (parseFloat(t.pressure) || 35), 0) / i.tireCount;
      return sum + (Math.abs(35 - avgPressure) < 3 ? 1 : 0);
    }, 0) / inspections.length;
    score = score * 0.7 + tirePressureScore * 30;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const updateTireField = (index: number, field: string, value: string) => {
    const newTires = [...formData.tires];
    newTires[index] = { ...newTires[index], [field]: value };
    setFormData({ ...formData, tires: newTires });
  };

  const updateNewVehicleTire = (index: number, field: string, value: string) => {
    const newTires = [...newVehicle.tires];
    newTires[index] = { ...newTires[index], [field]: value };
    setNewVehicle({ ...newVehicle, tires: newTires });
  };

  const addStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { location: '', lat: null, lng: null }]
    });
  };

  const removeStop = (index: number) => {
    if (formData.stops.length > 1) {
      const newStops = formData.stops.filter((_, i) => i !== index);
      setFormData({ ...formData, stops: newStops });
      if (newStops.length >= 1) {
        calculateDistance(newStops);
      }
    }
  };

  const updateStop = (index: number, value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], location: value };
    setFormData({ ...formData, stops: newStops });
  };

  const calculateDistance = async (stops: { location: string; lat: number | null; lng: number | null }[]) => {
    if (stops.length < 1) {
      setFormData(prev => ({ ...prev, googleDistance: 0 }));
      return;
    }

    const validStops = stops.filter((s: { location: string }) => s.location.trim());
    if (validStops.length < 1) return;

    try {
      const estimatedDistance = (validStops.length + 1) * 25;
      setFormData(prev => ({ ...prev, googleDistance: estimatedDistance }));
    } catch (error) {
      console.error('Distance calculation failed:', error);
    }
  };

  const handleCalculateRoute = () => {
    calculateDistance(formData.stops);
  };

  const handleLoadPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLoadPhoto(result);
        setFormData({ ...formData, loadPhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const reportData = getReportData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="border-l-2 border-slate-300 pl-4">
                <h1 className="text-3xl font-bold text-blue-600">HNDL</h1>
                <p className="text-slate-600">Fleet Management - Carbon & Efficiency Tracking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Total Inspections</div>
              <div className="text-3xl font-bold text-blue-600">{inspections.length}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('inspection')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'inspection'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Daily Inspection
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Inspection History
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'report'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Carbon Report
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'vehicles'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-5 h-5" />
            Vehicle Manager
          </button>
        </div>

        {activeTab === 'inspection' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Daily Inspection Form
            </h2>

            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Date & Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Inspection Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Vehicle Plate *
                    </label>
                    <select
                      value={formData.vehiclePlate}
                      onChange={(e) => handleVehicleSelect(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Vehicle...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.plate}>{v.plate} - {v.make} {v.model}</option>
                      ))}
                    </select>
                    {vehicles.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">No vehicles added. Go to Vehicle Manager to add one.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Provider Name</label>
                    <input
                      type="text"
                      value={formData.providerName}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.make}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
                    <input
                      type="text"
                      value={formData.fuelType}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Economy (L/100km)</label>
                    <input
                      type="text"
                      value={formData.fuelEconomy}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Load Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Load Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.loadWeight}
                      onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Load Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLoadPhotoChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {loadPhoto && (
                      <img src={loadPhoto} alt="Load" className="mt-2 h-24 rounded border" />
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Pre-Trip Checks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Oil Condition <span className="text-xs text-blue-500 ml-1">(Phase 2)</span>
                    </label>
                    <select
                      value={formData.oilCondition}
                      onChange={(e) => setFormData({ ...formData, oilCondition: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="clean">Clean</option>
                      <option value="normal">Normal</option>
                      <option value="degraded">Degraded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Air Filter
                    </label>
                    <select
                      value={formData.airFilter}
                      onChange={(e) => setFormData({ ...formData, airFilter: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="clean">Clean</option>
                      <option value="dusty">Dusty</option>
                      <option value="very_dusty">Very Dusty</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.acUsage}
                      onChange={(e) => setFormData({ ...formData, acUsage: e.target.checked })}
                      className="w-4 h-4 text-blue-500"
                    />
                    <Wind className="w-4 h-4" />
                    <span className="text-sm font-medium text-slate-700">AC Usage Expected <span className="text-xs text-blue-500">(Phase 2)</span></span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.includeIdleTime}
                      onChange={(e) => setFormData({ ...formData, includeIdleTime: e.target.checked })}
                      className="w-4 h-4 text-blue-500"
                    />
                    <Timer className="w-4 h-4" />
                    <span className="text-sm font-medium text-slate-700">Include Idle Time in Calculations <span className="text-xs text-blue-500">(Phase 2)</span></span>
                  </label>

                  {formData.includeIdleTime && (
                    <div className="ml-6 mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expected Idle Time per Stop (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.idleTimePerStop}
                        onChange={(e) => setFormData({ ...formData, idleTimePerStop: parseFloat(e.target.value) || 0 })}
                        className="w-40 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Total idle time: {((formData.stops.length) * formData.idleTimePerStop).toFixed(0)} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Tire Inspection <span className="text-xs text-blue-500">(Phase 2)</span></h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Tires: {formData.tireCount} (from vehicle data)
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {formData.tires.map((tire, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-700 mb-3">Tire {index + 1}</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1 flex items-center gap-1">
                            <Gauge className="w-3 h-3" />
                            Pressure (psi)
                          </label>
                          <input
                            type="number"
                            value={tire.pressure}
                            onChange={(e) => updateTireField(index, 'pressure', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="35"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Tread Depth (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tire.treadDepth}
                            onChange={(e) => updateTireField(index, 'treadDepth', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="6.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Trip Route & Stops
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-2 items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                      W
                    </div>
                    <input
                      type="text"
                      value="Warehouse"
                      readOnly
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  </div>
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <select
                        value={stop.location}
                        onChange={(e) => updateStop(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Destination...</option>
                        {destinations.map((dest, i) => (
                          <option key={i} value={dest}>{dest}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeStop(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={addStop}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Stop
                  </button>
                  <button
                    onClick={handleCalculateRoute}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Calculate Distance
                  </button>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Manage Destinations</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      placeholder="Enter new destination"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addDestination}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.googleDistance > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Total Route Distance:</span>
                      <span className="text-2xl font-bold text-blue-600">{formData.googleDistance} km</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Estimated distance for {formData.stops.length + 1} stops (including warehouse)
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Additional Notes</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Abnormalities / Issues</label>
                  <textarea
                    value={formData.abnormalities}
                    onChange={(e) => setFormData({ ...formData, abnormalities: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Report any issues, fuel leaks, mechanical problems, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  onClick={saveInspection}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Save Inspection
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {inspections.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  Inspection History ({inspections.length} total)
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Vehicle</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Provider</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Distance (km)</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Load (kg)</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Stops</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Emissions (kg)</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections
                        .slice()
                        .reverse()
                        .map((inspection) => (
                          <tr key={inspection.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-700">
                              {new Date(inspection.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">{inspection.vehiclePlate}</div>
                              <div className="text-xs text-slate-500">{inspection.make} {inspection.model}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700">{inspection.providerName}</td>
                            <td className="text-right py-3 px-4 text-slate-700">{inspection.googleDistance}</td>
                            <td className="text-right py-3 px-4 text-slate-700">{inspection.loadWeight || '-'}</td>
                            <td className="text-right py-3 px-4 text-slate-700">{inspection.stops.length}</td>
                            <td className="text-right py-3 px-4">
                              <span className="font-semibold text-slate-800">
                                {inspection.emissions.total.toFixed(1)}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              {inspection.abnormalities ? (
                                <div className="flex items-center justify-center gap-1 text-amber-600">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="text-xs">Issues</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-xs">OK</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">
                        <strong>Tip:</strong> View detailed analytics and trends in the <strong>Carbon Report</strong> tab.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Inspection History</h3>
                <p className="text-slate-500">Complete daily inspections to see history here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-500" />
                Vehicle Manager
              </h2>
              <button
                onClick={() => setShowVehicleManager(!showVehicleManager)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showVehicleManager ? 'Cancel' : '+ Add Vehicle'}
              </button>
            </div>

            {showVehicleManager && (
              <div className="border-2 border-blue-200 rounded-lg p-6 mb-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Vehicle</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Plate *</label>
                      <input
                        type="text"
                        value={newVehicle.plate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="ABC-1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Provider Name *</label>
                      <input
                        type="text"
                        value={newVehicle.providerName}
                        onChange={(e) => setNewVehicle({ ...newVehicle, providerName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Make *</label>
                      <select
                        value={newVehicle.make}
                        onChange={(e) => handleMakeChange(e.target.value, true)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Make...</option>
                        {Object.keys(vehicleDatabase).map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Model *</label>
                      <select
                        value={newVehicle.model}
                        onChange={(e) => handleModelChange(e.target.value, true)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={!newVehicle.make}
                      >
                        <option value="">Select Model...</option>
                        {newVehicle.make && vehicleDatabase[newVehicle.make]?.models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Year *</label>
                      <select
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Year...</option>
                        {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
                      <select
                        value={newVehicle.fuelType}
                        onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Economy (L/100km)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newVehicle.fuelEconomy}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Tires</label>
                    <input
                      type="number"
                      value={newVehicle.tireCount}
                      onChange={(e) => {
                        const count = parseInt(e.target.value) || 4;
                        setNewVehicle({
                          ...newVehicle,
                          tireCount: count,
                          tires: Array(count).fill({ pressure: '35', treadDepth: '7.0' })
                        });
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="4"
                      max="18"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Initial Tire Data</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {newVehicle.tires.map((tire, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-white">
                          <div className="text-xs font-semibold text-slate-600 mb-2">Tire {index + 1}</div>
                          <div className="space-y-2">
                            <input
                              type="number"
                              value={tire.pressure}
                              onChange={(e) => updateNewVehicleTire(index, 'pressure', e.target.value)}
                              className="w-full px-2 py-1 text-sm border rounded"
                              placeholder="psi"
                            />
                            <input
                              type="number"
                              step="0.1"
                              value={tire.treadDepth}
                              onChange={(e) => updateNewVehicleTire(index, 'treadDepth', e.target.value)}
                              className="w-full px-2 py-1 text-sm border rounded"
                              placeholder="mm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveVehicle}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                      Save Vehicle
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Registered Vehicles ({vehicles.length})</h3>
              {vehicles.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No vehicles registered yet. Click "Add Vehicle" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-slate-800">{vehicle.plate}</h4>
                          <p className="text-sm text-slate-600">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {vehicle.tireCount} tires
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Provider:</span>
                          <span className="font-medium">{vehicle.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fuel Type:</span>
                          <span className="font-medium">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fuel Economy:</span>
                          <span className="font-medium">{vehicle.fuelEconomy} L/100km</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-6 h-6 text-blue-500" />
                  Filter by Date
                </h3>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setDateFilter({ start: '', end: '' })}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {!reportData ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Data Available</h3>
                <p className="text-slate-600">Complete some inspections to generate the carbon report.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="text-blue-100 text-sm">Total Emissions</div>
                      <div className="text-3xl font-bold">{reportData.totalEmissions.toFixed(2)}</div>
                      <div className="text-blue-100 text-sm">tons CO₂e</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="text-blue-100 text-sm">Total Distance</div>
                      <div className="text-3xl font-bold">{reportData.totalDistance.toFixed(0)}</div>
                      <div className="text-blue-100 text-sm">km</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="text-blue-100 text-sm">Efficiency Score</div>
                      <div className="text-3xl font-bold">{reportData.fleetEfficiencyScore}</div>
                      <div className="text-blue-100 text-sm">/ 100</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="text-blue-100 text-sm">Emissions per km</div>
                      <div className="text-3xl font-bold">{(reportData.emissionsPerKm * 1000).toFixed(1)}</div>
                      <div className="text-blue-100 text-sm">g CO₂e/km</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-blue-500" />
                    Monthly Emissions Trend
                  </h3>
                  {reportData.monthlyTrend.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-64 relative">
                        <svg viewBox="0 0 800 300" className="w-full h-full">
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map(i => (
                            <line
                              key={i}
                              x1="60"
                              y1={40 + i * 50}
                              x2="780"
                              y2={40 + i * 50}
                              stroke="#e2e8f0"
                              strokeWidth="1"
                            />
                          ))}

                          {/* Y-axis labels */}
                          {[0, 1, 2, 3, 4].map(i => {
                            const maxEmissions = Math.max(...reportData.monthlyTrend.map(d => d.emissions));
                            const value = (maxEmissions * (4 - i) / 4).toFixed(2);
                            return (
                              <text
                                key={i}
                                x="50"
                                y={44 + i * 50}
                                fontSize="12"
                                fill="#64748b"
                                textAnchor="end"
                              >
                                {value}
                              </text>
                            );
                          })}

                          {/* Line chart */}
                          {(() => {
                            const maxEmissions = Math.max(...reportData.monthlyTrend.map(d => d.emissions));
                            const points = reportData.monthlyTrend.map((data, index) => {
                              const x = 60 + (index * (720 / Math.max(reportData.monthlyTrend.length - 1, 1)));
                              const y = 240 - ((data.emissions / maxEmissions) * 200);
                              return { x, y, data };
                            });

                            const pathData = points.map((p, i) =>
                              `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                            ).join(' ');

                            return (
                              <>
                                {/* Line */}
                                <path
                                  d={pathData}
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Area under line */}
                                <path
                                  d={`${pathData} L ${points[points.length - 1].x} 240 L 60 240 Z`}
                                  fill="url(#gradient)"
                                  opacity="0.3"
                                />

                                {/* Data points */}
                                {points.map((point, index) => (
                                  <g key={index}>
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="5"
                                      fill="#3b82f6"
                                      stroke="white"
                                      strokeWidth="2"
                                    />
                                    <text
                                      x={point.x}
                                      y="270"
                                      fontSize="11"
                                      fill="#64748b"
                                      textAnchor="middle"
                                      transform={`rotate(-45, ${point.x}, 270)`}
                                    >
                                      {point.data.month}
                                    </text>
                                  </g>
                                ))}
                              </>
                            );
                          })()}

                          {/* Gradient definition */}
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Axes */}
                          <line x1="60" y1="240" x2="780" y2="240" stroke="#94a3b8" strokeWidth="2" />
                          <line x1="60" y1="40" x2="60" y2="240" stroke="#94a3b8" strokeWidth="2" />

                          {/* Y-axis label */}
                          <text x="20" y="140" fontSize="12" fill="#64748b" transform="rotate(-90, 20, 140)" textAnchor="middle">
                            Emissions (tons CO₂e)
                          </text>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {reportData.monthlyTrend.map((data, index) => (
                          <div key={index} className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-xs text-slate-600">{data.month}</div>
                            <div className="text-sm font-bold text-slate-800">{data.emissions.toFixed(2)}t</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-8">Not enough data to show monthly trends</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TreePine className="w-6 h-6 text-green-600" />
                    Carbon Offset
                  </h3>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-700 mb-2">To offset your fleet's carbon emissions, you need to plant:</p>
                        <div className="text-4xl font-bold text-green-600 mb-2">{reportData.treesNeeded} Trees</div>
                        <p className="text-sm text-slate-600">Based on {reportData.totalEmissions.toFixed(2)} tons CO₂e emissions</p>
                        <p className="text-xs text-slate-500 mt-2">* Assumes each tree absorbs ~22kg CO₂/year over 20 years</p>
                      </div>
                      <TreePine className="w-24 h-24 text-green-500 opacity-20" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-blue-500" />
                      Emissions by Source
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(reportData.emissionsBySource).map(([source, value]) => {
                        const total = Object.values(reportData.emissionsBySource).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return (
                          <div key={source}>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-700 capitalize">{source}</span>
                              <span className="font-semibold">{(value / 1000).toFixed(2)} tons ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-blue-500" />
                      Emissions Distribution
                    </h3>
                    <div className="relative" style={{ height: '200px' }}>
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {(() => {
                          const data = Object.entries(reportData.emissionsBySource);
                          const total = data.reduce((sum, [, val]) => sum + val, 0);
                          let currentAngle = 0;
                          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

                          return data.map(([source, value], index) => {
                            const percentage = value / total;
                            const angle = percentage * 360;
                            const startAngle = currentAngle;
                            currentAngle += angle;

                            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                            const x2 = 100 + 80 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                            const y2 = 100 + 80 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                            const largeArc = angle > 180 ? 1 : 0;

                            return (
                              <g key={source}>
                                <path
                                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={colors[index]}
                                  opacity="0.8"
                                />
                              </g>
                            );
                          });
                        })()}
                      </svg>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Object.entries(reportData.emissionsBySource).map(([source], index) => {
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
                        return (
                          <div key={source} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                            <span className="text-sm text-slate-700 capitalize">{source}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    Provider Performance
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Provider</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Trips</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Emissions (kg)</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Distance (km)</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">g/km</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(reportData.providerStats).map(([provider, stats]) => (
                          <tr key={provider} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">{provider}</td>
                            <td className="text-right py-3 px-4">{stats.trips}</td>
                            <td className="text-right py-3 px-4">{stats.emissions.toFixed(1)}</td>
                            <td className="text-right py-3 px-4">{stats.distance.toFixed(0)}</td>
                            <td className="text-right py-3 px-4">{stats.distance > 0 ? (stats.emissions / stats.distance * 1000).toFixed(1) : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-blue-500" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-800 mb-1">Immediate Actions (0-30 days)</h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li>• Ensure all tires are inflated to optimal pressure (35 psi)</li>
                        <li>• Reduce idle time by implementing no-idle policies</li>
                        <li>• Optimize routes to minimize unnecessary distance</li>
                        <li>• Check and replace dirty air filters</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-800 mb-1">Medium-Term Actions (30-90 days)</h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li>• Implement driver training programs for fuel-efficient driving</li>
                        <li>• Schedule regular maintenance to keep engines running efficiently</li>
                        <li>• Review load factors to optimize vehicle utilization</li>
                        <li>• Consider switching work from lower-performing providers</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-800 mb-1">Long-Term Actions (3-12 months)</h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li>• Evaluate fleet replacement with more fuel-efficient vehicles</li>
                        <li>• Consider electric vehicles for suitable routes</li>
                        <li>• Implement telematics for real-time monitoring</li>
                        <li>• Set carbon reduction targets and track progress</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Gauge className="w-6 h-6 text-blue-500" />
                    World-Class Benchmarks
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Fuel Economy Target</div>
                        <div className="text-2xl font-bold text-slate-800">7.0-7.8</div>
                        <div className="text-xs text-slate-500">L/100km (world-class)</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Idle Time Target</div>
                        <div className="text-2xl font-bold text-slate-800">&lt;10%</div>
                        <div className="text-xs text-slate-500">of engine hours</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Tire Pressure Accuracy</div>
                        <div className="text-2xl font-bold text-slate-800">±3 psi</div>
                        <div className="text-xs text-slate-500">from optimal</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-slate-700">
                        <strong>Insight:</strong> Based on industry benchmarks, optimizing your fleet to world-class standards
                        could reduce emissions by 15-25% through improved tire maintenance, reduced idling, and better route planning.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetCarbonTracker;
