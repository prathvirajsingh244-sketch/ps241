import { useState } from 'react';
import { Eye, CheckCircle2, ArrowRight, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

interface WorkspacePreview {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  video360Url: string;
  tool3dName: string;
  startingSalary: string;
  placementRate: string;
  nsqfLevel: string;
  description: string;
  hotspots: { title: string; desc: string; icon: string }[];
}

const WORKSPACES: WorkspacePreview[] = [
  {
    id: 'ev_lab',
    title: 'Electric Vehicle (EV) Diagnostic & Battery Lab',
    titleHi: 'इलेक्ट्रिक वाहन (EV) डायग्नोस्टिक एवं बैटरी वर्कशॉप',
    category: 'Automotive & Electrical',
    video360Url: 'https://www.youtube.com/embed/ScMzIvxBSi4', // Interactive 360 VR workshop sample
    tool3dName: 'High-Voltage Lithium Battery Management Unit (BMS)',
    startingSalary: '₹24,000–₹35,000 / month',
    placementRate: '92% Verified Placement',
    nsqfLevel: 'NSQF Level 4 & 5',
    description: 'Walk through a modern EV testing bay. Technicians calibrate high-voltage battery modules, diagnose CAN-bus sensor networks, and test electric motors using digital oscilloscopes.',
    hotspots: [
      { title: 'High Voltage Inverter', desc: 'Converts DC battery power to AC for motor drives. Critical safety protocol.', icon: '⚡' },
      { title: 'CAN-Bus Scanner', desc: 'Reads diagnostic error codes directly from the vehicle microcontroller.', icon: '💻' },
      { title: 'Regenerative Braking Unit', desc: 'Recovers kinetic energy during braking to recharge batteries.', icon: '⚙️' }
    ],
  },
  {
    id: 'drone_lab',
    title: 'Agricultural & Commercial Drone Avionics Lab',
    titleHi: 'कृषि एवं कमर्शियल ड्रोन एवियोनिक्स लैब',
    category: 'Aviation & Digital Electronics',
    video360Url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tool3dName: 'Hexacopter Carbon-Fiber Drone Frame & Autopilot Unit',
    startingSalary: '₹25,000–₹40,000 / month',
    placementRate: '89% Verified Placement',
    nsqfLevel: 'NSQF Level 4',
    description: 'Inspect drone maintenance workstations. Certified technicians solder brushless motor ESCs, calibrate GPS compass modules, and run pre-flight thrust bench simulations.',
    hotspots: [
      { title: 'Pixhawk Flight Controller', desc: 'The autonomous brain calculating 400 gyro stabilization adjustments per second.', icon: '🧠' },
      { title: 'Brushless DC Motors', desc: 'High-thrust motors with electronic speed controllers (ESC).', icon: '🚁' },
      { title: 'Multispectral Sensor', desc: 'Captures infrared agricultural soil & crop health scans.', icon: '📷' }
    ],
  },
  {
    id: 'solar_grid',
    title: 'Industrial Solar PV Rooftop Micro-Grid Plant',
    titleHi: 'औद्योगिक सोलर पीवी माइक्रोग्रिड प्लांट',
    category: 'Green Energy & Power',
    video360Url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    tool3dName: 'Grid-Tied Solar Inverter & Smart Bi-directional Meter',
    startingSalary: '₹22,000–₹32,000 / month',
    placementRate: '88% Verified Placement',
    nsqfLevel: 'NSQF Level 4 (Suryamitra)',
    description: 'Look across a utility-scale rooftop solar station. Installers assemble monocrystalline panels, wire string combiners, and connect high-capacity smart inverters to the main power grid.',
    hotspots: [
      { title: 'String Inverter', desc: 'Transforms raw DC sunlight power into synchronization-ready AC voltage.', icon: '☀️' },
      { title: 'MC4 Connectors & Fuse Box', desc: 'Weatherproof junction boxes with surge arrestors and lightning protection.', icon: '🔌' },
      { title: 'Solar Tracking Sensor', desc: 'Measures lux intensity to align panel tilt angles for max irradiance.', icon: '📐' }
    ],
  },
  {
    id: 'cnc_hub',
    title: 'Automated CNC Toolroom & Robotics Cell',
    titleHi: 'स्वचालित CNC टूलरूम एवं रोबोटिक्स सेल',
    category: 'Mechanical Engineering',
    video360Url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tool3dName: '5-Axis CNC Milling Spindle & Micro-Calipers',
    startingSalary: '₹20,000–₹34,000 / month',
    placementRate: '86% Verified Placement',
    nsqfLevel: 'NSQF Level 4/5',
    description: 'Step into an aerospace & automotive component plant. Operators write G-code programs, mount carbide tooling, and machine parts within 5-micron precision tolerances.',
    hotspots: [
      { title: 'G-Code Control Console', desc: 'Direct digital interface for programming rapid toolpaths and feeds.', icon: '🖥️' },
      { title: 'Tungsten Carbide Cutter', desc: 'Ultra-hard cutting head spinning at 15,000 RPM with liquid coolant spray.', icon: '⚙️' },
      { title: 'Digital Vernier Micrometer', desc: 'Verifies part dimensions to one-thousandth of a millimeter.', icon: '📏' }
    ],
  },
];

export default function CareerPreviews() {
  const navigate = useNavigate();
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspacePreview>(WORKSPACES[0]);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'360' | '3d'>('360');
  const [toolRotation, setToolRotation] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  const rotateTool = () => {
    setToolRotation(r => (r + 45) % 360);
  };

  const saveInterestAndExplore = () => {
    localStorage.setItem('mm_active_student_interest', activeWorkspace.id);
    navigate('/assessment');
  };

  return (
    <PageWrapper className="max-w-7xl">
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="card mb-6 border-slate-200 bg-white/95 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 text-white shadow-md">
              <Eye className="h-6 w-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-100 border border-rose-300 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-900">
                  AR / WebXR Feature
                </span>
                <span className="text-xs text-slate-500 font-semibold">Try Before You Train</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                360° कार्यक्षेत्र अनुभव (Virtual Workspace Preview)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('360')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                viewMode === '360'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🌐 360° Workspace View
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔍 3D Tool Inspection
            </button>
          </div>
        </div>
      </div>

      {/* ─── Workspace Switcher Carousel ──────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORKSPACES.map((w) => {
          const isSelected = activeWorkspace.id === w.id;
          return (
            <button
              key={w.id}
              onClick={() => {
                setActiveWorkspace(w);
                setActiveHotspot(0);
                setLiked(false);
              }}
              className={`rounded-2xl border-2 p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-rose-500 bg-rose-50 shadow-lg ring-2 ring-rose-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-[10px] font-black uppercase text-rose-700 tracking-wider">{w.category}</p>
              <p className="text-xs sm:text-sm font-black text-slate-950 mt-1 line-clamp-1">{w.title}</p>
              <p className="text-[11px] text-emerald-700 font-bold mt-1.5">{w.startingSalary}</p>
            </button>
          );
        })}
      </div>

      {/* ─── Main Preview Canvas ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Viewport */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border-2 border-slate-300 bg-slate-950 overflow-hidden shadow-2xl relative">
            {viewMode === '360' ? (
              <div className="relative aspect-video w-full flex items-center justify-center bg-slate-900">
                {/* 360 Video Embed */}
                <iframe
                  src={`${activeWorkspace.video360Url}?autoplay=0&controls=1&rel=0`}
                  title={activeWorkspace.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 border border-slate-700 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md pointer-events-none flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  360° Interactive Simulator: Drag video to inspect workshop
                </div>
              </div>
            ) : (
              /* 3D Component Inspection Workbench */
              <div className="aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center relative overflow-hidden">
                <div className="absolute top-3 left-3 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-amber-300">
                  🔍 3D Digital Twin Workbench
                </div>

                {/* 3D Model Proxy with interactive rotation */}
                <div
                  className="transition-transform duration-500 ease-out flex items-center justify-center my-6"
                  style={{ transform: `rotateY(${toolRotation}deg) rotateX(${toolRotation / 3}deg)` }}
                >
                  <div className="h-44 w-44 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-2xl flex flex-col items-center justify-center text-white p-4 border-4 border-white/20">
                    <span className="text-4xl mb-2">⚙️</span>
                    <span className="text-xs font-black uppercase tracking-wider text-center">
                      {activeWorkspace.tool3dName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={rotateTool}
                    className="btn-primary text-xs font-bold flex items-center gap-1.5 px-4 py-2"
                  >
                    <RotateCw className="h-3.5 w-3.5" /> 3D घुमाएं (Rotate 3D +45°)
                  </button>
                  <span className="text-xs text-slate-400">Angle: {toolRotation}°</span>
                </div>
              </div>
            )}

            {/* Bottom status bar */}
            <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {activeWorkspace.placementRate}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-bold text-amber-400">
                {activeWorkspace.nsqfLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Breakdown & Interactive Hotspots */}
        <div className="flex flex-col gap-4">
          <div className="card p-6 bg-white/95">
            <span className="rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-black uppercase tracking-wider">
              Workspace Breakdown
            </span>
            <h2 className="text-xl font-black text-slate-950 mt-2">{activeWorkspace.title}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeWorkspace.description}</p>

            <div className="my-4 border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">शुरुआती सैलरी (Verified):</span>
                <span className="font-black text-emerald-700">{activeWorkspace.startingSalary}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">ट्रेनिंग अवधि:</span>
                <span className="font-bold text-slate-800">3 से 12 महीने (ITI / PMKVY)</span>
              </div>
            </div>

            {/* Interactive Hotspots in Workspace */}
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              कार्यशाला के प्रमुख उपकरण (Key Tools & Equipment):
            </h4>
            <div className="space-y-2">
              {activeWorkspace.hotspots.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setActiveHotspot(i)}
                  className={`rounded-xl border p-2.5 cursor-pointer transition-all ${
                    activeHotspot === i
                      ? 'border-rose-400 bg-rose-50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{h.icon}</span>
                    <span className="text-xs font-black text-slate-900">{h.title}</span>
                  </div>
                  {activeHotspot === i && (
                    <p className="text-[11px] text-slate-600 mt-1 pl-6 leading-relaxed">{h.desc}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Action: Try Before You Train decision */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-900 mb-2">क्या आप इस कार्यशाला में काम करना पसंद करेंगे?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLiked(true)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all border ${
                    liked
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {liked ? '✓ रुचि सहेज ली गई!' : '👍 हाँ, मुझे यह पसंद है'}
                </button>
                <button
                  onClick={saveInterestAndExplore}
                  className="btn-primary flex-1 text-xs font-black py-2"
                >
                  असेसमेंट दें <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
