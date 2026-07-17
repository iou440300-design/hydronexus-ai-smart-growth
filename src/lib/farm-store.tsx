import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { HardwareService, type DeviceState, type SensorReading } from "./hardware-service";

export type Severity = "low" | "medium" | "high" | "critical";
export interface AlertItem {
  id: string;
  title: string;
  description: string;
  action: string;
  severity: Severity;
  ts: number;
  read?: boolean;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  crop: string;
  plantingDate: string;
  harvestDate: string;
  stage: string;
  owner: string;
  notes: string;
}

export type Scenario =
  | "healthy"
  | "lowWater"
  | "highPh"
  | "highTemp"
  | "pumpFailure"
  | "powerFailure"
  | "sensorFailure"
  | "nutrientDeficiency"
  | "lowHumidity"
  | "harvestReady"
  | "internetFailure";

interface Ctx {
  sensors: SensorReading;
  devices: DeviceState;
  alerts: AlertItem[];
  farms: Farm[];
  activeFarmId: string;
  history: { t: number; ph: number; ec: number; waterTemp: number; airTemp: number; humidity: number; water: number; energy: number; growth: number }[];
  scenario: Scenario;
  liveMode: boolean;
  demoMode: boolean;
  farmHealth: number;
  lastUpdated: number;
  lastRecommendation: string;

  setDevice: (k: keyof DeviceState, v: boolean | number) => void;
  runScenario: (s: Scenario) => void;
  clearAlerts: () => void;
  markAllRead: () => void;
  addAlert: (a: Omit<AlertItem, "id" | "ts">) => void;
  setActiveFarm: (id: string) => void;
  addFarm: (f: Omit<Farm, "id">) => void;
  toggleLiveMode: () => void;
  emergencyStop: () => void;
}

const FarmContext = createContext<Ctx | null>(null);

const seedFarms: Farm[] = [
  { id: "f1", name: "Lekki Vertical Farm", location: "Lagos, Nigeria", crop: "Lettuce", plantingDate: "2026-06-14", harvestDate: "2026-07-30", stage: "Vegetative", owner: "AgroPulse Ops", notes: "NFT system, 4 towers, 128 plant sites." },
  { id: "f2", name: "Abuja Greenhouse #2", location: "Abuja, FCT", crop: "Tomato", plantingDate: "2026-05-02", harvestDate: "2026-08-18", stage: "Flowering", owner: "AgroPulse Ops", notes: "Dutch bucket, 40 plants." },
  { id: "f3", name: "Kano Trial Site", location: "Kano, Nigeria", crop: "Basil", plantingDate: "2026-06-30", harvestDate: "2026-08-05", stage: "Seedling", owner: "Community Coop", notes: "DWC, community demo." },
];

const baseline: SensorReading = {
  waterLevel: 82,
  ph: 6.2,
  ec: 1.8,
  tds: 900,
  waterTemp: 22.5,
  airTemp: 27.5,
  humidity: 68,
  light: 42000,
  nutrient: 74,
  flow: 2.4,
  pump: true,
};

