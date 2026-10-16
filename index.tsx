import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Award, BookOpen, CheckCircle, HelpCircle, 
  RefreshCw, Play, ArrowRight, CornerDownLeft, Sparkles, 
  MapPin, Shield, Check, X, AlertCircle, Info, ChevronRight, Copy, Download, Trash2
} from 'lucide-react';

// Color Palette (Cheerful, bright school aesthetic)
const COLORS = {
  skyBlue: '#60C5FA',
  turquoise: '#40C9B5',
  sunshineYellow: '#FFD166',
  coral: '#FF8B7B',
  softLavender: '#B9A7F7',
  lightCream: '#FFF9ED',
  darkNavy: '#24324B',
  emerald: '#10B981',
  crimson: '#EF4444'
};

// Form 4 Standardized Database Dataset
const DATASET = {
  MURID: [
    { ID_Murid: 'M001', Nama_Murid: 'Amir', Tingkatan: '4 UTEM' },
    { ID_Murid: 'M002', Nama_Murid: 'Amir', Tingkatan: '4 SEROJA' },
    { ID_Murid: 'M003', Nama_Murid: 'Siti', Tingkatan: '4 UTEM' }
  ],
  KELAB: [
    { ID_Kelab: 'K01', Nama_Kelab: 'Robotik' },
    { ID_Kelab: 'K02', Nama_Kelab: 'Fotografi' }
  ],
  KEAHLIAN: [
    { ID_Keahlian: 'A001', ID_Murid: 'M001', ID_Kelab: 'K01' },
    { ID_Keahlian: 'A002', ID_Murid: 'M002', ID_Kelab: 'K01' },
    { ID_Keahlian: 'A003', ID_Murid: 'M003', ID_Kelab: 'K02' },
    { ID_Keahlian: 'A004', ID_Murid: 'M001', ID_Kelab: 'K02' }
  ]
};

// Mission 1 Questions (SP 2.2.1 - Primary and Foreign Keys)
const MISSION_1_QUESTIONS = [
  {
    id: 1,
    targetObj: 'cabinet1',
    title: 'Kabinet Rekod Murid',
    question: 'Mengapakah Nama_Murid tidak sesuai dijadikan kunci primer?',
    options: [
      { id: 'A', text: 'Nama terlalu panjang.' },
      { id: 'B', text: 'Nama boleh mempunyai nilai yang sama (duplikasi).' },
      { id: 'C', text: 'Nama tidak boleh disimpan dalam pangkalan data.' },
      { id: 'D', text: 'Nama hanya boleh mengandungi nombor sahaja.' }
    ],
    correct: 'B',
    explanation: 'Kunci primer perlu mempunyai nilai unik bagi mengenal pasti setiap rekod. Dalam jadual kita, terdapat dua murid bernama "Amir".'
  },
  {
    id: 2,
    targetObj: 'terminal1',
    title: 'Komputer Rekod Murid',
    question: 'Medan manakah paling sesuai dijadikan kunci primer bagi jadual MURID?',
    options: [
      { id: 'A', text: 'Nama_Murid' },
      { id: 'B', text: 'Tingkatan' },
      { id: 'C', text: 'ID_Murid' },
      { id: 'D', text: 'ID_Kelab' }
    ],
    correct: 'C',
    explanation: 'ID_Murid mengenal pasti setiap murid secara unik (contoh: M001, M002, M003).'
  },
  {
    id: 3,
    targetObj: 'folder1',
    title: 'Fail Kelab Sekolah',
    question: 'Apakah kunci primer paling sesuai bagi jadual KELAB?',
    options: [
      { id: 'A', text: 'ID_Murid' },
      { id: 'B', text: 'Nama_Kelab' },
      { id: 'C', text: 'ID_Kelab' },
      { id: 'D', text: 'ID_Keahlian' }
    ],
    correct: 'C',
    explanation: 'ID_Kelab merupakan pengecam unik bagi setiap rekod kelab (contoh: K01, K02).'
  },
  {
    id: 4,
    targetObj: 'terminal2',
    title: 'Terminal Keahlian',
    question: 'Apakah kunci primer yang sesuai bagi jadual KEAHLIAN?',
    options: [
      { id: 'A', text: 'ID_Keahlian' },
      { id: 'B', text: 'ID_Murid' },
      { id: 'C', text: 'ID_Kelab' },
      { id: 'D', text: 'Nama_Murid' }
    ],
    correct: 'A',
    explanation: 'ID_Keahlian mengenal pasti setiap rekod transaksi keahlian secara unik.'
  },
  {
    id: 5,
    targetObj: 'security1',
    title: 'Pengesan Kunci Asing',
    question: 'Medan manakah merupakan kunci asing dalam jadual KEAHLIAN?',
    options: [
      { id: 'A', text: 'ID_Keahlian sahaja.' },
      { id: 'B', text: 'ID_Murid dan ID_Kelab.' },
      { id: 'C', text: 'Nama_Murid dan Tingkatan.' },
      { id: 'D', text: 'ID_Kelab sahaja.' }
    ],
    correct: 'B',
    explanation: 'ID_Murid merujuk jadual MURID, manakala ID_Kelab merujuk jadual KELAB untuk menghubungkan kedua-dua jadual.'
  }
];

