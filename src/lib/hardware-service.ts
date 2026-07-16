/**
 * HardwareService — abstraction layer between UI and hardware.
 * UI never talks to hardware directly. Swap the transport to go LIVE.
 *
 * Supported (future) connectors: ESP32 REST, MQTT, Firebase, WebSocket.
 * In DEMO mode we use an in-memory simulator.
 */

export type Transport = "demo" | "rest" | "mqtt" | "firebase" | "websocket";

export interface SensorReading {
  waterLevel: number;      // %
  ph: number;              // 0-14
  ec: number;              // mS/cm
  tds: number;             // ppm
  waterTemp: number;       // °C
  airTemp: number;         // °C
  humidity: number;        // %
  light: number;           // lux 0-100000
  nutrient: number;        // %
  flow: number;            // L/min
  pump: boolean;
}

export interface DeviceState {
  waterPump: boolean;
  nutrientPump: boolean;
  lighting: boolean;
  fans: boolean;
  drainValve: boolean;
  autoMode: boolean;
  solar: boolean;
  battery: number;       // %
  internet: boolean;
  energyKwh: number;
  waterLiters: number;
}

export type Listener = (data: { sensors: SensorReading; devices: DeviceState }) => void;

class HardwareServiceImpl {
  private transport: Transport = "demo";
  private listeners = new Set<Listener>();

  setTransport(t: Transport) {
    this.transport = t;
  }
  getTransport() {
    return this.transport;
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  emit(payload: { sensors: SensorReading; devices: DeviceState }) {
    this.listeners.forEach((l) => l(payload));
  }

  // Command surface — same signatures for demo and live.
  async setDevice(_key: keyof DeviceState, _value: boolean | number) {
    // In LIVE mode this dispatches to REST/MQTT/etc.
    return true;
  }
  async emergencyStop() {
    return true;
  }
}

export const HardwareService = new HardwareServiceImpl();