const baseDevices: DeviceState = {
  waterPump: true,
  nutrientPump: false,
  lighting: true,
  fans: true,
  drainValve: false,
  autoMode: true,
  solar: true,
  battery: 88,
  internet: true,
  energyKwh: 12.4,
  waterLiters: 148,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeHealth(s: SensorReading, d: DeviceState): number {
  let score = 100;
  if (s.waterLevel < 30) score -= 25;
  else if (s.waterLevel < 50) score -= 10;
  if (s.ph < 5.5 || s.ph > 7.0) score -= 15;
  if (s.ec < 1.2 || s.ec > 2.6) score -= 10;
  if (s.airTemp > 32) score -= 12;
  if (s.humidity < 45) score -= 8;
  if (!d.internet) score -= 5;
  if (!d.waterPump && d.autoMode) score -= 15;
  if (d.battery < 20) score -= 8;
  return clamp(Math.round(score), 0, 100);
}

export function FarmProvider({ children }: { children: ReactNode }) {
  const [sensors, setSensors] = useState<SensorReading>(baseline);
  const [devices, setDevices] = useState<DeviceState>(baseDevices);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [farms, setFarms] = useState<Farm[]>(seedFarms);
  const [activeFarmId, setActiveFarmId] = useState("f1");
  const [scenario, setScenario] = useState<Scenario>("healthy");
  const [liveMode, setLiveMode] = useState(false);
  const [history, setHistory] = useState<Ctx["history"]>(() => {
    const arr: Ctx["history"] = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--) {
      arr.push({
        t: now - i * 60 * 60 * 1000,
        ph: 6.1 + Math.sin(i / 3) * 0.25,
        ec: 1.75 + Math.cos(i / 4) * 0.2,
        waterTemp: 22 + Math.sin(i / 5) * 1.5,
        airTemp: 26 + Math.sin(i / 4) * 3,
        humidity: 65 + Math.cos(i / 3) * 8,
        water: 5 + Math.random() * 3,
        energy: 0.4 + Math.random() * 0.3,
        growth: clamp(20 + (23 - i) * 3 + Math.random() * 2, 0, 100),
      });
    }
    return arr;
  });
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [lastRecommendation, setLastRecommendation] = useState(
    "Maintain current schedule. pH and EC are within ideal range for lettuce."
  );

  const scenarioRef = useRef<Scenario>("healthy");
  scenarioRef.current = scenario;
  const devicesRef = useRef<DeviceState>(devices);
  devicesRef.current = devices;

  // Simulator tick
  useEffect(() => {
    const id = setInterval(() => {
      setSensors((prev) => {
        const jitter = (a: number) => (Math.random() - 0.5) * a;
        let next: SensorReading = {
          ...prev,
          waterLevel: clamp(prev.waterLevel + jitter(0.8), 0, 100),
          ph: clamp(prev.ph + jitter(0.06), 4, 9),
          ec: clamp(prev.ec + jitter(0.05), 0.4, 3.5),
          tds: clamp(prev.tds + jitter(20), 200, 1800),
          waterTemp: clamp(prev.waterTemp + jitter(0.15), 18, 30),
          airTemp: clamp(prev.airTemp + jitter(0.25), 18, 40),
          humidity: clamp(prev.humidity + jitter(0.9), 30, 95),
          light: clamp(prev.light + jitter(1500), 0, 100000),
          nutrient: clamp(prev.nutrient - 0.05 + jitter(0.4), 0, 100),
          flow: clamp(prev.flow + jitter(0.1), 0, 5),
        };

        // Realistic hardware behaviour: pump ON gradually refills reservoir; OFF stops flow & drains slowly.
        const dev = devicesRef.current;
        if (dev.waterPump) {
          next.waterLevel = clamp(next.waterLevel + 0.9, 0, 100);
          next.flow = clamp(2 + Math.random() * 0.8, 0, 5);
        } else {
          next.waterLevel = clamp(next.waterLevel - 0.15, 0, 100);
          next.flow = clamp(next.flow * 0.4, 0, 5);
        }
        if (dev.nutrientPump) next.nutrient = clamp(next.nutrient + 0.6, 0, 100);
        next.pump = dev.waterPump;

        const sc = scenarioRef.current;
        if (sc === "lowWater") next.waterLevel = clamp(next.waterLevel - 1.6, 0, 100);
        if (sc === "highPh") next.ph = clamp(next.ph + 0.08, 4, 9);
        if (sc === "highTemp") next.airTemp = clamp(next.airTemp + 0.4, 18, 45);
        if (sc === "lowHumidity") next.humidity = clamp(next.humidity - 1.2, 20, 95);
        if (sc === "nutrientDeficiency") next.ec = clamp(next.ec - 0.05, 0.4, 3.5);
        if (sc === "sensorFailure") next = { ...next, ph: 0, ec: 0, tds: 0 };
        return next;
      });

      setDevices((prev) => {
        const sc = scenarioRef.current;
        const next = { ...prev };
        if (sc === "pumpFailure") next.waterPump = false;
        if (sc === "powerFailure") {
          next.solar = false;
          next.battery = clamp(next.battery - 1.5, 0, 100);
          next.lighting = false;
        }
        if (sc === "internetFailure") next.internet = false;
        if (sc === "healthy") {
          next.internet = true;
          next.solar = true;
        }
        next.energyKwh = +(prev.energyKwh + 0.02 + Math.random() * 0.02).toFixed(2);
        next.waterLiters = +(prev.waterLiters + (prev.waterPump ? 0.35 : 0.05) + Math.random() * 0.05).toFixed(2);
        // Battery: solar recharges, actuators drain
        const drain = (prev.waterPump ? 0.08 : 0) + (prev.nutrientPump ? 0.04 : 0) + (prev.lighting ? 0.05 : 0) + (prev.fans ? 0.03 : 0);
        const charge = prev.solar ? 0.12 : 0;
        next.battery = clamp(prev.battery + charge - drain, 0, 100);
        return next;
      });

      setLastUpdated(Date.now());
    }, 1800);

    return () => clearInterval(id);
  }, []);

  // Rolling history
  useEffect(() => {
    const id = setInterval(() => {
      setHistory((prev) => {
        const next = [...prev.slice(1), {
          t: Date.now(),
          ph: sensors.ph,
          ec: sensors.ec,
          waterTemp: sensors.waterTemp,
          airTemp: sensors.airTemp,
          humidity: sensors.humidity,
          water: 5 + Math.random() * 3,
          energy: 0.4 + Math.random() * 0.3,
          growth: clamp((prev[prev.length - 1]?.growth ?? 40) + Math.random() * 0.6, 0, 100),
        }];
        return next;
      });
    }, 15000);
    return () => clearInterval(id);
  }, [sensors]);

  // Alerts generation
  useEffect(() => {
    const created: AlertItem[] = [];
    const now = Date.now();
    const mk = (id: string, title: string, description: string, action: string, severity: Severity) => {
      created.push({ id: `${id}-${now}`, title, description, action, severity, ts: now });
    };
    if (sensors.waterLevel < 25) mk("water", "Low Water Level", `Reservoir at ${sensors.waterLevel.toFixed(0)}%.`, "Enable Auto Refill or top-up manually.", "high");
    if (sensors.ph > 7.2) mk("ph", "High pH Detected", `pH is ${sensors.ph.toFixed(2)}.`, "Dose pH Down 5 ml and re-test in 30 min.", "medium");
    if (sensors.ec < 1.0 && sensors.ec > 0) mk("ec", "Low EC / Nutrient", `EC dropped to ${sensors.ec.toFixed(2)} mS/cm.`, "Dose Nutrient A+B 10 ml each.", "medium");
    if (!devices.waterPump && devices.autoMode) mk("pump", "Pump Failure", "Water pump did not respond to auto-cycle.", "Check power and impeller. Switch to backup.", "critical");
    if (!devices.solar && devices.battery < 30) mk("power", "Power Failure Risk", `Solar offline, battery at ${devices.battery.toFixed(0)}%.`, "Reduce loads. Charge from grid inverter.", "high");
    if (!devices.internet) mk("net", "Internet Offline", "Cloud sync unavailable.", "Falling back to local cache.", "low");
    if (sensors.airTemp > 32) mk("temp", "High Air Temperature", `${sensors.airTemp.toFixed(1)} °C in canopy.`, "Increase fan speed & activate misting.", "high");
    if (sensors.humidity < 45) mk("humidity", "Low Humidity", `${sensors.humidity.toFixed(0)}% RH.`, "Activate humidifier for 15 min.", "medium");

    if (created.length) {
      setAlerts((prev) => {
        const existingTitles = new Set(prev.slice(0, 8).map((a) => a.title));
        const dedup = created.filter((c) => !existingTitles.has(c.title));
        return [...dedup, ...prev].slice(0, 40);
      });
    }
  }, [sensors, devices]);

  // AI recommendation refresh
  useEffect(() => {
    const t = setTimeout(() => {
      if (sensors.waterLevel < 30) setLastRecommendation("Refill reservoir before next irrigation cycle. Estimated 42 L needed for 24 h autonomy.");
      else if (sensors.ph > 7) setLastRecommendation("pH trending alkaline. Dose 5 ml pH Down; recheck in 30 min for Nigerian tap water buffering.");
      else if (sensors.airTemp > 32) setLastRecommendation("Canopy heat stress risk. Boost fans to 80%, mist 8 s every 6 min, shade cloth if available.");
      else if (sensors.ec < 1.2 && sensors.ec > 0) setLastRecommendation("Nutrient depletion. Dose A+B 10 ml each, mix, wait 5 min before re-reading EC.");
      else setLastRecommendation("Stable growth window. Maintain 12 h light cycle. Expected harvest in 18 days.");
    }, 500);
    return () => clearTimeout(t);
  }, [sensors]);

  const setDevice = (k: keyof DeviceState, v: boolean | number) => {
    setDevices((prev) => ({ ...prev, [k]: v as never }));
    HardwareService.setDevice(k, v);
    // Auto mode auto-responds
    if (k === "autoMode" && v === true && sensors.waterLevel < 40) {
      setTimeout(() => {
        setSensors((s) => ({ ...s, waterLevel: clamp(s.waterLevel + 40, 0, 100) }));
      }, 1500);
    }
  };

  const runScenario = (s: Scenario) => {
    setScenario(s);
    if (s === "harvestReady") {
      setAlerts((prev) => [{
        id: `harvest-${Date.now()}`,
        title: "Harvest Ready",
        description: "Lettuce reached maturity — leaves at 18 cm, 42 days.",
        action: "Schedule harvest today or tomorrow morning.",
        severity: "medium",
        ts: Date.now(),
      }, ...prev]);
    }
    if (s === "healthy") {
      setSensors(baseline);
      setDevices(baseDevices);
    }
  };

  const clearAlerts = () => setAlerts([]);
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const addAlert = (a: Omit<AlertItem, "id" | "ts">) =>
    setAlerts((prev) => [{ ...a, id: `m-${Date.now()}`, ts: Date.now() }, ...prev]);

  const setActiveFarm = (id: string) => setActiveFarmId(id);
  const addFarm = (f: Omit<Farm, "id">) =>
    setFarms((prev) => [...prev, { ...f, id: `f${prev.length + 1}` }]);

  const toggleLiveMode = () => {
    setLiveMode((v) => {
      const next = !v;
      HardwareService.setTransport(next ? "rest" : "demo");
      return next;
    });
  };
  const emergencyStop = () => {
    setDevices((d) => ({ ...d, waterPump: false, nutrientPump: false, lighting: false, fans: false, autoMode: false }));
    HardwareService.emergencyStop();
    addAlert({ title: "Emergency Stop Engaged", description: "All actuators disabled by user.", action: "Re-enable manually or run diagnostics.", severity: "critical" });
  };

  const farmHealth = useMemo(() => computeHealth(sensors, devices), [sensors, devices]);

  const value: Ctx = {
    sensors, devices, alerts, farms, activeFarmId, history, scenario,
    liveMode, demoMode: !liveMode, farmHealth, lastUpdated, lastRecommendation,
    setDevice, runScenario, clearAlerts, markAllRead, addAlert,
    setActiveFarm, addFarm, toggleLiveMode, emergencyStop,
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmProvider");
  return ctx;
}