export default function App() {
  // Game Flow States: 'START', 'TUTORIAL', 'PLAYING', 'RESULTS'
  const [gameState, setGameState] = useState('START');
  
  // Current active room: 'BILIK_REKOD', 'MAKMAL_KOMPUTER', 'BILIK_PELAYAN'
  const [currentRoom, setCurrentRoom] = useState('BILIK_REKOD');

  // Educational Mission Tracking
  const [m1Completed, setM1Completed] = useState({}); // { 1: true, 2: true, ... }
  const [m1Score, setM1Score] = useState(0);
  const [m1Attempts, setM1Attempts] = useState({});

  const [m2Score, setM2Score] = useState(0);
  const [m2Completed, setM2Completed] = useState(false);

  const [m3Score, setM3Score] = useState(0);
  const [m3Completed, setM3Completed] = useState(false);

  // Clues Inventory
  const [clues, setClues] = useState([]);

  // Badges Earned
  const [badges, setBadges] = useState([]);

  // Interactive UI Modal Overlays
  const [activeModal, setActiveModal] = useState(null); // 'M1_PUZZLE', 'M2_ERD', 'M3_SCHEMA', 'NPC_DIALOGUE', 'HINT'
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState(null);

  // NPC Dialogue
  const [npcData, setNpcData] = useState(null);

  // Canvas Player position and engine ref
  const playerPosRef = useRef({ x: 220, y: 300 });
  const playerDirRef = useRef('down');
  const isMovingRef = useRef(false);
  const nearObjectRef = useRef(null);

  // Keyboard controls
  const keysPressed = useRef({});

  // Touch Controls Overlay Active
  const [touchControls, setTouchControls] = useState({
    up: false, down: false, left: false, right: false
  });

  const addClue = (clueText) => {
    setClues(prev => (prev.includes(clueText) ? prev : [...prev, clueText]));
  };

  const addBadge = (badgeName) => {
    setBadges(prev => (prev.includes(badgeName) ? prev : [...prev, badgeName]));
  };

  // Helper for total score calculation
  const getTotalScore = () => m1Score + m2Score + m3Score;

  const canvasRef = useRef(null);

  const getRoomObjects = (room, isM2Done, m1Count) => {
    if (room === 'BILIK_REKOD') {
      return [
        { id: 'cabinet1', name: 'Kabinet Rekod Murid', x: 80, y: 80, w: 90, h: 60, type: 'M1_ITEM', qIndex: 0 },
        { id: 'terminal1', name: 'Komputer Murid', x: 300, y: 80, w: 90, h: 60, type: 'M1_ITEM', qIndex: 1 },
        { id: 'folder1', name: 'Fail Kelab', x: 520, y: 80, w: 90, h: 60, type: 'M1_ITEM', qIndex: 2 },
        { id: 'terminal2', name: 'Terminal Keahlian', x: 120, y: 320, w: 90, h: 60, type: 'M1_ITEM', qIndex: 3 },
        { id: 'security1', name: 'Pengesan Kunci Asing', x: 500, y: 320, w: 90, h: 60, type: 'M1_ITEM', qIndex: 4 },
        { id: 'npc_guru', name: 'Cikgu Azman', x: 680, y: 220, w: 50, h: 50, type: 'NPC', dialogue: 'Selamat datang Detektif! Selesaikan 5 tugasan kunci di Bilik Rekod ini untuk membuka pintu Makmal Komputer!' },
        { id: 'door_lab', name: 'Pintu Makmal Komputer', x: 740, y: 220, w: 50, h: 80, type: 'DOOR', targetRoom: 'MAKMAL_KOMPUTER', reqM1: true }
      ];
    } else if (room === 'MAKMAL_KOMPUTER') {
      return [
        { id: 'station1', name: 'Stesen Kenal Pasti Entiti', x: 100, y: 90, w: 120, h: 70, type: 'INFO', text: 'Entiti ialah objek utama yang menyimpan data: MURID, KELAB, dan KEAHLIAN.' },
        { id: 'station2', name: 'Stesen Susun Atribut', x: 340, y: 90, w: 120, h: 70, type: 'INFO', text: 'Atribut menggambarkan sifat entiti. Contohnya: ID_Murid, Nama_Murid, Tingkatan.' },
        { id: 'station3', name: 'Stesen Tentukan Hubungan', x: 580, y: 90, w: 120, h: 70, type: 'INFO', text: 'Kardinaliti menunjukkan nisbah hubungan: Murid mempunyai Keahlian (1 ke Banyak).' },
        { id: 'erd_workstation', name: 'Meja Pemodelan ERD', x: 320, y: 280, w: 160, h: 90, type: 'M2_PUZZLE' },
        { id: 'npc_pembantu', name: 'Abang Syafiq (Juruteknik)', x: 150, y: 380, w: 50, h: 50, type: 'NPC', dialogue: 'Bina Gambar Rajah Perhubungan Entiti (ERD) di Meja Pemodelan pusat untuk membuka laluan ke Bilik Pelayan.' },
        { id: 'door_records', name: 'Pintu Bilik Rekod', x: 10, y: 220, w: 50, h: 80, type: 'DOOR', targetRoom: 'BILIK_REKOD' },
        { id: 'door_server', name: 'Pintu Bilik Pelayan', x: 740, y: 220, w: 50, h: 80, type: 'DOOR', targetRoom: 'BILIK_PELAYAN', reqM2: true }
      ];
    } else if (room === 'BILIK_PELAYAN') {
      return [
        { id: 'term_murid', name: 'Terminal Skema MURID', x: 120, y: 100, w: 120, h: 70, type: 'INFO', text: 'Gunakan Konsol Utama untuk membina skema lengkap jadual MURID, KELAB, dan KEAHLIAN!' },
        { id: 'term_kelab', name: 'Terminal Skema KELAB', x: 340, y: 100, w: 120, h: 70, type: 'INFO', text: 'Ingat! KELAB mengandungi ID_Kelab sebagai Kunci Primer (KP).' },
        { id: 'term_keahlian', name: 'Terminal Skema KEAHLIAN', x: 560, y: 100, w: 120, h: 70, type: 'INFO', text: 'Jadual KEAHLIAN mengandungi ID_Murid dan ID_Kelab sebagai Kunci Asing (KA).' },
        { id: 'console_restore', name: 'Konsol Pemulihan Utama', x: 320, y: 310, w: 160, h: 90, type: 'M3_PUZZLE' },
        { id: 'door_lab_back', name: 'Pintu Makmal Komputer', x: 10, y: 220, w: 50, h: 80, type: 'DOOR', targetRoom: 'MAKMAL_KOMPUTER' }
      ];
    }
    return [];
  };

  const triggerInteraction = () => {
    const near = nearObjectRef.current;
    if (!near) return;

    if (near.type === 'M1_ITEM') {
      setCurrentPuzzleIndex(near.qIndex);
      setSelectedAnswer(null);
      setPuzzleFeedback(null);
      setActiveModal('M1_PUZZLE');
    } else if (near.type === 'NPC') {
      setNpcData(near);
      setActiveModal('NPC_DIALOGUE');
    } else if (near.type === 'INFO') {
      setNpcData({ name: near.name, dialogue: near.text });
      setActiveModal('NPC_DIALOGUE');
    } else if (near.type === 'DOOR') {
      const completedCount = Object.keys(m1Completed).length;
      if (near.reqM1 && completedCount < 5) {
        setNpcData({ name: 'Pintu Terkunci', dialogue: `Selesaikan kesemua 5 petunjuk di Bilik Rekod terlebih dahulu! (${completedCount}/5 selesai)` });
        setActiveModal('NPC_DIALOGUE');
        return;
      }
      if (near.reqM2 && !m2Completed) {
        setNpcData({ name: 'Pintu Terkunci', dialogue: 'Selesaikan pembinaan ERD di Makmal Komputer dahulu untuk membuka pintu ini!' });
        setActiveModal('NPC_DIALOGUE');
        return;
      }
      // Change room and reposition player near destination door
      const destRoom = near.targetRoom;
      setCurrentRoom(destRoom);
      
      if (destRoom === 'BILIK_REKOD') {
        playerPosRef.current = { x: 670, y: 260 };
      } else if (destRoom === 'MAKMAL_KOMPUTER') {
        if (currentRoom === 'BILIK_REKOD') {
          playerPosRef.current = { x: 90, y: 260 };
        } else {
          playerPosRef.current = { x: 670, y: 260 };
        }
      } else if (destRoom === 'BILIK_PELAYAN') {
        playerPosRef.current = { x: 90, y: 260 };
      }
      nearObjectRef.current = null;
    } else if (near.type === 'M2_PUZZLE') {
      setActiveModal('M2_ERD');
    } else if (near.type === 'M3_PUZZLE') {
      setActiveModal('M3_SCHEMA');
    }
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const mapWidth = 800;
    const mapHeight = 500;

    // Keyboard Listeners
    const handleKeyDown = (e) => {
      if (activeModal) return;
      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
      }
      if (key === 'e') {
        triggerInteraction();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const speed = 3.8;

    const gameLoop = () => {
      if (activeModal === null) {
        let dx = 0;
        let dy = 0;

        // Check Input Controls
        if (keysPressed.current['w'] || keysPressed.current['arrowup'] || touchControls.up) { dy -= speed; playerDirRef.current = 'up'; }
        if (keysPressed.current['s'] || keysPressed.current['arrowdown'] || touchControls.down) { dy += speed; playerDirRef.current = 'down'; }
        if (keysPressed.current['a'] || keysPressed.current['arrowleft'] || touchControls.left) { dx -= speed; playerDirRef.current = 'left'; }
        if (keysPressed.current['d'] || keysPressed.current['arrowright'] || touchControls.right) { dx += speed; playerDirRef.current = 'right'; }

        isMovingRef.current = (dx !== 0 || dy !== 0);

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        let newX = playerPosRef.current.x + dx;
        let newY = playerPosRef.current.y + dy;

        // Map Boundaries
        const pSize = 18;
        newX = Math.max(35, Math.min(mapWidth - 35, newX));
        newY = Math.max(55, Math.min(mapHeight - 55, newY));

        // Collision & Proximity
        const roomObjects = getRoomObjects(currentRoom, m2Completed, Object.keys(m1Completed).length);
        let nearObj = null;

        for (let obj of roomObjects) {
          // Bounding box collision check
          if (
            newX + pSize > obj.x &&
            newX - pSize < obj.x + obj.w &&
            newY + pSize > obj.y &&
            newY - pSize < obj.y + obj.h
          ) {
            if (obj.type !== 'DOOR') {
              newX = playerPosRef.current.x;
              newY = playerPosRef.current.y;
            }
          }

          // Distance check for interaction
          const centerX = obj.x + obj.w / 2;
          const centerY = obj.y + obj.h / 2;
          const dist = Math.hypot(newX - centerX, newY - centerY);
          if (dist < 70) {
            nearObj = obj;
          }
        }

        playerPosRef.current = { x: newX, y: newY };
        nearObjectRef.current = nearObj;
      }

      // DRAWING SCENE
      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // Backgrounds & Floor Grids
      if (currentRoom === 'BILIK_REKOD') {
        ctx.fillStyle = '#FFF9ED';
        ctx.fillRect(0, 0, mapWidth, mapHeight);
        ctx.strokeStyle = '#F3E8D3';
        ctx.lineWidth = 1;
        for (let x = 0; x < mapWidth; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, mapHeight); ctx.stroke();
        }
        for (let y = 0; y < mapHeight; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(mapWidth, y); ctx.stroke();
        }
        ctx.fillStyle = '#E5D5B5';
        ctx.fillRect(0, 0, mapWidth, 40);
      } else if (currentRoom === 'MAKMAL_KOMPUTER') {
        ctx.fillStyle = '#F0F9FF';
        ctx.fillRect(0, 0, mapWidth, mapHeight);
        ctx.strokeStyle = '#E0F2FE';
        ctx.lineWidth = 1;
        for (let x = 0; x < mapWidth; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, mapHeight); ctx.stroke();
        }
        for (let y = 0; y < mapHeight; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(mapWidth, y); ctx.stroke();
        }
        ctx.fillStyle = '#BAE6FD';
        ctx.fillRect(0, 0, mapWidth, 40);
      } else if (currentRoom === 'BILIK_PELAYAN') {
        ctx.fillStyle = '#EEF2FF';
        ctx.fillRect(0, 0, mapWidth, mapHeight);
        ctx.strokeStyle = '#E0E7FF';
        ctx.lineWidth = 1;
        for (let x = 0; x < mapWidth; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, mapHeight); ctx.stroke();
        }
        for (let y = 0; y < mapHeight; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(mapWidth, y); ctx.stroke();
        }
        ctx.fillStyle = '#C7D2FE';
        ctx.fillRect(0, 0, mapWidth, 40);
      }

      // Draw Room Objects
      const currentObjects = getRoomObjects(currentRoom, m2Completed, Object.keys(m1Completed).length);
      const time = Date.now() * 0.005;

      currentObjects.forEach(obj => {
        if (obj.type === 'M1_ITEM') {
          const isDone = m1Completed[obj.qIndex + 1];
          ctx.fillStyle = isDone ? '#A7F3D0' : COLORS.coral;
          ctx.beginPath();
          ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 10);
          ctx.fill();
          ctx.strokeStyle = '#24324B';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#24324B';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.name, obj.x + obj.w / 2, obj.y + obj.h / 2 + 4);

          if (!isDone) {
            const sparkY = obj.y - 10 + Math.sin(time + obj.x) * 4;
            ctx.fillStyle = COLORS.sunshineYellow;
            ctx.beginPath();
            ctx.arc(obj.x + obj.w / 2, sparkY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (obj.type === 'NPC') {
          ctx.fillStyle = COLORS.softLavender;
          ctx.beginPath();
          ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#24324B';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#24324B';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('GURU', obj.x + obj.w / 2, obj.y + obj.h / 2 + 4);
        } else if (obj.type === 'DOOR') {
          const isDoorLocked = (obj.reqM1 && Object.keys(m1Completed).length < 5) || (obj.reqM2 && !m2Completed);
          ctx.fillStyle = isDoorLocked ? '#EF4444' : '#10B981';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeStyle = '#24324B';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(isDoorLocked ? 'LOCKED' : 'PINTU', obj.x + obj.w / 2, obj.y + obj.h / 2);
        } else if (obj.type === 'INFO') {
          ctx.fillStyle = COLORS.skyBlue;
          ctx.beginPath();
          ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 8);
          ctx.fill();
          ctx.strokeStyle = '#24324B';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#24324B';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.name, obj.x + obj.w / 2, obj.y + obj.h / 2 + 4);
        } else if (obj.type === 'M2_PUZZLE' || obj.type === 'M3_PUZZLE') {
          ctx.fillStyle = COLORS.sunshineYellow;
          ctx.beginPath();
          ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 12);
          ctx.fill();
          ctx.strokeStyle = '#24324B';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#24324B';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.name, obj.x + obj.w / 2, obj.y + obj.h / 2 + 4);

          const sparkY = obj.y - 12 + Math.sin(time) * 5;
          ctx.fillStyle = COLORS.coral;
          ctx.beginPath();
          ctx.arc(obj.x + obj.w / 2, sparkY, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Detective Character
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(px, py + 16, 15, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (Detective coat)
      ctx.fillStyle = COLORS.turquoise;
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#24324B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Detective Hat
      ctx.fillStyle = '#D97706';
      ctx.fillRect(px - 14, py - 18, 28, 6);
      ctx.fillRect(px - 10, py - 26, 20, 10);

      // Detective Badge
      ctx.fillStyle = COLORS.sunshineYellow;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      // Proximity Interactive Floating Tooltip
      if (nearObjectRef.current) {
        const nobj = nearObjectRef.current;
        ctx.fillStyle = COLORS.darkNavy;
        ctx.beginPath();
        ctx.roundRect(px - 70, py - 55, 140, 24, 6);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tekan E: ${nobj.name}`, px, py - 39);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, currentRoom, activeModal, m1Completed, m2Completed, touchControls]);

  const handleM1AnswerSubmit = (optionId) => {
    const q = MISSION_1_QUESTIONS[currentPuzzleIndex];
    const isCorrect = optionId === q.correct;

    setM1Attempts(prev => ({
      ...prev,
      [q.id]: (prev[q.id] || 0) + 1
    }));

    if (isCorrect) {
      const isFirstTry = !(m1Attempts[q.id] > 0);
      if (!m1Completed[q.id]) {
        if (isFirstTry) setM1Score(prev => prev + 1);
        else setM1Score(prev => prev + 0.5);
        
        setM1Completed(prev => {
          const updated = { ...prev, [q.id]: true };
          if (Object.keys(updated).length >= 5) {
            addBadge('Pakar Kekunci');
          }
          return updated;
        });
        addClue(`Petunjuk ${q.id}: ${q.explanation}`);
      }

      setPuzzleFeedback({
        type: 'SUCCESS',
        title: 'TAHNIAH! JAWAPAN TEPAT',
        msg: q.explanation
      });
    } else {
      setPuzzleFeedback({
        type: 'ERROR',
        title: 'CUBA LAGI, DETEKTIF!',
        msg: 'Jawapan kurang tepat. Baca soalan dan cuba semula.'
      });
    }
  };

  const [erdEntities, setErdEntities] = useState([]);
  const [erdAttributes, setErdAttributes] = useState([]);
  const [erdRelationships, setErdRelationships] = useState([]);

  const availableEntities = ['MURID', 'KELAB', 'KEAHLIAN'];
  const availableAttrs = [
    { name: 'ID_Murid', entity: 'MURID' },
    { name: 'Nama_Murid', entity: 'MURID' },
    { name: 'Tingkatan', entity: 'MURID' },
    { name: 'ID_Kelab', entity: 'KELAB' },
    { name: 'Nama_Kelab', entity: 'KELAB' },
    { name: 'ID_Keahlian', entity: 'KEAHLIAN' },
    { name: 'ID_Murid (KA)', entity: 'KEAHLIAN' },
    { name: 'ID_Kelab (KA)', entity: 'KEAHLIAN' }
  ];

  const handleAddErdEntity = (ent) => {
    if (!erdEntities.includes(ent)) {
      setErdEntities([...erdEntities, ent]);
    }
  };

  const handleAddErdAttr = (attr) => {
    if (!erdAttributes.some(a => a.name === attr.name)) {
      setErdAttributes([...erdAttributes, attr]);
    }
  };

  const handleAddErdRel = (rel) => {
    if (!erdRelationships.includes(rel)) {
      setErdRelationships([...erdRelationships, rel]);
    }
  };

  const handleClearErd = () => {
    setErdEntities([]);
    setErdAttributes([]);
    setErdRelationships([]);
  };

  const checkErdSubmission = () => {
    let score = 0;
    // Validate entities (2 pts)
    if (erdEntities.includes('MURID') && erdEntities.includes('KELAB') && erdEntities.includes('KEAHLIAN')) {
      score += 2;
    }
    // Validate attributes (2 pts)
    if (erdAttributes.length >= 6) score += 2;
    else if (erdAttributes.length >= 3) score += 1;

    // Validate foreign key attributes (2 pts)
    const hasKA = erdAttributes.some(a => a.name.includes('(KA)'));
    if (hasKA) score += 2;

    // Validate relationships (2 pts)
    if (erdRelationships.includes('MURID -> KEAHLIAN') && erdRelationships.includes('KELAB -> KEAHLIAN')) {
      score += 2;
    }

    // Validate Cardinality selection (2 pts)
    if (erdRelationships.length >= 2) score += 2;

    setM2Score(score);
    setM2Completed(true);
    addClue('Misi 2 Selesai: Gambar Rajah Perhubungan Entiti (ERD) Lengkap.');
    if (score >= 8) addBadge('Arkitek Hubungan');

    setActiveModal(null);
    setNpcData({
      name: 'Sistem Makmal',
      dialogue: `Bagus! Pembinaan ERD selesai dengan skor ${score}/10! Pintu ke Bilik Pelayan kini terbuka.`
    });
    setTimeout(() => setActiveModal('NPC_DIALOGUE'), 200);
  };

  const [schemaMurid, setSchemaMurid] = useState({ pk: '', attrs: [] });
  const [schemaKelab, setSchemaKelab] = useState({ pk: '', attrs: [] });
  const [schemaKeahlian, setSchemaKeahlian] = useState({ pk: '', fk1: '', fk2: '' });

  const checkSchemaSubmission = () => {
    let score = 0;
    // MURID table check
    if (schemaMurid.pk === 'ID_Murid') score += 2;
    if (schemaMurid.attrs.includes('Nama_Murid') && schemaMurid.attrs.includes('Tingkatan')) score += 1;

    // KELAB table check
    if (schemaKelab.pk === 'ID_Kelab') score += 2;
    if (schemaKelab.attrs.includes('Nama_Kelab')) score += 1;

    // KEAHLIAN table check
    if (schemaKeahlian.pk === 'ID_Keahlian') score += 2;
    if ((schemaKeahlian.fk1 === 'ID_Murid' && schemaKeahlian.fk2 === 'ID_Kelab') || 
        (schemaKeahlian.fk1 === 'ID_Kelab' && schemaKeahlian.fk2 === 'ID_Murid')) {
      score += 2;
    }

    setM3Score(score);
    setM3Completed(true);
    addClue('Misi 3 Selesai: Skema Hubungan Pangkalan Data berjaya dipulihkan!');
    if (score >= 8) addBadge('Penyelesai Skema');
    
    // Check master badge
    if (m1Score >= 4 && m2Score >= 8 && score >= 8) {
      addBadge('Detektif Data Cemerlang');
    }

    setActiveModal(null);
    setGameState('RESULTS');
  };

  if (gameState === 'START') {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-sky-300 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-200 rounded-full blur-xl opacity-70"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-200 rounded-full blur-xl opacity-70"></div>
          
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-2xl mb-4 text-sky-600">
            <Shield className="w-12 h-12" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            DETEKTIF PANGKALAN DATA
          </h1>
          <p className="text-lg font-semibold text-sky-600 mb-6">
            Misi Selamatkan Rekod Kelab Sekolah
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-left border border-amber-200">
            <h2 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" /> Sains Komputer Tingkatan 4
            </h2>
            <p className="text-sm text-slate-600">
              Topik 2.2 Reka Bentuk Pangkalan Data Hubungan (SP 2.2.1, 2.2.2, 2.2.3).
            </p>
          </div>

          <button
            onClick={() => setGameState('TUTORIAL')}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            MULA MISI DETEKTIF <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'TUTORIAL') {
    return (
      <div className="min-h-screen bg-slate-900/80 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800">Panduan Detektif Data</h2>
          </div>

          <div className="space-y-4 mb-6 text-slate-700">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 items-center">
              <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-white shrink-0">1</div>
              <p className="text-sm font-medium">Gunakan <strong>WASD / Anak Panah</strong> (atau D-Pad skrin) untuk bergerak.</p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex gap-3 items-center">
              <div className="w-10 h-10 bg-sky-400 rounded-lg flex items-center justify-center font-bold text-white shrink-0">2</div>
              <p className="text-sm font-medium">Dekati objek berkilau/pintu dan tekan butang <strong>INTERAKSI (E)</strong>.</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex gap-3 items-center">
              <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center font-bold text-white shrink-0">3</div>
              <p className="text-sm font-medium">Jawab soalan, bina ERD & pulihkan skema untuk membuka bilik baharu!</p>
            </div>
          </div>

          <button
            onClick={() => setGameState('PLAYING')}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow transition"
          >
            SAYA FAHAM, MULA SEKARANG!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'RESULTS') {
    const total = getTotalScore();
    const copyResults = () => {
      const summary = `KEPUTUSAN DETEKTIF PANGKALAN DATA\nJumlah Skor: ${total}/25\nMisi 1: ${m1Score}/5\nMisi 2: ${m2Score}/10\nMisi 3: ${m3Score}/10`;
      document.execCommand('copy');
      alert('Keputusan berjaya disalin ke papan keratan (clipboard)!');
    };

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-8 border-4 border-emerald-400 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-emerald-100 rounded-full text-emerald-600 mb-2">
              <Trophy className="w-12 h-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">KEPUTUSAN MISI DETEKTIF DATA</h1>
            <p className="text-slate-500 font-medium">Sekolah Inovasi - Sistem Pengurusan Kelab</p>
          </div>

          {/* Scores Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-center">
              <div className="text-xs font-bold text-sky-600 uppercase">Misi 1 (SP 2.2.1)</div>
              <div className="text-2xl font-black text-slate-800">{m1Score} / 5</div>
              <div className="text-xs text-slate-500 mt-1">{m1Score >= 4 ? 'Masteri Cemerlang' : 'Perlu Ulang Kajian'}</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <div className="text-xs font-bold text-amber-600 uppercase">Misi 2 (SP 2.2.2)</div>
              <div className="text-2xl font-black text-slate-800">{m2Score} / 10</div>
              <div className="text-xs text-slate-500 mt-1">{m2Score >= 8 ? 'Masteri Cemerlang' : 'Perlu Ulang Kajian'}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-center">
              <div className="text-xs font-bold text-indigo-600 uppercase">Misi 3 (SP 2.2.3)</div>
              <div className="text-2xl font-black text-slate-800">{m3Score} / 10</div>
              <div className="text-xs text-slate-500 mt-1">{m3Score >= 8 ? 'Masteri Cemerlang' : 'Perlu Ulang Kajian'}</div>
            </div>
          </div>

          {/* Total Overall */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6 text-center">
            <span className="text-sm font-bold text-emerald-700">JUMLAH SKOR KESELURUHAN: </span>
            <span className="text-2xl font-black text-emerald-800 ml-2">{total} / 25</span>
          </div>

          {/* Badges Earned */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Lencana Pencapaian
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.length > 0 ? (
                badges.map((b, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> {b}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Tiada lencana diperolehi.</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyResults}
              className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" /> SALIN KEPUTUSAN
            </button>
            <button
              onClick={() => {
                setM1Completed({});
                setM1Score(0);
                setM2Score(0);
                setM2Completed(false);
                setM3Score(0);
                setM3Completed(false);
                setClues([]);
                setBadges([]);
                setCurrentRoom('BILIK_REKOD');
                playerPosRef.current = { x: 220, y: 300 };
                setGameState('PLAYING');
              }}
              className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> MAIN SEMULA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* HUD Header Bar */}
      <header className="bg-slate-800/90 border-b border-slate-700 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 text-white p-2 rounded-xl font-bold text-xs flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {currentRoom.replace('_', ' ')}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">MISI SEMASA</div>
            <div className="text-sm font-bold text-amber-300">
              {currentRoom === 'BILIK_REKOD' && `Misi 1: Cari 5 Petunjuk Kunci (${Object.keys(m1Completed).length}/5)`}
              {currentRoom === 'MAKMAL_KOMPUTER' && (m2Completed ? 'Misi 2 Selesai! Bilik Pelayan Terbuka' : 'Misi 2: Bina ERD Sistem Kelab')}
              {currentRoom === 'BILIK_PELAYAN' && 'Misi 3: Pulihkan Skema Hubungan'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-600 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Skor:</span>
            <span className="text-sm font-extrabold text-white">{getTotalScore()}</span>
          </div>

          <button
            onClick={() => setActiveModal('HINT')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" /> PETUNJUK
          </button>
        </div>
      </header>

      {/* Canvas Game Area */}
      <main className="flex-1 relative flex items-center justify-center p-2 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="max-w-full max-h-[70vh] w-auto h-auto rounded-2xl shadow-2xl border-4 border-slate-800 bg-slate-900 object-contain"
        />

        {/* Mobile On-Screen Directional Pad */}
        <div className="absolute bottom-4 left-4 sm:hidden flex flex-col items-center gap-1 opacity-90 z-20">
          <button
            onTouchStart={() => setTouchControls(p => ({ ...p, up: true }))}
            onTouchEnd={() => setTouchControls(p => ({ ...p, up: false }))}
            onMouseDown={() => setTouchControls(p => ({ ...p, up: true }))}
            onMouseUp={() => setTouchControls(p => ({ ...p, up: false }))}
            className="w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded-xl font-bold text-white flex items-center justify-center active:bg-sky-600"
          >
            ▲
          </button>
          <div className="flex gap-1">
            <button
              onTouchStart={() => setTouchControls(p => ({ ...p, left: true }))}
              onTouchEnd={() => setTouchControls(p => ({ ...p, left: false }))}
              onMouseDown={() => setTouchControls(p => ({ ...p, left: true }))}
              onMouseUp={() => setTouchControls(p => ({ ...p, left: false }))}
              className="w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded-xl font-bold text-white flex items-center justify-center active:bg-sky-600"
            >
              ◄
            </button>
            <button
              onTouchStart={() => setTouchControls(p => ({ ...p, down: true }))}
              onTouchEnd={() => setTouchControls(p => ({ ...p, down: false }))}
              onMouseDown={() => setTouchControls(p => ({ ...p, down: true }))}
              onMouseUp={() => setTouchControls(p => ({ ...p, down: false }))}
              className="w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded-xl font-bold text-white flex items-center justify-center active:bg-sky-600"
            >
              ▼
            </button>
            <button
              onTouchStart={() => setTouchControls(p => ({ ...p, right: true }))}
              onTouchEnd={() => setTouchControls(p => ({ ...p, right: false }))}
              onMouseDown={() => setTouchControls(p => ({ ...p, right: true }))}
              onMouseUp={() => setTouchControls(p => ({ ...p, right: false }))}
              className="w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded-xl font-bold text-white flex items-center justify-center active:bg-sky-600"
            >
              ►
            </button>
          </div>
        </div>

        {/* Mobile Trigger Action Button */}
        <div className="absolute bottom-4 right-4 sm:hidden z-20">
          <button
            onClick={triggerInteraction}
            className="px-6 py-4 bg-emerald-500 active:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-xl border-2 border-emerald-300 text-base"
          >
            INTERAKSI (E)
          </button>
        </div>
      </main>

      {}

      {/* 1. MISSION 1 QUESTION MODAL */}
      {activeModal === 'M1_PUZZLE' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-xl w-full bg-white text-slate-800 rounded-3xl p-6 border-4 border-sky-400 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <span className="text-xs font-extrabold px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                SOALAN {currentPuzzleIndex + 1} / 5
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {MISSION_1_QUESTIONS[currentPuzzleIndex].title}
            </h3>
            <p className="text-slate-700 font-medium mb-6">
              {MISSION_1_QUESTIONS[currentPuzzleIndex].question}
            </p>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {MISSION_1_QUESTIONS[currentPuzzleIndex].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedAnswer(opt.id)}
                  className={`w-full p-4 rounded-2xl text-left font-semibold border-2 transition flex items-center justify-between ${
                    selectedAnswer === opt.id
                      ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{opt.id}. {opt.text}</span>
                  {selectedAnswer === opt.id && <CheckCircle className="w-5 h-5 text-sky-500" />}
                </button>
              ))}
            </div>

            {/* Answer Feedback Banner */}
            {puzzleFeedback && (
              <div className={`p-4 rounded-2xl mb-4 border ${
                puzzleFeedback.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="font-bold mb-1">{puzzleFeedback.title}</div>
                <div className="text-sm">{puzzleFeedback.msg}</div>
              </div>
            )}

            {/* Modal Controls */}
            {puzzleFeedback?.type === 'SUCCESS' ? (
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl shadow hover:bg-emerald-600 transition"
              >
                TERUSKAN MISI
              </button>
            ) : (
              <button
                disabled={!selectedAnswer}
                onClick={() => handleM1AnswerSubmit(selectedAnswer)}
                className="w-full py-3 bg-sky-500 disabled:opacity-50 text-white font-bold rounded-xl shadow hover:bg-sky-600 transition"
              >
                HANTAR JAWAPAN
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. MISSION 2 ERD BUILDER MODAL */}
      {activeModal === 'M2_ERD' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-3xl w-full bg-white text-slate-800 rounded-3xl p-6 border-4 border-amber-400 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Meja Pemodelan ERD (SP 2.2.2)
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Pilih dan susun komponen untuk membina Gambar Rajah Perhubungan Entiti (ERD) Sistem Kelab Sekolah.
            </p>

            {/* Entity Selector */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">1. Pilih Entiti (Petak):</span>
              <div className="flex flex-wrap gap-2">
                {availableEntities.map((ent) => (
                  <button
                    key={ent}
                    onClick={() => handleAddErdEntity(ent)}
                    className={`px-4 py-2 border-2 rounded-xl font-bold text-sm transition ${
                      erdEntities.includes(ent) ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + [{ent}]
                  </button>
                ))}
              </div>
            </div>

            {/* Attribute Selector */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">2. Pilih Atribut (Bujur):</span>
              <div className="flex flex-wrap gap-2">
                {availableAttrs.map((attr) => (
                  <button
                    key={attr.name}
                    onClick={() => handleAddErdAttr(attr)}
                    className={`px-3 py-1.5 border-2 rounded-full font-semibold text-xs transition ${
                      erdAttributes.some(a => a.name === attr.name) ? 'bg-sky-100 border-sky-400 text-sky-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + ({attr.name})
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Selector */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">3. Tentukan Hubungan & Kardinaliti (Rombo):</span>
              <div className="flex flex-wrap gap-2">
                {['MURID -> KEAHLIAN', 'KELAB -> KEAHLIAN'].map((rel) => (
                  <button
                    key={rel}
                    onClick={() => handleAddErdRel(rel)}
                    className={`px-4 py-2 border-2 rounded-xl font-bold text-xs transition ${
                      erdRelationships.includes(rel) ? 'bg-indigo-100 border-indigo-400 text-indigo-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + &lt;&gt; {rel} (1 : Banyak)
                  </button>
                ))}
              </div>
            </div>

            {/* Diagram Canvas Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 block">PRATONTON ERD DIBINA:</span>
                {(erdEntities.length > 0 || erdAttributes.length > 0 || erdRelationships.length > 0) && (
                  <button
                    onClick={handleClearErd}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Padam Semua
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-center min-h-[100px]">
                {erdEntities.map(e => (
                  <div key={e} className="px-4 py-2 bg-amber-200 text-amber-900 border-2 border-amber-400 font-extrabold text-xs rounded-lg shadow-sm">
                    {e}
                  </div>
                ))}
                {erdAttributes.map(a => (
                  <div key={a.name} className="px-3 py-1 bg-sky-100 text-sky-800 border border-sky-300 font-semibold text-xs rounded-full">
                    {a.name}
                  </div>
                ))}
                {erdRelationships.map(r => (
                  <div key={r} className="px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 font-semibold text-xs rounded-lg">
                    {r} (1:M)
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={checkErdSubmission}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition"
            >
              HANTAR DAN SEMAK ERD
            </button>
          </div>
        </div>
      )}

      {/* 3. MISSION 3 SCHEMA BUILDER MODAL */}
      {activeModal === 'M3_SCHEMA' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full bg-white text-slate-800 rounded-3xl p-6 border-4 border-indigo-400 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Konsol Pemulihan Skema Hubungan (SP 2.2.3)</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Pilih Kunci Primer (KP) dan Kunci Asing (KA) bagi setiap skema hubungan:
            </p>

            {/* MURID Table Schema */}
            <div className="p-4 bg-slate-50 rounded-2xl border mb-4 space-y-2">
              <span className="font-bold text-sm text-slate-800 block">Jadual 1: MURID</span>
              <div className="flex flex-wrap gap-2 text-xs items-center">
                <span className="font-semibold text-slate-600">Pilih KP:</span>
                {['ID_Murid', 'Nama_Murid', 'Tingkatan'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSchemaMurid(p => ({ ...p, pk: opt, attrs: ['Nama_Murid', 'Tingkatan'] }))}
                    className={`px-3 py-1 rounded-lg border font-bold ${
                      schemaMurid.pk === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* KELAB Table Schema */}
            <div className="p-4 bg-slate-50 rounded-2xl border mb-4 space-y-2">
              <span className="font-bold text-sm text-slate-800 block">Jadual 2: KELAB</span>
              <div className="flex flex-wrap gap-2 text-xs items-center">
                <span className="font-semibold text-slate-600">Pilih KP:</span>
                {['ID_Kelab', 'Nama_Kelab'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSchemaKelab(p => ({ ...p, pk: opt, attrs: ['Nama_Kelab'] }))}
                    className={`px-3 py-1 rounded-lg border font-bold ${
                      schemaKelab.pk === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* KEAHLIAN Table Schema */}
            <div className="p-4 bg-slate-50 rounded-2xl border mb-6 space-y-2">
              <span className="font-bold text-sm text-slate-800 block">Jadual 3: KEAHLIAN</span>
              <div className="flex flex-wrap gap-2 text-xs mb-2 items-center">
                <span className="font-semibold text-slate-600">Pilih KP:</span>
                {['ID_Keahlian', 'ID_Murid', 'ID_Kelab'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSchemaKeahlian(p => ({ ...p, pk: opt }))}
                    className={`px-3 py-1 rounded-lg border font-bold ${
                      schemaKeahlian.pk === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs items-center">
                <span className="font-semibold text-slate-600">Pilih KA (Kunci Asing):</span>
                {['ID_Murid', 'ID_Kelab'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (schemaKeahlian.fk1 === opt) {
                        setSchemaKeahlian(p => ({ ...p, fk1: '' }));
                      } else if (schemaKeahlian.fk2 === opt) {
                        setSchemaKeahlian(p => ({ ...p, fk2: '' }));
                      } else if (!schemaKeahlian.fk1) {
                        setSchemaKeahlian(p => ({ ...p, fk1: opt }));
                      } else {
                        setSchemaKeahlian(p => ({ ...p, fk2: opt }));
                      }
                    }}
                    className={`px-3 py-1 rounded-lg border font-bold ${
                      schemaKeahlian.fk1 === opt || schemaKeahlian.fk2 === opt ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={checkSchemaSubmission}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
            >
              PULIHKAN SKEMA PANGKALAN DATA
            </button>
          </div>
        </div>
      )}

      {/* 4. NPC DIALOGUE MODAL */}
      {activeModal === 'NPC_DIALOGUE' && npcData && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
          <div className="max-w-xl w-full bg-white text-slate-800 rounded-3xl p-6 border-4 border-sky-400 shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-3 border-b pb-2">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-600">
                🗣️
              </div>
              <h3 className="font-extrabold text-slate-800">{npcData.name}</h3>
            </div>
            <p className="text-slate-700 font-medium mb-6 leading-relaxed">
              "{npcData.dialogue}"
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl shadow hover:bg-sky-600 transition"
            >
              TERUSKAN
            </button>
          </div>
        </div>
      )}

      {/* 5. HINT MODAL */}
      {activeModal === 'HINT' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white text-slate-800 rounded-3xl p-6 border-4 border-amber-400 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-extrabold text-amber-600 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> Apa Perlu Buat?
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-3 mb-6">
              {currentRoom === 'BILIK_REKOD' && (
                <p>Dekati 5 objek berkilau (Kabinet, Komputer, Fail, Terminal) dan tekan <strong>E</strong> untuk menjawab soalan Kunci Primer dan Kunci Asing.</p>
              )}
              {currentRoom === 'MAKMAL_KOMPUTER' && (
                <p>Jelajah stesen maklumat kemudian dekati <strong>Meja Pemodelan ERD</strong> di tengah bilik untuk membina diagram ERD lengkap.</p>
              )}
              {currentRoom === 'BILIK_PELAYAN' && (
                <p>Gunakan <strong>Konsol Pemulihan Utama</strong> di tengah bilik untuk menentukan Kunci Primer (KP) dan Kunci Asing (KA) bagi ketiga-tiga jadual.</p>
              )}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 transition"
            >
              KEMBALI KE PERMAINAN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}