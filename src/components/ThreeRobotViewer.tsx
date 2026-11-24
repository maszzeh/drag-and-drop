'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RobotType } from '../types/robot';

interface ThreeRobotViewerProps {
  robotType: RobotType;
  isDancing?: boolean;
  actionTrigger?: string | null;
  className?: string;
  yOffset?: number;
}

export const ThreeRobotViewer: React.FC<ThreeRobotViewerProps> = ({
  robotType,
  isDancing = false,
  actionTrigger = null,
  className = '',
  yOffset = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const propellersRef = useRef<THREE.Object3D[]>([]);
  const tailRef = useRef<THREE.Group | null>(null);
  const armJ1Ref = useRef<THREE.Group | null>(null);
  const armJ2Ref = useRef<THREE.Group | null>(null);
  const armJ3Ref = useRef<THREE.Group | null>(null);
  const armWristRef = useRef<THREE.Group | null>(null);
  const armSphereRef = useRef<THREE.Mesh | null>(null);
  const droneGimbalRef = useRef<THREE.Group | null>(null);
  const droneLedsRef = useRef<THREE.Mesh[]>([]);
  const droneDownwashRef = useRef<THREE.Mesh[]>([]);
  const puppyLegsRef = useRef<{ hip: THREE.Group; knee: THREE.Group }[]>([]);
  const puppyEarsRef = useRef<{ earL: THREE.Group; earR: THREE.Group } | null>(null);
  const roverMastRef = useRef<THREE.Group | null>(null);
  const roverLaserRef = useRef<THREE.Mesh | null>(null);
  const roverLaserBeamRef = useRef<THREE.Mesh | null>(null);
  const roverSampleArmRef = useRef<THREE.Group | null>(null);
  const puppyHeartRef = useRef<THREE.Mesh | null>(null);
  const puppyEyesRef = useRef<THREE.Mesh[]>([]);
  const bobiLeftElbowRef = useRef<THREE.Group | null>(null);
  const bobiRightElbowRef = useRef<THREE.Group | null>(null);
  const bobiAntennaBulbsRef = useRef<THREE.Mesh[]>([]);
  const bobiChestCoreRef = useRef<THREE.Mesh | null>(null);
  const bobiMouthRef = useRef<THREE.Mesh | null>(null);
  const bobiEyesRef = useRef<THREE.Mesh[]>([]);
  const bobiMagnetGlowRef = useRef<THREE.Mesh | null>(null);

  // Educational 3D Visual Overlays (Radar, Brain Aura, Shield, Battery Sparks)
  const eduRadarRef = useRef<THREE.Mesh | null>(null);
  const eduBrainRingRef = useRef<THREE.Mesh | null>(null);
  const eduShieldRef = useRef<THREE.Mesh | null>(null);
  const eduBatterySparkRef = useRef<THREE.Mesh | null>(null);
  const bobiFieldGroupRef = useRef<THREE.Group | null>(null);
  const bobiWallGroupRef = useRef<THREE.Group | null>(null);
  const bobiWallBeaconRef = useRef<THREE.Mesh | null>(null);

  const [viewAngle, setViewAngle] = useState<'front' | 'top'>('front');
  const setTopViewRef = useRef<(() => void) | null>(null);
  const setFrontViewRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    if (robotType === 'arm') {
      camera.position.set(0, 1.4, 6.8);
      camera.lookAt(0, 0.55, 0);
    } else if (robotType === 'biped') {
      camera.position.set(2.4, 2.0, 7.0);
      camera.lookAt(0, 0.45, 0.6);
    } else {
      camera.position.set(0, 0.6, 5.8);
      camera.lookAt(0, 0.25, 0);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 1.5, 10);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // 3. Ground circular pedestal
    const platformGeo = new THREE.CylinderGeometry(2, 2.2, 0.25, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.15;
    platform.receiveShadow = true;

    const platformRingGeo = new THREE.RingGeometry(1.6, 1.85, 32);
    const platformRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const platformRing = new THREE.Mesh(platformRingGeo, platformRingMat);
    platformRing.rotation.x = -Math.PI / 2;
    platformRing.position.y = -1.02;

    if (robotType !== 'biped') {
      scene.add(platform);
      scene.add(platformRing);
    }

    // 4. Build 3D Robot Models
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    wheelsRef.current = [];
    propellersRef.current = [];
    droneLedsRef.current = [];
    droneDownwashRef.current = [];
    puppyLegsRef.current = [];
    puppyEyesRef.current = [];
    bobiAntennaBulbsRef.current = [];
    bobiEyesRef.current = [];

    // Color definitions
    const matBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.28, metalness: 0.25 });
    const matBobiWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.15 });
    const matBobiVisor = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.12, metalness: 0.88 });
    const matBobiCoreGlow = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.2 });
    const matBobiAntennaGlow = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1.2 });
    const matBobiRubberWheel = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.1 });
    const matMagnetRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.25, metalness: 0.35 });
    const matMagnetSpark = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1.5, roughness: 0.1 });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3, metalness: 0.2 });
    const matPurple = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, metalness: 0.2 });
    const matTeal = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.3, metalness: 0.2 });
    const matPink = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.3, metalness: 0.2 });
    const matYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.3 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 });
    const matGlowEye = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 });
    const matHeart = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.6 });

    // RoboWebGL Industrial Arm materials
    const matIndustrialYellow = new THREE.MeshStandardMaterial({ color: 0xdda032, roughness: 0.28, metalness: 0.25 });
    const matIndustrialSlate = new THREE.MeshStandardMaterial({ color: 0x3d4f61, roughness: 0.35, metalness: 0.4 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.85 });
    const matGlowingBall = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.75,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    // High-Tech Robo-Aero Drone materials
    const matDroneTeal = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.25, metalness: 0.35 });
    const matDroneDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
    const matDroneOrange = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.2 });
    const matPropBlur = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const matLedRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const matLedGreen = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const matLedWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    const matCameraLens = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });

    // Mars Rover Materials
    const matMarsGoldFoil = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.88,
    });
    const matMarsSolarGrid = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.18,
      metalness: 0.8,
    });
    const matRoverWheel = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.7,
    });
    const matRoverChassis = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.35,
      metalness: 0.25,
    });
    const matMarsLaser = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.5,
    });

    // Bionic Puppy Materials
    const matPuppyPink = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.22,
      metalness: 0.35,
    });
    const matPuppyEar = new THREE.MeshStandardMaterial({
      color: 0x9d174d,
      roughness: 0.35,
      metalness: 0.3,
    });
    const matPuppyEye = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.3,
      roughness: 0.1,
    });
    const matPuppyHeart = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 1.1,
      roughness: 0.1,
    });
    const matPuppyVisor = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.85,
    });

    if (robotType === 'rover') {
      // Martian red terrain ground
      const marsGroundGeo = new THREE.PlaneGeometry(12, 12);
      const marsGroundMat = new THREE.MeshStandardMaterial({
        color: 0x7c2d12,
        roughness: 0.9,
        metalness: 0.05,
      });
      const marsGround = new THREE.Mesh(marsGroundGeo, marsGroundMat);
      marsGround.rotation.x = -Math.PI / 2;
      marsGround.position.y = -1.14;
      marsGround.receiveShadow = true;
      scene.add(marsGround);

      const marsGridHelper = new THREE.GridHelper(10, 20, 0xd97706, 0x451a03);
      marsGridHelper.position.y = -1.138;
      scene.add(marsGridHelper);

      // Martian rock samples for spectrometer exploration
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412,
        roughness: 0.95,
        metalness: 0.1,
      });
      const rock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), rockMat);
      rock1.position.set(1.35, -1.02, 0.25);
      rock1.scale.set(1.2, 0.6, 0.85);
      rock1.castShadow = true;
      rock1.receiveShadow = true;
      scene.add(rock1);

      const rock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), rockMat);
      rock2.position.set(1.75, -1.07, -0.6);
      rock2.scale.set(0.9, 0.5, 0.7);
      rock2.castShadow = true;
      scene.add(rock2);
    }

    if (robotType === 'drone') {
      // Propeller downwash airflow rings on the ground platform
      for (let i = 0; i < 2; i++) {
        const ringGeo = new THREE.RingGeometry(0.5, 0.72, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const downwashRing = new THREE.Mesh(ringGeo, ringMat);
        downwashRing.rotation.x = -Math.PI / 2;
        downwashRing.position.y = -1.01;
        scene.add(downwashRing);
        droneDownwashRef.current.push(downwashRing);
      }
    }

    if (robotType === 'arm') {
      // Coordinate ground grid floor like RoboWebGL
      const groundGeo = new THREE.PlaneGeometry(12, 12);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x18202c,
        roughness: 0.85,
        metalness: 0.1,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.14;
      ground.receiveShadow = true;
      scene.add(ground);

      const gridHelper = new THREE.GridHelper(10, 20, 0x475569, 0x273549);
      gridHelper.position.y = -1.138;
      scene.add(gridHelper);
    }

    if (robotType === 'biped') {
      // --- ARENA LAPANGAN BERMAIN ROBOT (Testing Playground Field) ---
      const fieldGroup = new THREE.Group();
      scene.add(fieldGroup);
      bobiFieldGroupRef.current = fieldGroup;

      // Field Floor Mat (Turf Green / High-tech Arena Mat)
      const fieldFloorGeo = new THREE.PlaneGeometry(14, 18);
      const fieldFloorMat = new THREE.MeshStandardMaterial({
        color: 0x0f2e22, // Deep turf green / robot test mat
        roughness: 0.8,
        metalness: 0.1,
      });
      const fieldFloor = new THREE.Mesh(fieldFloorGeo, fieldFloorMat);
      fieldFloor.rotation.x = -Math.PI / 2;
      fieldFloor.position.y = -1.14;
      fieldFloor.receiveShadow = true;
      fieldGroup.add(fieldFloor);

      // Arena Grid Lines (Lighter Emerald Grid)
      const arenaGrid = new THREE.GridHelper(14, 14, 0x10b981, 0x064e3b);
      arenaGrid.position.y = -1.138;
      fieldGroup.add(arenaGrid);

      // Start Area Marking Box (Cyan outlined zone behind Bobi)
      const startBoxGeo = new THREE.RingGeometry(0.7, 0.85, 32);
      const startBoxMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
      });
      const startBox = new THREE.Mesh(startBoxGeo, startBoxMat);
      startBox.rotation.x = -Math.PI / 2;
      startBox.position.set(0, -1.135, -1.2);
      fieldGroup.add(startBox);

      // 4 Arena Corner Safety Pylons (Orange/White Traffic Pylons with glowing LED tips)
      const pylonPositions = [
        [-5.5, -6.5],
        [5.5, -6.5],
        [-5.5, 6.5],
        [5.5, 6.5],
      ];
      pylonPositions.forEach(([px, pz]) => {
        const pylonBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.32, 0.75, 16),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
        );
        pylonBase.position.set(px, -0.76, pz);
        fieldGroup.add(pylonBase);

        const pylonTip = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x22d3ee })
        );
        pylonTip.position.set(px, -0.32, pz);
        fieldGroup.add(pylonTip);
      });

      // --- RINTANGAN TEMBOK 3D (Wall Obstacle with Hazard Caution Stripes) ---
      const wallGroup = new THREE.Group();
      wallGroup.position.set(0, -1.14, 2.7); // Positioned ahead in front of Bobi
      scene.add(wallGroup);
      bobiWallGroupRef.current = wallGroup;

      // Base wall blocks (Sturdy brick / composite barrier wall)
      const wallGeo = new THREE.BoxGeometry(3.6, 1.4, 0.5);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x334155, // Slate barrier
        roughness: 0.6,
        metalness: 0.2,
      });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = 0.7;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      wallGroup.add(wallMesh);

      // Wall Hazard Caution Stripes (Yellow warning band)
      const stripeGeo = new THREE.BoxGeometry(3.4, 0.3, 0.52);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24, // Warning amber yellow
        roughness: 0.4,
      });
      const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
      stripeMesh.position.y = 0.7;
      wallGroup.add(stripeMesh);

      // Hazard Black Chevrons (Accent dark bands)
      [-1.0, -0.5, 0, 0.5, 1.0].forEach((cx) => {
        const chevron = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.32, 0.54),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
        );
        chevron.position.set(cx, 0.7, 0);
        wallGroup.add(chevron);
      });

      // Top Red Warning Flashing Beacon Light
      const beaconGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.22, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 1.5,
        roughness: 0.2,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(0, 1.52, 0);
      wallGroup.add(beaconMesh);
      bobiWallBeaconRef.current = beaconMesh;

      // Red Warning Plate: "AWAS TEMBOK"
      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.35, 0.56),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
      );
      signBoard.position.set(0, 1.15, 0);
      wallGroup.add(signBoard);

      // --- ROBO-BOBI (High-Fidelity Humanoid Companion Robot) ---
      const bobiGroup = new THREE.Group();
      bobiGroup.position.y = 0.20;
      robotGroup.add(bobiGroup);

      // 1. Torso: Multi-Layer Armored Chest & Power Core
      const chestGroup = new THREE.Group();
      chestGroup.position.set(0, 0.05, 0);
      bobiGroup.add(chestGroup);

      // Main Torso Armor Shell (Royal Blue)
      const torsoGeo = new THREE.BoxGeometry(1.35, 1.25, 0.95);
      const torso = new THREE.Mesh(torsoGeo, matBlue);
      torso.castShadow = true;
      chestGroup.add(torso);

      // Side Ergonomic Flank Panels (White composite)
      const flankGeo = new THREE.BoxGeometry(1.42, 1.05, 0.75);
      const flank = new THREE.Mesh(flankGeo, matBobiWhite);
      flank.position.set(0, 0, 0);
      flank.castShadow = true;
      chestGroup.add(flank);

      // Collar Ring / Neck Flange
      const neckFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.12, 24), matChrome);
      neckFlange.position.set(0, 0.65, 0);
      chestGroup.add(neckFlange);

      // Chest Recessed Screen Frame (Dark Acrylic)
      const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.12), matBobiVisor);
      screenFrame.position.set(0, 0.05, 0.46);
      chestGroup.add(screenFrame);

      // Bezel Chrome Trim
      const bezelTrim = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.68, 0.04), matChrome);
      bezelTrim.position.set(0, 0.05, 0.44);
      chestGroup.add(bezelTrim);

      // High-Tech Chest Battery Gauge (Segmented glowing LED bars)
      for (let i = 0; i < 4; i++) {
        const barGeo = new THREE.BoxGeometry(0.12, 0.26 + i * 0.05, 0.02);
        const bar = new THREE.Mesh(barGeo, matBobiCoreGlow);
        bar.position.set(-0.24 + i * 0.16, 0.02 + i * 0.025, 0.52);
        chestGroup.add(bar);
      }

      // Glowing Pulsing Center Energy Heart Icon
      const heartIcon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), matBobiCoreGlow);
      heartIcon.position.set(0, 0.18, 0.53);
      chestGroup.add(heartIcon);
      bobiChestCoreRef.current = heartIcon;

      // 2. Articulated Head & Expressive Facial Sensors
      const headPivot = new THREE.Group();
      headPivot.position.set(0, 0.88, 0);
      bobiGroup.add(headPivot);
      headRef.current = headPivot;

      // Chrome Neck Servo Cylinder
      const neckJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 20), matChrome);
      neckJoint.position.set(0, -0.11, 0);
      headPivot.add(neckJoint);

      // Main Head Helmet (Rounded friendly pearlescent blue dome)
      const headGeo = new THREE.BoxGeometry(1.22, 0.95, 0.98);
      const headMesh = new THREE.Mesh(headGeo, matBlue);
      headMesh.position.set(0, 0.36, 0);
      headMesh.castShadow = true;
      headPivot.add(headMesh);

      // White Ear Pods / Headset Sides
      const earPodL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 24), matBobiWhite);
      earPodL.rotateZ(Math.PI / 2);
      earPodL.position.set(-0.64, 0.36, 0);
      headPivot.add(earPodL);

      const earPodR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 24), matBobiWhite);
      earPodR.rotateZ(Math.PI / 2);
      earPodR.position.set(0.64, 0.36, 0);
      headPivot.add(earPodR);

      // Glossy Obsidian Faceplate Visor
      const faceVisorGeo = new THREE.BoxGeometry(0.98, 0.52, 0.12);
      const faceVisor = new THREE.Mesh(faceVisorGeo, matBobiVisor);
      faceVisor.position.set(0, 0.36, 0.48);
      headPivot.add(faceVisor);

      // Glowing Cyan Digital OLED Eyes (With pupil depth)
      const eyeL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 20), matGlowEye);
      eyeL.rotateX(Math.PI / 2);
      eyeL.position.set(-0.25, 0.4, 0.54);
      headPivot.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 20), matGlowEye);
      eyeR.rotateX(Math.PI / 2);
      eyeR.position.set(0.25, 0.4, 0.54);
      headPivot.add(eyeR);
      bobiEyesRef.current = [eyeL, eyeR];

      // Interactive Sound/Voice Speaker Mouth (Pulses when beeping)
      const mouthGeo = new THREE.BoxGeometry(0.36, 0.06, 0.03);
      const mouthMesh = new THREE.Mesh(mouthGeo, matGlowEye);
      mouthMesh.position.set(0, 0.2, 0.54);
      headPivot.add(mouthMesh);
      bobiMouthRef.current = mouthMesh;

      // Dual Springy Communication Antennas with Glowing Bulbs
      const antennaConfigs = [-0.38, 0.38];
      antennaConfigs.forEach(ax => {
        // Antenna Base Socket
        const antSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.1, 16), matChrome);
        antSocket.position.set(ax, 0.86, 0);
        headPivot.add(antSocket);

        // Flexible spring mast
        const antMast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.26, 12), matDark);
        antMast.position.set(ax, 1.00, 0);
        headPivot.add(antMast);

        // Top Status Light Bulb
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), matBobiAntennaGlow);
        bulb.position.set(ax, 1.18, 0);
        headPivot.add(bulb);
        bobiAntennaBulbsRef.current.push(bulb);
      });

      // 3. Articulated Dual-Segment Robotic Arms & End-Effectors
      // Left Arm: Friendly Waving Arm (Shoulder + Bicep + Elbow + Hand)
      const lShoulderGroup = new THREE.Group();
      lShoulderGroup.position.set(-0.86, 0.40, 0);
      bobiGroup.add(lShoulderGroup);
      leftArmRef.current = lShoulderGroup;

      const lShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matChrome);
      lShoulderGroup.add(lShoulderJoint);

      const lBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.45, 16), matBlue);
      lBicep.position.set(0, -0.22, 0);
      lBicep.castShadow = true;
      lShoulderGroup.add(lBicep);

      const lElbowGroup = new THREE.Group();
      lElbowGroup.position.set(0, -0.45, 0);
      lShoulderGroup.add(lElbowGroup);
      bobiLeftElbowRef.current = lElbowGroup;

      const lElbowJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 16), matChrome);
      lElbowJoint.rotateZ(Math.PI / 2);
      lElbowGroup.add(lElbowJoint);

      const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 16), matBobiWhite);
      lForearm.position.set(0, -0.21, 0);
      lForearm.castShadow = true;
      lElbowGroup.add(lForearm);

      // Welcoming Humanoid Hand (Palm + articulated fingers)
      const lPalm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.08), matYellow);
      lPalm.position.set(0, -0.46, 0);
      lElbowGroup.add(lPalm);

      for (let f = -1; f <= 1; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8), matYellow);
        finger.position.set(f * 0.06, -0.56, 0);
        lElbowGroup.add(finger);
      }

      // Right Arm: Industrial Magnetic Claw End-Effector
      const rShoulderGroup = new THREE.Group();
      rShoulderGroup.position.set(0.86, 0.40, 0);
      bobiGroup.add(rShoulderGroup);
      rightArmRef.current = rShoulderGroup;

      const rShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matChrome);
      rShoulderGroup.add(rShoulderJoint);

      const rBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.45, 16), matBlue);
      rBicep.position.set(0, -0.22, 0);
      rBicep.castShadow = true;
      rShoulderGroup.add(rBicep);

      const rElbowGroup = new THREE.Group();
      rElbowGroup.position.set(0, -0.45, 0);
      rShoulderGroup.add(rElbowGroup);
      bobiRightElbowRef.current = rElbowGroup;

      const rElbowJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 16), matChrome);
      rElbowJoint.rotateZ(Math.PI / 2);
      rElbowGroup.add(rElbowJoint);

      const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 16), matBobiWhite);
      rForearm.position.set(0, -0.21, 0);
      rForearm.castShadow = true;
      rElbowGroup.add(rForearm);

      // --- Real Horseshoe Magnetic Claw End-Effector (Tapal Kuda Merah & Kutub Perak) ---
      const magnetGroup = new THREE.Group();
      magnetGroup.position.set(0, -0.42, 0);
      rElbowGroup.add(magnetGroup);

      // Swivel Wrist Mount Collar
      const wristCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.08, 20), matDark);
      wristCollar.position.set(0, 0, 0);
      magnetGroup.add(wristCollar);

      const mountAdapter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.14), matChrome);
      mountAdapter.position.set(0, -0.06, 0);
      magnetGroup.add(mountAdapter);

      // Red Horseshoe Upper U-Curve Arch
      const archGeo = new THREE.TorusGeometry(0.16, 0.062, 16, 32, Math.PI);
      const arch = new THREE.Mesh(archGeo, matMagnetRed);
      arch.rotation.z = 0;
      arch.position.set(0, -0.10, 0);
      arch.castShadow = true;
      magnetGroup.add(arch);

      // Left & Right Red Magnet Prongs (Extending downwards from the arch)
      const prongGeo = new THREE.BoxGeometry(0.124, 0.22, 0.124);
      const prongL = new THREE.Mesh(prongGeo, matMagnetRed);
      prongL.position.set(-0.16, -0.21, 0);
      prongL.castShadow = true;
      magnetGroup.add(prongL);

      const prongR = new THREE.Mesh(prongGeo, matMagnetRed);
      prongR.position.set(0.16, -0.21, 0);
      prongR.castShadow = true;
      magnetGroup.add(prongR);

      // North & South Silver Chrome Magnetic Pole Caps
      const poleGeo = new THREE.BoxGeometry(0.136, 0.10, 0.136);
      const poleL = new THREE.Mesh(poleGeo, matChrome);
      poleL.position.set(-0.16, -0.34, 0);
      poleL.castShadow = true;
      magnetGroup.add(poleL);

      const poleR = new THREE.Mesh(poleGeo, matChrome);
      poleR.position.set(0.16, -0.34, 0);
      poleR.castShadow = true;
      magnetGroup.add(poleR);

      // Magnetic Force Field Spark Core (Pulsing between North and South poles)
      const sparkCore = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), matMagnetSpark);
      sparkCore.position.set(0, -0.34, 0);
      magnetGroup.add(sparkCore);
      bobiMagnetGlowRef.current = sparkCore;

      // Cyan Magnetic Flux Arc between poles
      const fluxArcGeo = new THREE.TorusGeometry(0.16, 0.018, 12, 24, Math.PI);
      const fluxArc = new THREE.Mesh(fluxArcGeo, matGlowEye);
      fluxArc.rotation.z = Math.PI;
      fluxArc.position.set(0, -0.34, 0);
      magnetGroup.add(fluxArc);

      // 4. Streamlined Mobility Drive Base & Roller Wheels
      const basePlatform = new THREE.Group();
      basePlatform.position.set(0, -0.72, 0);
      bobiGroup.add(basePlatform);

      // Streamlined Segway-style Scooter Deck
      const deckGeo = new THREE.BoxGeometry(1.65, 0.24, 0.88);
      const deck = new THREE.Mesh(deckGeo, matDark);
      deck.castShadow = true;
      basePlatform.add(deck);

      // Blue accent bumper trim with LED ground-glow
      const deckTrimGeo = new THREE.BoxGeometry(1.68, 0.06, 0.9);
      const deckTrim = new THREE.Mesh(deckTrimGeo, matGlowEye);
      deckTrim.position.set(0, -0.06, 0);
      basePlatform.add(deckTrim);

      // 2 High-Traction Roller Wheels with Multi-Spoke Rims
      const wheelTireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 28);
      wheelTireGeo.rotateZ(Math.PI / 2);

      const wheelRimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.29, 20);
      wheelRimGeo.rotateZ(Math.PI / 2);

      const wheelHubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
      wheelHubGeo.rotateZ(Math.PI / 2);

      const wheelPositions = [-0.68, 0.68];
      wheelPositions.forEach(wx => {
        const wGroup = new THREE.Group();
        wGroup.position.set(wx, -0.22, 0);

        // Matte rubber tire
        const tire = new THREE.Mesh(wheelTireGeo, matBobiRubberWheel);
        tire.castShadow = true;
        wGroup.add(tire);

        // Silver alloy rim
        const rim = new THREE.Mesh(wheelRimGeo, matChrome);
        wGroup.add(rim);

        // Center hub
        const hub = new THREE.Mesh(wheelHubGeo, matBlue);
        wGroup.add(hub);

        basePlatform.add(wGroup);
        wheelsRef.current.push(tire);
      });

      // Front & Rear Caster Balance Rollers
      const casterGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const casterF = new THREE.Mesh(casterGeo, matChrome);
      casterF.position.set(0, -0.22, 0.34);
      basePlatform.add(casterF);

      const casterB = new THREE.Mesh(casterGeo, matChrome);
      casterB.position.set(0, -0.22, -0.34);
      basePlatform.add(casterB);

    } else if (robotType === 'rover') {
      // --- ROBO-ROVER (High-Fidelity Mars Exploration Rover) ---
      const roverGroup = new THREE.Group();
      roverGroup.position.y = -0.1;
      robotGroup.add(roverGroup);

      // 1. Central Warm Electronics Box (WEB) Chassis
      const mainChassisGeo = new THREE.BoxGeometry(1.8, 0.65, 1.3);
      const chassis = new THREE.Mesh(mainChassisGeo, matRoverChassis);
      chassis.castShadow = true;
      roverGroup.add(chassis);

      // Angled Armor Deck Plates
      const topPlateGeo = new THREE.BoxGeometry(1.65, 0.08, 1.15);
      const topPlate = new THREE.Mesh(topPlateGeo, matDark);
      topPlate.position.y = 0.36;
      roverGroup.add(topPlate);

      // 2. Rear Science Deck with Gold Thermal Multi-Layer Insulation (MLI)
      const rtgCoverGeo = new THREE.BoxGeometry(0.7, 0.45, 0.85);
      const rtgCover = new THREE.Mesh(rtgCoverGeo, matMarsGoldFoil);
      rtgCover.position.set(-0.55, 0.45, 0);
      rtgCover.castShadow = true;
      roverGroup.add(rtgCover);

      // RTG Nuclear Power Unit (Cylinder with radiator cooling fins)
      const rtgCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16), matChrome);
      rtgCyl.rotateZ(Math.PI / 2);
      rtgCyl.position.set(-0.95, 0.38, 0);
      roverGroup.add(rtgCyl);

      // 3. High-Gain Parabolic Satellite Antenna Dish
      const dishGeo = new THREE.CylinderGeometry(0.32, 0.05, 0.12, 16);
      const dish = new THREE.Mesh(dishGeo, matMarsGoldFoil);
      dish.position.set(-0.25, 0.58, 0.35);
      dish.rotateZ(-Math.PI / 6);
      roverGroup.add(dish);

      const dishFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), matChrome);
      dishFeed.position.set(-0.25, 0.68, 0.35);
      roverGroup.add(dishFeed);

      // UHF Omnidirectional Radome Antenna (rear mast)
      const uhfMast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8), matChrome);
      uhfMast.position.set(-0.7, 0.65, -0.45);
      roverGroup.add(uhfMast);

      const uhfCone = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 8), matDark);
      uhfCone.position.set(-0.7, 0.95, -0.45);
      roverGroup.add(uhfCone);

      // 4. Photovoltaic Solar Array Wings (Left & Right)
      const wingFrameGeo = new THREE.BoxGeometry(1.15, 0.05, 0.85);
      const wingCellsGeo = new THREE.BoxGeometry(1.08, 0.02, 0.78);

      // Left Solar Wing
      const wingL = new THREE.Group();
      wingL.position.set(0, 0.36, -0.98);
      const frameL = new THREE.Mesh(wingFrameGeo, matDark);
      const cellsL = new THREE.Mesh(wingCellsGeo, matMarsSolarGrid);
      cellsL.position.y = 0.03;
      wingL.add(frameL);
      wingL.add(cellsL);
      roverGroup.add(wingL);

      // Right Solar Wing
      const wingR = new THREE.Group();
      wingR.position.set(0, 0.36, 0.98);
      const frameR = new THREE.Mesh(wingFrameGeo, matDark);
      const cellsR = new THREE.Mesh(wingCellsGeo, matMarsSolarGrid);
      cellsR.position.y = 0.03;
      wingR.add(frameR);
      wingR.add(cellsR);
      roverGroup.add(wingR);

      // 5. Front Robotic Sample Arm (Tuxedo Arm on front-left)
      const sampleArmGroup = new THREE.Group();
      sampleArmGroup.position.set(0.85, 0.05, 0.45);
      const armLink1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), matDark);
      armLink1.position.set(0.15, -0.15, 0);
      armLink1.rotateZ(-Math.PI / 4);
      sampleArmGroup.add(armLink1);

      const turretHead = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16), matChrome);
      turretHead.position.set(0.3, -0.3, 0);
      sampleArmGroup.add(turretHead);
      roverGroup.add(sampleArmGroup);
      roverSampleArmRef.current = sampleArmGroup;

      // 6. SuperCam / Mastcam Periscope Mast (Articulated with Stereo Vision & Laser)
      const mastGroup = new THREE.Group();
      mastGroup.position.set(0.48, 0.35, -0.32);
      headRef.current = mastGroup;
      roverMastRef.current = mastGroup;

      // Vertical carbon mast pole
      const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.95, 16), matDark);
      mastPole.position.y = 0.48;
      mastGroup.add(mastPole);

      // Pan-Tilt Camera Head housing
      const camHead = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.38), matRoverChassis);
      camHead.position.y = 1.02;
      camHead.castShadow = true;
      mastGroup.add(camHead);

      // Stereo Binocular Navigation Cameras (Left & Right Lenses)
      const camLensL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.15, 16), matCameraLens);
      camLensL.rotateX(Math.PI / 2);
      camLensL.position.set(-0.11, 1.02, 0.24);
      mastGroup.add(camLensL);

      const camLensR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.15, 16), matCameraLens);
      camLensR.rotateX(Math.PI / 2);
      camLensR.position.set(0.11, 1.02, 0.24);
      mastGroup.add(camLensR);

      // Center High-Energy Laser Spectrometer Emitter
      const laserEmitter = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), matMarsLaser);
      laserEmitter.position.set(0, 1.08, 0.22);
      mastGroup.add(laserEmitter);
      roverLaserRef.current = laserEmitter;

      // Targeting Spectrometer Laser Beam (Red translucent beam projecting down towards the rock)
      const laserBeamGeo = new THREE.CylinderGeometry(0.012, 0.035, 2.0, 12);
      laserBeamGeo.rotateZ(Math.PI / 4.4);
      const laserBeamMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
      laserBeam.position.set(0.72, 0.35, 0.22);
      mastGroup.add(laserBeam);
      roverLaserBeamRef.current = laserBeam;

      roverGroup.add(mastGroup);

      // 7. Rocker-Bogie Suspension Linkages (Left & Right)
      const bogiePositions = [-0.78, 0.78];
      bogiePositions.forEach(bz => {
        // Main Rocker Bar
        const rockerGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.45, 12);
        const rocker = new THREE.Mesh(rockerGeo, matDark);
        rocker.rotateZ(Math.PI / 2);
        rocker.position.set(0, -0.32, bz);
        roverGroup.add(rocker);

        // Bogie Pivot joint
        const bogieJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16), matChrome);
        bogieJoint.position.set(0.25, -0.32, bz);
        bogieJoint.rotateX(Math.PI / 2);
        roverGroup.add(bogieJoint);
      });

      // 8. 6 Cleated Aluminum Drum Wheels with Spokes & Drive Hubs
      const rWheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 24);
      rWheelGeo.rotateZ(Math.PI / 2);

      const wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.29, 16);
      wheelRimGeo.rotateZ(Math.PI / 2);

      const xPositions = [-0.92, 0.0, 0.92];
      const zPositions = [-0.86, 0.86];

      xPositions.forEach(x => {
        zPositions.forEach(z => {
          const wGroup = new THREE.Group();
          wGroup.position.set(x, -0.82, z);

          // Deep-tread drum
          const w = new THREE.Mesh(rWheelGeo, matRoverWheel);
          w.castShadow = true;
          wGroup.add(w);

          // Silver spoke hub
          const rim = new THREE.Mesh(wheelRimGeo, matChrome);
          wGroup.add(rim);

          roverGroup.add(wGroup);
          wheelsRef.current.push(w);
        });
      });

    } else if (robotType === 'arm') {
      // --- ROBOWEBGL 6-DOF INDUSTRIAL ROBOTIC ARM ---
      // 1. Bolted Circular Base Flange (Flens Dudukan Dasar)
      const baseFlangeGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.16, 32);
      const baseFlange = new THREE.Mesh(baseFlangeGeo, matIndustrialSlate);
      baseFlange.position.y = -1.05;
      baseFlange.castShadow = true;
      baseFlange.receiveShadow = true;
      robotGroup.add(baseFlange);

      // Mounting bolts around the flange perimeter rim
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), matChrome);
        bolt.position.set(Math.cos(angle) * 0.78, -0.96, Math.sin(angle) * 0.78);
        bolt.castShadow = true;
        robotGroup.add(bolt);
      }

      // 2. Joint 1 (Waist Turret / Swivel Column - Rotates on Y-axis)
      const j1Group = new THREE.Group();
      j1Group.position.y = -0.96;
      robotGroup.add(j1Group);
      armJ1Ref.current = j1Group;

      const waistTurretGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.44, 32);
      const waistTurret = new THREE.Mesh(waistTurretGeo, matIndustrialSlate);
      waistTurret.position.y = 0.22;
      waistTurret.castShadow = true;
      waistTurret.receiveShadow = true;
      j1Group.add(waistTurret);

      // 3. Joint 2 (Shoulder Barrel - Horizontal Joint Cylinder)
      const shoulderBarrelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.75, 32);
      shoulderBarrelGeo.rotateX(Math.PI / 2);
      const shoulderBarrel = new THREE.Mesh(shoulderBarrelGeo, matIndustrialSlate);
      shoulderBarrel.position.set(0, 0.48, 0);
      shoulderBarrel.castShadow = true;
      j1Group.add(shoulderBarrel);

      const shoulderCapGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.78, 32);
      shoulderCapGeo.rotateX(Math.PI / 2);
      const shoulderCap = new THREE.Mesh(shoulderCapGeo, matChrome);
      shoulderCap.position.set(0, 0.48, 0);
      j1Group.add(shoulderCap);

      // Pivot Group for Joint 2 (Shoulder rotation)
      const j2Group = new THREE.Group();
      j2Group.position.set(0, 0.48, 0);
      j1Group.add(j2Group);
      armJ2Ref.current = j2Group;

      // 4. Link 1 (Lower Boom Arm - Industrial Golden Yellow Cylinder)
      const link1Length = 1.35;
      const link1Geo = new THREE.CylinderGeometry(0.22, 0.25, link1Length, 32);
      const link1 = new THREE.Mesh(link1Geo, matIndustrialYellow);
      link1.position.set(0, link1Length / 2, 0);
      link1.castShadow = true;
      j2Group.add(link1);

      // 5. Joint 3 (Elbow Barrel - Horizontal Joint Cylinder)
      const elbowBarrelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.68, 32);
      elbowBarrelGeo.rotateX(Math.PI / 2);
      const elbowBarrel = new THREE.Mesh(elbowBarrelGeo, matIndustrialSlate);
      elbowBarrel.position.set(0, link1Length, 0);
      elbowBarrel.castShadow = true;
      j2Group.add(elbowBarrel);

      const elbowCapGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.72, 32);
      elbowCapGeo.rotateX(Math.PI / 2);
      const elbowCap = new THREE.Mesh(elbowCapGeo, matChrome);
      elbowCap.position.set(0, link1Length, 0);
      j2Group.add(elbowCap);

      // Pivot Group for Joint 3 (Elbow rotation)
      const j3Group = new THREE.Group();
      j3Group.position.set(0, link1Length, 0);
      j2Group.add(j3Group);
      armJ3Ref.current = j3Group;

      // 6. Link 2 (Forearm - Industrial Golden Yellow Cylinder)
      const link2Length = 1.15;
      const link2Geo = new THREE.CylinderGeometry(0.18, 0.2, link2Length, 32);
      const link2 = new THREE.Mesh(link2Geo, matIndustrialYellow);
      link2.position.set(0, link2Length / 2, 0);
      link2.castShadow = true;
      j3Group.add(link2);

      // 7. Joint 4 / Joint 5 (Wrist Assembly & Tool Flange)
      const wristGroup = new THREE.Group();
      wristGroup.position.set(0, link2Length, 0);
      j3Group.add(wristGroup);
      armWristRef.current = wristGroup;

      const wristBarrelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.32, 32);
      const wristBarrel = new THREE.Mesh(wristBarrelGeo, matIndustrialSlate);
      wristBarrel.position.y = 0.16;
      wristBarrel.castShadow = true;
      wristGroup.add(wristBarrel);

      const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32);
      const collar = new THREE.Mesh(collarGeo, matChrome);
      collar.position.y = 0.32;
      wristGroup.add(collar);

      // Tool Flange (Golden + Slate Cone)
      const toolFlangeGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.26, 32);
      const toolFlange = new THREE.Mesh(toolFlangeGeo, matIndustrialYellow);
      toolFlange.position.y = 0.48;
      toolFlange.castShadow = true;
      wristGroup.add(toolFlange);

      // End-Effector Prongs
      const prongGeo = new THREE.BoxGeometry(0.06, 0.22, 0.08);
      const prongL = new THREE.Mesh(prongGeo, matIndustrialSlate);
      prongL.position.set(-0.11, 0.68, 0);
      prongL.castShadow = true;
      wristGroup.add(prongL);

      const prongR = new THREE.Mesh(prongGeo, matIndustrialSlate);
      prongR.position.set(0.11, 0.68, 0);
      prongR.castShadow = true;
      wristGroup.add(prongR);

      // 8. The Glowing Translucent Target Sphere (RoboWebGL End-Effector Ball)
      const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
      const targetSphere = new THREE.Mesh(sphereGeo, matGlowingBall);
      targetSphere.position.set(0, 0.8, 0);
      targetSphere.castShadow = true;
      wristGroup.add(targetSphere);
      armSphereRef.current = targetSphere;

      // 9. Interactive Transform Gizmo (RGB Coordinate Arrows like RoboWebGL)
      const gizmoGroup = new THREE.Group();
      gizmoGroup.position.set(0, 0.8, 0);
      wristGroup.add(gizmoGroup);

      // X Axis (Red)
      const arrowX = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      arrowX.rotateZ(Math.PI / 2);
      arrowX.position.x = 0.18;
      gizmoGroup.add(arrowX);

      // Y Axis (Green)
      const arrowY = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      arrowY.position.y = 0.18;
      gizmoGroup.add(arrowY);

      // Z Axis (Blue)
      const arrowZ = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      arrowZ.rotateX(Math.PI / 2);
      arrowZ.position.z = 0.18;
      gizmoGroup.add(arrowZ);

      // Transform Ring Gizmo
      const ringGeo = new THREE.TorusGeometry(0.26, 0.015, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const targetRing = new THREE.Mesh(ringGeo, ringMat);
      targetRing.rotateX(Math.PI / 2);
      gizmoGroup.add(targetRing);

    } else if (robotType === 'drone') {
      // --- ROBO-AERO (High-Tech Aerodynamic Quadcopter Drone) ---
      // 1. Aerodynamic Central Fuselage
      const fuselageGroup = new THREE.Group();
      fuselageGroup.position.y = 0.2;
      robotGroup.add(fuselageGroup);

      // Upper aerodynamic canopy (teal streamlined dome)
      const canopyGeo = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
      const canopy = new THREE.Mesh(canopyGeo, matDroneTeal);
      canopy.scale.set(1.1, 0.5, 1.25);
      canopy.position.y = 0.05;
      canopy.castShadow = true;
      fuselageGroup.add(canopy);

      // Lower chassis & avionics bay (dark graphite)
      const lowerChassisGeo = new THREE.CylinderGeometry(0.62, 0.48, 0.24, 32);
      const lowerChassis = new THREE.Mesh(lowerChassisGeo, matDroneDark);
      lowerChassis.scale.set(1.05, 1.0, 1.2);
      lowerChassis.position.y = -0.06;
      lowerChassis.castShadow = true;
      fuselageGroup.add(lowerChassis);

      // Neon Status LED perimeter ring
      const ringGeo = new THREE.TorusGeometry(0.56, 0.025, 16, 32);
      const ring = new THREE.Mesh(ringGeo, matGlowEye);
      ring.rotateX(Math.PI / 2);
      ring.scale.set(1.05, 1.2, 1.0);
      ring.position.y = 0.05;
      fuselageGroup.add(ring);

      // Top GPS & Compass Puck
      const gpsPuckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.08, 24);
      const gpsPuck = new THREE.Mesh(gpsPuckGeo, matDroneDark);
      gpsPuck.position.y = 0.32;
      fuselageGroup.add(gpsPuck);

      const gpsDome = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matGlowEye);
      gpsDome.position.y = 0.36;
      fuselageGroup.add(gpsDome);

      // Forward Flight Nose Sensor Pod & Dual Lenses
      const nosePod = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.18), matDroneDark);
      nosePod.position.set(0, 0.02, 0.65);
      fuselageGroup.add(nosePod);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), matCameraLens);
      eyeL.position.set(-0.09, 0.02, 0.74);
      fuselageGroup.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), matCameraLens);
      eyeR.position.set(0.09, 0.02, 0.74);
      fuselageGroup.add(eyeR);

      // 2. Gyro-Stabilized 3-Axis Camera Gimbal (under nose)
      const gimbalGroup = new THREE.Group();
      gimbalGroup.position.set(0, -0.18, 0.35);
      fuselageGroup.add(gimbalGroup);
      droneGimbalRef.current = gimbalGroup;

      const gimbalYaw = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16), matDroneDark);
      gimbalGroup.add(gimbalYaw);

      const cameraSphere = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), matDroneDark);
      cameraSphere.position.y = -0.12;
      gimbalGroup.add(cameraSphere);

      const cameraLens = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 24), matCameraLens);
      cameraLens.rotateX(Math.PI / 2);
      cameraLens.position.set(0, -0.12, 0.12);
      gimbalGroup.add(cameraLens);

      // 3. Mini Delivery Cargo Payload Box (between skids)
      const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.42), matDroneOrange);
      cargoBox.position.set(0, -0.22, -0.05);
      cargoBox.castShadow = true;
      fuselageGroup.add(cargoBox);

      // Cargo latch stripe
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.44), matChrome);
      latch.position.set(0, -0.22, -0.05);
      fuselageGroup.add(latch);

      // 4. 4 High-Strength Carbon Fiber Motor Booms & Rotors
      // Front-Right (FR), Rear-Right (RR), Rear-Left (RL), Front-Left (FL)
      const rotorConfigs = [
        { angle: Math.PI / 4, ledMat: matLedGreen, isStrobe: false },
        { angle: (3 * Math.PI) / 4, ledMat: matLedGreen, isStrobe: false },
        { angle: (5 * Math.PI) / 4, ledMat: matLedWhite, isStrobe: true },
        { angle: (7 * Math.PI) / 4, ledMat: matLedRed, isStrobe: false },
      ];

      rotorConfigs.forEach((cfg) => {
        const rad = 1.15;
        const rx = Math.cos(cfg.angle) * rad;
        const rz = Math.sin(cfg.angle) * rad;

        // Tubular carbon boom arm
        const armLength = 1.1;
        const armGeo = new THREE.CylinderGeometry(0.045, 0.045, armLength, 16);
        const armMesh = new THREE.Mesh(armGeo, matDroneDark);
        armMesh.rotateZ(Math.PI / 2);
        armMesh.rotateY(cfg.angle);
        armMesh.position.set(rx * 0.48, 0.02, rz * 0.48);
        armMesh.castShadow = true;
        fuselageGroup.add(armMesh);

        // Motor Nacelle stator
        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.16, 24), matDroneDark);
        nacelle.position.set(rx, 0.08, rz);
        nacelle.castShadow = true;
        fuselageGroup.add(nacelle);

        // Brushless Motor Bell (titanium)
        const motorBell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 24), matChrome);
        motorBell.position.set(rx, 0.18, rz);
        fuselageGroup.add(motorBell);

        // Navigation / Strobe LED under motor
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), cfg.ledMat);
        led.position.set(rx, -0.01, rz);
        led.userData = { isStrobe: cfg.isStrobe };
        fuselageGroup.add(led);
        droneLedsRef.current.push(led);

        // Propeller Group (Rotates in animation loop)
        const propGroup = new THREE.Group();
        propGroup.position.set(rx, 0.26, rz);
        fuselageGroup.add(propGroup);
        propellersRef.current.push(propGroup);

        // Twin aerodynamic curved blades
        const bladeGeo = new THREE.BoxGeometry(0.95, 0.018, 0.09);
        const blades = new THREE.Mesh(bladeGeo, matDroneTeal);
        blades.castShadow = true;
        propGroup.add(blades);

        // Bullet center spinner nut
        const spinnerNut = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 16), matChrome);
        spinnerNut.position.y = 0.04;
        propGroup.add(spinnerNut);

        // Translucent high-RPM motion blur disk
        const blurGeo = new THREE.CircleGeometry(0.5, 32);
        blurGeo.rotateX(-Math.PI / 2);
        const blurDisk = new THREE.Mesh(blurGeo, matPropBlur);
        blurDisk.position.y = 0.01;
        propGroup.add(blurDisk);
      });

      // 5. High-Tech Arched Landing Skids
      const skidGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 16);
      skidGeo.rotateZ(Math.PI / 2);

      const skidL = new THREE.Mesh(skidGeo, matDroneDark);
      skidL.position.set(0, -0.42, -0.52);
      skidL.castShadow = true;
      fuselageGroup.add(skidL);

      const skidR = new THREE.Mesh(skidGeo, matDroneDark);
      skidR.position.set(0, -0.42, 0.52);
      skidR.castShadow = true;
      fuselageGroup.add(skidR);

      // Angled skid shock-absorber struts
      const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12);
      const strutPositions: [number, number, number, number][] = [
        [-0.35, -0.22, -0.48, Math.PI / 7],
        [0.35, -0.22, -0.48, Math.PI / 7],
        [-0.35, -0.22, 0.48, -Math.PI / 7],
        [0.35, -0.22, 0.48, -Math.PI / 7],
      ];
      strutPositions.forEach(([sx, sy, sz, rotX]) => {
        const strut = new THREE.Mesh(strutGeo, matChrome);
        strut.position.set(sx, sy, sz);
        strut.rotation.x = rotX;
        fuselageGroup.add(strut);
      });

    } else {
      // --- ROBO-PUPPY (High-Fidelity Biomimetic Quadruped Pet) ---
      const puppyGroup = new THREE.Group();
      puppyGroup.position.set(0, 0.05, 0);
      robotGroup.add(puppyGroup);

      // 1. Aerodynamic Contoured Bionic Torso
      const torsoGeo = new THREE.BoxGeometry(1.4, 0.65, 0.82);
      const torso = new THREE.Mesh(torsoGeo, matPuppyPink);
      torso.position.set(-0.15, 0.05, 0);
      torso.castShadow = true;
      puppyGroup.add(torso);

      // Carbon-fiber side accent panels
      const sidePanelGeo = new THREE.BoxGeometry(0.9, 0.42, 0.86);
      const sidePanels = new THREE.Mesh(sidePanelGeo, matDark);
      sidePanels.position.set(-0.15, 0.05, 0);
      puppyGroup.add(sidePanels);

      // Spine Vertebrae detailing
      const spineGeo = new THREE.BoxGeometry(0.95, 0.06, 0.16);
      const spine = new THREE.Mesh(spineGeo, matChrome);
      spine.position.set(-0.15, 0.4, 0);
      puppyGroup.add(spine);

      // Collar with Glowing Heart Battery
      const collarGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.12, 24);
      collarGeo.rotateZ(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, matDark);
      collar.position.set(0.52, 0.15, 0);
      puppyGroup.add(collar);

      const heartMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matPuppyHeart);
      heartMesh.position.set(0.58, 0.08, 0);
      puppyGroup.add(heartMesh);
      puppyHeartRef.current = heartMesh;

      // 2. Articulated Expressive Cyber Head & Neck
      const neckPivot = new THREE.Group();
      neckPivot.position.set(0.55, 0.22, 0);
      puppyGroup.add(neckPivot);
      headRef.current = neckPivot;

      // Neck actuator
      const neckJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16), matChrome);
      neckJoint.position.set(0.1, 0.1, 0);
      neckJoint.rotateZ(-Math.PI / 4);
      neckPivot.add(neckJoint);

      // Head main pod
      const pHeadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.58, 0.65), matPuppyPink);
      pHeadMesh.position.set(0.28, 0.26, 0);
      pHeadMesh.castShadow = true;
      neckPivot.add(pHeadMesh);

      // Cyber Visor with OLED Eyes
      const visorGeo = new THREE.BoxGeometry(0.24, 0.32, 0.56);
      const visor = new THREE.Mesh(visorGeo, matPuppyVisor);
      visor.position.set(0.52, 0.3, 0);
      neckPivot.add(visor);

      // Glowing OLED Eyes (Cyan digital display)
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), matPuppyEye);
      eyeL.position.set(0.62, 0.32, 0.16);
      neckPivot.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), matPuppyEye);
      eyeR.position.set(0.62, 0.32, -0.16);
      neckPivot.add(eyeR);
      puppyEyesRef.current = [eyeL, eyeR];

      // Cute bionic snout & nose sensor
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.34), matDark);
      snout.position.set(0.65, 0.16, 0);
      neckPivot.add(snout);

      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), matChrome);
      nose.position.set(0.77, 0.18, 0);
      neckPivot.add(nose);

      // Expressive Motorized Bionic Ears
      const earGroupL = new THREE.Group();
      earGroupL.position.set(0.22, 0.54, 0.35);
      const earMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.22), matPuppyEar);
      earMeshL.position.set(0, -0.15, 0.05);
      earMeshL.rotation.x = Math.PI / 8;
      earGroupL.add(earMeshL);
      neckPivot.add(earGroupL);

      const earGroupR = new THREE.Group();
      earGroupR.position.set(0.22, 0.54, -0.35);
      const earMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.22), matPuppyEar);
      earMeshR.position.set(0, -0.15, -0.05);
      earMeshR.rotation.x = -Math.PI / 8;
      earGroupR.add(earMeshR);
      neckPivot.add(earGroupR);

      puppyEarsRef.current = { earL: earGroupL, earR: earGroupR };

      // 3. Multi-Segment Articulated Bionic Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.85, 0.25, 0);
      puppyGroup.add(tailGroup);
      tailRef.current = tailGroup;

      const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.35, 12), matDark);
      tailBase.position.set(-0.15, 0.12, 0);
      tailBase.rotation.z = Math.PI / 3;
      tailGroup.add(tailBase);

      const tailMid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 12), matYellow);
      tailMid.position.set(-0.35, 0.3, 0);
      tailMid.rotation.z = Math.PI / 4;
      tailGroup.add(tailMid);

      const tailTipSphere = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), matGlowEye);
      tailTipSphere.position.set(-0.5, 0.44, 0);
      tailGroup.add(tailTipSphere);

      // 4. 4 Articulated 2-Segment Bionic Quadruped Legs (FL, FR, RL, RR)
      const legPositions = [
        { x: 0.42, y: -0.08, z: 0.44 },
        { x: 0.42, y: -0.08, z: -0.44 },
        { x: -0.65, y: -0.08, z: 0.44 },
        { x: -0.65, y: -0.08, z: -0.44 },
      ];

      legPositions.forEach((pos) => {
        // Hip / Shoulder Pivot Group
        const hipGroup = new THREE.Group();
        hipGroup.position.set(pos.x, pos.y, pos.z);
        puppyGroup.add(hipGroup);

        // Shoulder Motor Barrel
        const shoulderMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.16, 20), matChrome);
        shoulderMotor.rotateX(Math.PI / 2);
        hipGroup.add(shoulderMotor);

        // Upper Thigh Link
        const thighGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.52, 16);
        const thigh = new THREE.Mesh(thighGeo, matPuppyPink);
        thigh.position.set(0, -0.26, 0);
        thigh.castShadow = true;
        hipGroup.add(thigh);

        // Knee Joint Hinge
        const kneeGroup = new THREE.Group();
        kneeGroup.position.set(0, -0.5, 0);
        hipGroup.add(kneeGroup);

        const kneeBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16), matChrome);
        kneeBarrel.rotateX(Math.PI / 2);
        kneeGroup.add(kneeBarrel);

        // Lower Shank Link
        const shankGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.52, 16);
        const shank = new THREE.Mesh(shankGeo, matDark);
        shank.position.set(0, -0.26, 0);
        shank.castShadow = true;
        kneeGroup.add(shank);

        // Soft Rubber Damper Paw
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), matDark);
        paw.position.set(0, -0.54, 0);
        kneeGroup.add(paw);

        puppyLegsRef.current.push({ hip: hipGroup, knee: kneeGroup });
      });
    }

    // --- 3D EDUCATIONAL VISUAL OVERLAYS (Sensor Radar, Brain Aura, Shield, Battery Sparks) ---
    // 1. Sensor Radar Scanning Cone (Cyan Wireframe / Translucent cone pointing forward)
    const radarGeo = new THREE.ConeGeometry(0.85, 2.6, 24, 1, true);
    radarGeo.rotateX(Math.PI / 2);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.set(0, robotType === 'biped' ? 1.25 : 0.8, 1.8);
    radarMesh.visible = false;
    scene.add(radarMesh);
    eduRadarRef.current = radarMesh;

    // 2. Brain Thinking Halo Ring (Pulsing Purple Digital Aura over head)
    const brainRingGeo = new THREE.TorusGeometry(0.65, 0.045, 16, 48);
    brainRingGeo.rotateX(Math.PI / 2);
    const brainRingMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.85,
    });
    const brainRingMesh = new THREE.Mesh(brainRingGeo, brainRingMat);
    brainRingMesh.position.set(0, robotType === 'biped' ? 2.25 : 1.7, 0);
    brainRingMesh.visible = false;
    scene.add(brainRingMesh);
    eduBrainRingRef.current = brainRingMesh;

    // 3. Protective Casing Hologram Shield (Iridescent Cyan Dome)
    const shieldGeo = new THREE.SphereGeometry(1.65, 24, 18);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      metalness: 0.1,
      wireframe: true,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(0, 0.65, 0);
    shieldMesh.visible = false;
    scene.add(shieldMesh);
    eduShieldRef.current = shieldMesh;

    // 4. Battery Electric Flow Sparks Ring
    const sparkGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
    });
    const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
    sparkMesh.position.set(0, 0.55, 0.6);
    sparkMesh.visible = false;
    scene.add(sparkMesh);
    eduBatterySparkRef.current = sparkMesh;

    // 5. User Interaction: 3D Spherical Orbit Drag (Look from above, front, or rotate 360°)
    const orbitRadius = robotType === 'arm' ? 6.8 : robotType === 'biped' ? 6.4 : 5.8;
    const targetCenterY = robotType === 'arm' ? 0.55 : robotType === 'biped' ? 0.45 : 0.25;
    const defaultPhi = robotType === 'arm' ? 0.25 : robotType === 'biped' ? 0.18 : 0.22;

    let targetTheta = 0;
    let targetPhi = defaultPhi;
    let currentTheta = 0;
    let currentPhi = defaultPhi;

    setTopViewRef.current = () => {
      targetPhi = 1.42;
      setViewAngle('top');
    };

    setFrontViewRef.current = () => {
      targetPhi = defaultPhi;
      targetTheta = 0;
      setViewAngle('front');
    };

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      targetTheta += deltaX * 0.012;
      // Dragging down tilts camera UP to bird's eye / top view, dragging up tilts back
      targetPhi = Math.max(0.06, Math.min(1.48, targetPhi + deltaY * 0.009));

      if (targetPhi > 0.9) {
        setViewAngle('top');
      } else if (targetPhi < 0.6) {
        setViewAngle('front');
      }

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 6. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera orbit around center
      currentTheta += (targetTheta - currentTheta) * 0.1;
      currentPhi += (targetPhi - currentPhi) * 0.1;

      const horizDist = orbitRadius * Math.cos(currentPhi);
      camera.position.x = horizDist * Math.sin(currentTheta);
      camera.position.y = targetCenterY + orbitRadius * Math.sin(currentPhi);
      camera.position.z = horizDist * Math.cos(currentTheta);
      camera.lookAt(0, targetCenterY, 0);

      if (robotGroup) {
        // Idle floating / bobbing & grounded positioning
        if (robotType === 'arm') {
          // Base flange rests firmly on the coordinate grid floor (-1.14) without floating or cutting off
          robotGroup.position.y = -0.01 + yOffset;
          robotGroup.rotation.z = 0;
        } else if (robotType === 'drone') {
          // Realistic Quadcopter Aerodynamic Flight Physics
          const baseY = 0.35 + yOffset;
          const hoverY = baseY + Math.sin(time * 2.8) * 0.12 + Math.sin(time * 5.6) * 0.025;
          const hoverPitch = Math.sin(time * 2.0) * 0.04;
          const hoverRoll = Math.cos(time * 2.4) * 0.05;

          if (actionTrigger === 'move_forward') {
            // Forward flight: climbs higher, banks and pitches forward dynamically
            robotGroup.position.y = hoverY + 0.35;
            robotGroup.position.z = Math.sin(time * 3) * 0.35;
            robotGroup.rotation.x = -0.22 + Math.sin(time * 4) * 0.03;
            robotGroup.rotation.z = Math.sin(time * 3) * 0.12;
          } else if (actionTrigger === 'spin_propeller') {
            // High-power throttle spool-up: rapid energetic micro-vibrations & hover lift
            robotGroup.position.y = hoverY + 0.15 + Math.sin(time * 18) * 0.015;
            robotGroup.rotation.x = hoverPitch * 1.5;
            robotGroup.rotation.z = hoverRoll * 1.5;
          } else if (isDancing) {
            // Aerial victory celebration: soaring banking barrel rolls & altitude swings
            robotGroup.position.y = hoverY + Math.sin(time * 4) * 0.32;
            robotGroup.rotation.x = Math.sin(time * 3) * 0.22;
            robotGroup.rotation.z = Math.cos(time * 3.5) * 0.25;
          } else {
            // Smooth realistic organic hover
            robotGroup.position.y = hoverY;
            robotGroup.rotation.x = hoverPitch;
            robotGroup.rotation.z = hoverRoll;
          }
        } else if (robotType === 'rover') {
          // Realistic Mars Surface Grounding & Rocker-Bogie Suspension Terrain Response
          const isDriving = actionTrigger === 'move_forward';
          const isScanning = actionTrigger === 'beep_sound';

          const roverBaseY = 0.10 + yOffset;
          if (isDriving) {
            // Crawling over uneven Martian terrain: suspension pitch & roll undulations
            robotGroup.position.y = roverBaseY + Math.sin(time * 8) * 0.015;
            robotGroup.rotation.x = Math.sin(time * 6) * 0.025;
            robotGroup.rotation.z = Math.cos(time * 5) * 0.018;
          } else if (isDancing) {
            // Rover celebration: suspension dance & roll
            robotGroup.position.y = roverBaseY + Math.sin(time * 6) * 0.08;
            robotGroup.rotation.x = Math.sin(time * 4) * 0.05;
            robotGroup.rotation.z = Math.cos(time * 5) * 0.06;
          } else {
            // Firmly grounded on the Martian surface with subtle engine idle vibration
            robotGroup.position.y = roverBaseY + Math.sin(time * 3) * 0.003;
            robotGroup.rotation.x = 0;
            robotGroup.rotation.z = 0;
          }

          // Mastcam Panoramic Scanning & Spectrometer Aiming
          if (roverMastRef.current) {
            if (isScanning) {
              // Lock onto target rock in front with high-precision scan
              roverMastRef.current.rotation.y = 0.28 + Math.sin(time * 8) * 0.08;
              roverMastRef.current.rotation.x = 0.18 + Math.sin(time * 12) * 0.04;
            } else if (isDriving) {
              // Look straight ahead with subtle vibration
              roverMastRef.current.rotation.y = Math.sin(time * 2) * 0.08;
              roverMastRef.current.rotation.x = 0.05;
            } else {
              // Smooth autonomous panoramic survey of Jezero crater
              roverMastRef.current.rotation.y = Math.sin(time * 0.9) * 0.42 + Math.sin(time * 1.8) * 0.12;
              roverMastRef.current.rotation.x = Math.sin(time * 1.4) * 0.08;
            }
          }

          // High-Energy Rock Spectrometer Laser Flash
          if (roverLaserRef.current) {
            if (isScanning) {
              const pulse = Math.sin(time * 24) > 0;
              (roverLaserRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse ? 4.0 : 0.8;
              roverLaserRef.current.scale.set(1.6, 1.6, 1.6);
            } else {
              (roverLaserRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
              roverLaserRef.current.scale.set(1, 1, 1);
            }
          }

          // Targeting Spectrometer Laser Beam hitting the Martian rock
          if (roverLaserBeamRef.current) {
            if (isScanning) {
              const beamFlicker = 0.7 + Math.sin(time * 30) * 0.25;
              (roverLaserBeamRef.current.material as THREE.MeshBasicMaterial).opacity = beamFlicker;
            } else {
              (roverLaserBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
            }
          }

          // Robotic Sample Tuxedo Arm motion
          if (roverSampleArmRef.current) {
            if (isScanning) {
              roverSampleArmRef.current.rotation.z = -0.32 + Math.sin(time * 10) * 0.08;
            } else {
              roverSampleArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
            }
          }

          // 6 Wheels rotation when driving
          if (isDriving) {
            wheelsRef.current.forEach(w => {
              w.rotation.x += 0.18;
            });
          }

        } else if (robotType === 'pet') {
          // --- ROBO-PUPPY (Biomimetic Quadruped Locomotion & Expressive AI) ---
          const isWalking = actionTrigger === 'move_forward' || isDancing;
          const isBarking = actionTrigger === 'beep_sound';
          const isWagging = actionTrigger === 'wag_tail';

          const puppyBaseY = 0.16 + yOffset;
          const walkFreq = isDancing ? 12 : 8.5;
          const trotAmp = isDancing ? 0.44 : 0.36;
          const kneeFlexAmp = isDancing ? 0.75 : 0.58;

          if (isWalking) {
            // Realistic dynamic trot bounce & natural body sway
            robotGroup.position.y = puppyBaseY + Math.abs(Math.sin(time * walkFreq)) * 0.05;
            robotGroup.rotation.z = Math.sin(time * walkFreq * 0.5) * 0.04;
            robotGroup.rotation.x = Math.cos(time * walkFreq) * 0.02;
          } else if (isBarking) {
            // Energetic bark bounce
            robotGroup.position.y = puppyBaseY + Math.sin(time * 18) * 0.04;
            robotGroup.rotation.x = -0.06 + Math.sin(time * 18) * 0.04;
            robotGroup.rotation.z = 0;
          } else {
            // Calm breathing stance firmly grounded on platform
            robotGroup.position.y = puppyBaseY + Math.sin(time * 2.5) * 0.01;
            robotGroup.rotation.x = 0;
            robotGroup.rotation.z = 0;
          }

          // Quadruped Diagonal Trot Kinematics:
          // Leg 0 (FL) & Leg 3 (RR) swing together (phase 0)
          // Leg 1 (FR) & Leg 2 (RL) swing together (phase PI)
          puppyLegsRef.current.forEach((leg, idx) => {
            if (isWalking) {
              const phase = (idx === 0 || idx === 3) ? 0 : Math.PI;
              const swing = Math.sin(time * walkFreq + phase);
              leg.hip.rotation.z = swing * trotAmp;
              // Knee flexes upward during backward swing, straightens in stance phase
              leg.knee.rotation.z = Math.max(0, -swing) * kneeFlexAmp;
            } else {
              // Idle slight knee spring tension
              leg.hip.rotation.z = 0;
              leg.knee.rotation.z = 0.08 + Math.sin(time * 2.5) * 0.02;
            }
          });

          // Articulated Head & Cyber Visor Gaze
          if (headRef.current) {
            if (isBarking) {
              // Head tilts back and nods rapidly while barking
              headRef.current.rotation.x = -0.25 + Math.sin(time * 20) * 0.15;
              headRef.current.rotation.y = 0;
              headRef.current.rotation.z = Math.sin(time * 16) * 0.08;
            } else if (isWalking) {
              // Forward attentive trot gaze
              headRef.current.rotation.x = 0.08 + Math.sin(time * walkFreq) * 0.06;
              headRef.current.rotation.y = Math.sin(time * walkFreq * 0.5) * 0.08;
              headRef.current.rotation.z = 0;
            } else {
              // Curious lifelike puppy head tilt & attentive gaze
              headRef.current.rotation.y = Math.sin(time * 1.5) * 0.22;
              headRef.current.rotation.z = Math.sin(time * 1.1) * 0.16; // curious head cock
              headRef.current.rotation.x = Math.sin(time * 2.2) * 0.08; // gentle sniffing nod
            }
          }

          // Motorized Bionic Ears Twitch & Perk
          if (puppyEarsRef.current) {
            if (isBarking || actionTrigger === 'start') {
              // Perked upright alert ears
              puppyEarsRef.current.earL.rotation.z = 0.35 + Math.sin(time * 15) * 0.1;
              puppyEarsRef.current.earR.rotation.z = -0.35 - Math.sin(time * 15) * 0.1;
            } else {
              // Subtle curious twitching
              puppyEarsRef.current.earL.rotation.z = Math.sin(time * 3.2) * 0.14;
              puppyEarsRef.current.earR.rotation.z = -Math.sin(time * 3.7) * 0.14;
            }
          }

          // Dynamic Multi-Axis Wagging Tail
          if (tailRef.current) {
            const wagSpeed = isWagging || isDancing ? 24 : isBarking ? 18 : 8;
            const wagAmp = isWagging || isDancing ? 0.75 : 0.35;
            tailRef.current.rotation.y = Math.sin(time * wagSpeed) * wagAmp;
            tailRef.current.rotation.z = Math.cos(time * wagSpeed * 0.5) * 0.22;
          }

          // Pulsating Battery Heart (Biological rhythm pulse)
          if (puppyHeartRef.current) {
            const heartBeat = (time * 3.2) % 1.0;
            const isBeating = heartBeat < 0.18 || (heartBeat > 0.26 && heartBeat < 0.42);
            const intensity = isBarking ? 3.0 : isBeating ? 2.2 : 0.8;
            (puppyHeartRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
          }

          // Blinking OLED Cyber Eyes
          if (puppyEyesRef.current.length > 0) {
            const blink = (time * 0.7) % 3.0 < 0.15;
            puppyEyesRef.current.forEach(eye => {
              (eye.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 0.2 : 1.5;
            });
          }

        } else if (robotType === 'biped') {
          // --- ROBO-BOBI (Humanoid Companion Social Robotics) ---
          const isDriving = actionTrigger === 'move_forward' || actionTrigger === 'edu_motor' || actionTrigger === 'edu_motor_drive';
          const isWaving = actionTrigger === 'wave_hand' || isDancing || actionTrigger === 'edu_motor_arm';
          const isSpeaking = actionTrigger === 'beep_sound' || actionTrigger === 'edu_brain' || actionTrigger === 'edu_brain_signal';
          const isSleepy = actionTrigger === 'edu_battery_low';
          const isEnergized = actionTrigger === 'edu_battery_full';
          const isSensorScan = actionTrigger === 'edu_sensor' || actionTrigger === 'edu_sensor_eye' || actionTrigger === 'edu_move_obstacle';
          const isTurnLeft = actionTrigger === 'edu_turn_left';
          const isTurnRight = actionTrigger === 'edu_turn_right';
          const isMoveObstacle = actionTrigger === 'edu_move_obstacle';
          const isTouchReact = actionTrigger === 'edu_sensor_touch';
          const isMagnetOn = actionTrigger === 'edu_magnet';

          const bobiBaseY = 0.0 + yOffset;

          if (isSleepy) {
            // Robot is exhausted / battery depleted
            robotGroup.position.y = bobiBaseY - 0.24;
            robotGroup.position.z = 0;
            robotGroup.rotation.x = 0.15;
            robotGroup.rotation.y = 0;
            robotGroup.rotation.z = 0;
          } else if (isEnergized) {
            // Happy energetic bounce
            robotGroup.position.y = bobiBaseY + Math.abs(Math.sin(time * 6)) * 0.14;
            robotGroup.position.z = 0;
            robotGroup.rotation.z = Math.sin(time * 5) * 0.04;
            robotGroup.rotation.y = 0;
            robotGroup.rotation.x = -0.04;
          } else if (isMoveObstacle) {
            // Forward toward obstacle on the field, stops when sensor detects obstacle wall, reverses & turns!
            const cycleTime = (time * 0.9) % 8.0;

            if (cycleTime < 3.2) {
              // 1. Moving forward across the field towards the obstacle wall
              const t = cycleTime / 3.2; // 0 to 1
              robotGroup.position.z = -1.2 + t * 2.4; // Moves from -1.2 to +1.2
              robotGroup.position.y = bobiBaseY + Math.sin(time * 10) * 0.015;
              robotGroup.rotation.x = -0.08; // Leaning forward into acceleration
              robotGroup.rotation.y = 0;
              robotGroup.rotation.z = Math.sin(time * 6) * 0.015;
              wheelsRef.current.forEach(w => { w.rotation.x += 0.35; });
            } else if (cycleTime < 4.5) {
              // 2. Obstacle detected! Sensor radar flashes red alert, Bobi stops!
              robotGroup.position.z = 1.2;
              robotGroup.position.y = bobiBaseY;
              robotGroup.rotation.x = 0.08; // Brake lean back
              robotGroup.rotation.y = Math.sin(time * 8) * 0.08; // Curious alert head/body shake
              robotGroup.rotation.z = 0;
            } else if (cycleTime < 5.8) {
              // 3. Reverse backward away from the wall
              const tRev = (cycleTime - 4.5) / 1.3;
              robotGroup.position.z = 1.2 - tRev * 0.45; // Backs up from 1.2 to 0.75
              robotGroup.position.y = bobiBaseY + Math.sin(time * 8) * 0.012;
              robotGroup.rotation.x = 0.04;
              robotGroup.rotation.y = 0;
              wheelsRef.current.forEach(w => { w.rotation.x -= 0.25; });
            } else {
              // 4. Turn wheels and steer safely away to the right!
              robotGroup.position.z = 0.75;
              robotGroup.position.y = bobiBaseY + Math.sin(time * 8) * 0.012;
              robotGroup.rotation.x = -0.04;
              robotGroup.rotation.y = 0.65; // Turned 37 degrees away from wall
              robotGroup.rotation.z = 0.04;
              wheelsRef.current.forEach(w => { w.rotation.x += 0.3; });
            }
          } else if (isTurnLeft) {
            robotGroup.position.y = bobiBaseY + Math.sin(time * 6) * 0.01;
            robotGroup.rotation.y = Math.sin(time * 3) * 0.55;
            robotGroup.rotation.z = -0.05;
            wheelsRef.current.forEach(w => { w.rotation.x += 0.25; });
          } else if (isTurnRight) {
            robotGroup.position.y = bobiBaseY + Math.sin(time * 6) * 0.01;
            robotGroup.rotation.y = -Math.sin(time * 3) * 0.55;
            robotGroup.rotation.z = 0.05;
            wheelsRef.current.forEach(w => { w.rotation.x += 0.25; });
          } else if (isTouchReact) {
            // Reacts with tickled giggle bounce!
            robotGroup.position.y = bobiBaseY + Math.sin(time * 14) * 0.04;
            robotGroup.rotation.z = Math.sin(time * 12) * 0.06;
          } else if (isDriving) {
            // Dynamic forward acceleration Segway lean & gentle balance sway
            robotGroup.position.y = bobiBaseY + Math.sin(time * 6) * 0.012;
            robotGroup.position.z = Math.sin(time * 2.5) * 0.3;
            robotGroup.rotation.x = -0.07 + Math.sin(time * 8) * 0.02;
            robotGroup.rotation.z = Math.sin(time * 5) * 0.015;
            wheelsRef.current.forEach(w => { w.rotation.x += 0.3; });
          } else if (isDancing) {
            // Cheerful robotic boogie celebration
            robotGroup.position.y = bobiBaseY + Math.sin(time * 6) * 0.08;
            robotGroup.rotation.z = Math.sin(time * 5) * 0.06;
            robotGroup.rotation.x = Math.sin(time * 4) * 0.03;
          } else {
            // Lifelike calm balance breathing
            robotGroup.position.y = bobiBaseY + Math.sin(time * 2.5) * 0.008;
            robotGroup.position.z = 0;
            robotGroup.rotation.x = 0;
            robotGroup.rotation.y = 0;
            robotGroup.rotation.z = 0;
          }

          // Articulated Head & Friendly Gaze
          if (headRef.current) {
            if (isSleepy) {
              headRef.current.rotation.x = 0.45;
              headRef.current.rotation.y = 0;
              headRef.current.rotation.z = 0;
            } else if (isTouchReact) {
              headRef.current.rotation.y = Math.sin(time * 14) * 0.25;
              headRef.current.rotation.z = Math.sin(time * 10) * 0.12;
            } else if (isSpeaking) {
              // Enthusiastic speaking head nods
              headRef.current.rotation.x = -0.15 + Math.sin(time * 16) * 0.12;
              headRef.current.rotation.y = Math.sin(time * 8) * 0.1;
              headRef.current.rotation.z = 0;
            } else if (isWaving) {
              // Tilt head warmly towards user
              headRef.current.rotation.z = -0.12 + Math.sin(time * 4) * 0.05;
              headRef.current.rotation.y = 0.12;
              headRef.current.rotation.x = Math.sin(time * 3) * 0.04;
            } else if (isDriving || isMoveObstacle) {
              // Forward attentive posture
              headRef.current.rotation.x = 0.06;
              headRef.current.rotation.y = Math.sin(time * 2) * 0.05;
              headRef.current.rotation.z = 0;
            } else {
              // Natural curious social gaze (looking around warmly)
              headRef.current.rotation.y = Math.sin(time * 1.4) * 0.22;
              headRef.current.rotation.z = Math.sin(time * 1.1) * 0.08;
              headRef.current.rotation.x = Math.sin(time * 2.0) * 0.05;
            }
          }

          // Articulated 2-Segment Waving Left Arm (Lifted outward away from body)
          if (leftArmRef.current) {
            if (isSleepy) {
              leftArmRef.current.rotation.z = -0.12;
              leftArmRef.current.rotation.x = 0.12;
              if (bobiLeftElbowRef.current) {
                bobiLeftElbowRef.current.rotation.z = 0;
              }
            } else if (isWaving) {
              // Lift upper arm high outward to the left in a joyful wave
              leftArmRef.current.rotation.z = -1.25 + Math.sin(time * 4) * 0.15;
              leftArmRef.current.rotation.x = 0.2 + Math.sin(time * 3) * 0.12;
              if (bobiLeftElbowRef.current) {
                // Forearm and palm wave enthusiastically side-to-side
                bobiLeftElbowRef.current.rotation.z = -0.45 + Math.sin(time * 12) * 0.55;
              }
            } else if (isDriving || isMoveObstacle) {
              // Arms poised outward for aerodynamic Segway balance
              leftArmRef.current.rotation.z = -0.32;
              leftArmRef.current.rotation.x = -0.15 + Math.sin(time * 6) * 0.04;
              if (bobiLeftElbowRef.current) {
                bobiLeftElbowRef.current.rotation.z = -0.18;
              }
            } else {
              // Idle natural posture: lifted outward to the left (~22°) away from torso
              leftArmRef.current.rotation.z = -0.38 + Math.sin(time * 2.5) * 0.04;
              leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.03;
              if (bobiLeftElbowRef.current) {
                bobiLeftElbowRef.current.rotation.z = -0.16;
              }
            }
          }

          // Right Magnetic Claw Arm motion (Lifted outward away from body)
          if (rightArmRef.current) {
            if (isMagnetOn) {
              rightArmRef.current.rotation.z = 1.05 + Math.sin(time * 4) * 0.12;
              rightArmRef.current.rotation.x = -0.25;
              if (bobiRightElbowRef.current) {
                bobiRightElbowRef.current.rotation.z = 0.45;
              }
            } else if (isSleepy) {
              rightArmRef.current.rotation.z = 0.12;
              rightArmRef.current.rotation.x = 0.12;
              if (bobiRightElbowRef.current) {
                bobiRightElbowRef.current.rotation.z = 0;
              }
            } else if (isDancing) {
              // Cheerful celebration lift outward to the right
              rightArmRef.current.rotation.z = 1.25 + Math.sin(time * 5) * 0.2;
              rightArmRef.current.rotation.x = 0.2;
              if (bobiRightElbowRef.current) {
                bobiRightElbowRef.current.rotation.z = 0.45 + Math.sin(time * 10) * 0.4;
              }
            } else if (isDriving || isMoveObstacle) {
              // Symmetrical poise outward to the right
              rightArmRef.current.rotation.z = 0.32;
              rightArmRef.current.rotation.x = -0.15 + Math.sin(time * 6) * 0.04;
              if (bobiRightElbowRef.current) {
                bobiRightElbowRef.current.rotation.z = 0.18;
              }
            } else {
              // Idle natural posture: lifted outward to the right (~22°) away from torso
              rightArmRef.current.rotation.z = 0.38 - Math.sin(time * 2.5) * 0.04;
              rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.03;
              if (bobiRightElbowRef.current) {
                bobiRightElbowRef.current.rotation.z = 0.16;
              }
            }
          }

          // Wheels Rotation when driving
          if (isDriving) {
            wheelsRef.current.forEach(w => {
              w.rotation.x += 0.28;
            });
          }

          // Chest Battery Energy Core (Biological rhythm pulse)
          if (bobiChestCoreRef.current) {
            if (isSleepy) {
              (bobiChestCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12;
            } else if (isEnergized) {
              (bobiChestCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.8;
            } else {
              const beat = (time * 3) % 1.0;
              const isPulse = beat < 0.2 || (beat > 0.3 && beat < 0.45);
              const intensity = isSpeaking ? 2.8 : isPulse ? 2.0 : 0.8;
              (bobiChestCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
            }
          }

          // Speaker Mouth Voice Illumination (pulses with voice waves)
          if (bobiMouthRef.current) {
            if (isSpeaking) {
              const voiceFlicker = Math.sin(time * 25) > 0 ? 2.5 : 0.4;
              (bobiMouthRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = voiceFlicker;
            } else {
              (bobiMouthRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
            }
          }

          // Antenna Communication Status Bulbs
          bobiAntennaBulbsRef.current.forEach((bulb, idx) => {
            const pulse = isSpeaking || isDriving || isSensorScan ? Math.sin(time * 18 + idx * Math.PI) > 0.2 : Math.sin(time * 3 + idx) > 0.5;
            (bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse ? 2.5 : 0.5;
          });

          // Blinking OLED Digital Eyes
          if (bobiEyesRef.current.length > 0) {
            if (isSleepy) {
              bobiEyesRef.current.forEach(eye => {
                (eye.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.08;
              });
            } else if (isSensorScan || isEnergized) {
              bobiEyesRef.current.forEach(eye => {
                (eye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5;
              });
            } else {
              const blink = (time * 0.8) % 3.2 < 0.14;
              bobiEyesRef.current.forEach(eye => {
                (eye.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 0.2 : 1.4;
              });
            }
          }

          // Magnet Claw Force Field Spark Pulsing
          if (bobiMagnetGlowRef.current) {
            const magPulse = 1.0 + Math.sin(time * 8) * 0.45;
            (bobiMagnetGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 * magPulse;
            bobiMagnetGlowRef.current.scale.setScalar(0.9 + magPulse * 0.2);
          }
        }
      }

      // RoboWebGL Arm Forward Kinematics animation
      if (armJ1Ref.current && armJ2Ref.current && armJ3Ref.current && armWristRef.current) {
        if (actionTrigger === 'move_forward') {
          armJ1Ref.current.rotation.y = Math.sin(time * 2.2) * 0.8;
          armJ2Ref.current.rotation.z = Math.sin(time * 2.2) * 0.45 - 0.4;
          armJ3Ref.current.rotation.z = Math.cos(time * 2.2) * 0.5 + 1.1;
          armWristRef.current.rotation.z = -armJ2Ref.current.rotation.z - armJ3Ref.current.rotation.z - 0.2;
        } else if (isDancing) {
          armJ1Ref.current.rotation.y = Math.sin(time * 3) * 0.9;
          armJ2Ref.current.rotation.z = Math.sin(time * 4) * 0.35 - 0.35;
          armJ3Ref.current.rotation.z = Math.cos(time * 4) * 0.45 + 0.95;
          armWristRef.current.rotation.z = Math.sin(time * 5) * 0.6;
        } else {
          armJ1Ref.current.rotation.y = Math.sin(time * 0.8) * 0.45;
          armJ2Ref.current.rotation.z = Math.sin(time * 0.6) * 0.25 - 0.35;
          armJ3Ref.current.rotation.z = Math.cos(time * 0.6) * 0.35 + 0.95;
          armWristRef.current.rotation.z = -armJ2Ref.current.rotation.z - armJ3Ref.current.rotation.z + 0.2;
        }

        if (armSphereRef.current) {
          const s = 1 + Math.sin(time * 4) * 0.08;
          armSphereRef.current.scale.set(s, s, s);
        }
      }

      // Counter-Rotating Propellers & Aerodynamics for Drone
      if (robotType === 'drone') {
        const propSpeed = actionTrigger === 'spin_propeller' || isDancing ? 0.95 : actionTrigger === 'move_forward' ? 0.8 : 0.55;
        propellersRef.current.forEach((p, idx) => {
          // Physics-accurate counter-rotation (cancellation of rotational torque)
          // Rotor 0 & 2 spin CW (+), Rotor 1 & 3 spin CCW (-)
          const direction = (idx === 0 || idx === 2) ? 1 : -1;
          p.rotation.y += propSpeed * direction;
        });

        // 3-Axis Gyro-Stabilized Camera Gimbal
        // Gimbal counter-acts body pitch and roll to keep the camera locked on the horizon
        if (droneGimbalRef.current) {
          droneGimbalRef.current.rotation.x = -robotGroup.rotation.x * 0.85;
          droneGimbalRef.current.rotation.z = -robotGroup.rotation.z * 0.85;
        }

        // Aviation Navigation & Anti-Collision Strobe LEDs
        const strobeFlash = Math.sin(time * 12) > 0.65;
        droneLedsRef.current.forEach(led => {
          if (led.userData && led.userData.isStrobe) {
            (led.material as THREE.MeshStandardMaterial).emissiveIntensity = strobeFlash ? 2.8 : 0.08;
          } else {
            (led.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + Math.sin(time * 4) * 0.35;
          }
        });

        // Propeller Downwash Ground Effect (Expanding vortex rings on platform)
        droneDownwashRef.current.forEach((ring, idx) => {
          const cycle = (time * 1.8 + idx * 0.5) % 1.0;
          const scale = 1.0 + cycle * 1.7;
          ring.scale.set(scale, scale, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = (1.0 - cycle) * 0.45;
        });
      }

      // Update Educational 3D Meshes & Overlays (Sensor radar, Brain aura, Shield, Battery spark)
      const isEduRadar = actionTrigger === 'edu_sensor' || actionTrigger === 'edu_sensor_eye' || actionTrigger === 'edu_sensor_sound' || actionTrigger === 'edu_sensor_touch' || actionTrigger === 'edu_move_obstacle';
      const isEduBrain = actionTrigger === 'edu_brain' || actionTrigger === 'edu_brain_signal';
      const isEduShield = actionTrigger === 'edu_casing';
      const isEduBatteryFull = actionTrigger === 'edu_battery_full';

      if (eduRadarRef.current) {
        eduRadarRef.current.visible = isEduRadar;
        if (isEduRadar) {
          eduRadarRef.current.position.z = robotGroup.position.z + 1.8;
          eduRadarRef.current.position.x = robotGroup.position.x;
          eduRadarRef.current.rotation.y = robotGroup.rotation.y;
          eduRadarRef.current.rotation.z += 0.04;
          const cycleTime = (time * 0.9) % 8.0;
          const isDangerZone = actionTrigger === 'edu_move_obstacle' && cycleTime >= 3.0 && cycleTime < 5.8;
          if (isDangerZone) {
            (eduRadarRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
            (eduRadarRef.current.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(time * 16) * 0.25;
          } else {
            (eduRadarRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
            (eduRadarRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(time * 8) * 0.2;
          }
        }
      }

      if (eduBrainRingRef.current) {
        eduBrainRingRef.current.visible = isEduBrain;
        if (isEduBrain) {
          eduBrainRingRef.current.position.z = robotGroup.position.z;
          eduBrainRingRef.current.position.x = robotGroup.position.x;
          eduBrainRingRef.current.rotation.z += 0.05;
          const brainPulse = 1.0 + Math.sin(time * 6) * 0.12;
          eduBrainRingRef.current.scale.set(brainPulse, brainPulse, brainPulse);
        }
      }

      if (eduShieldRef.current) {
        eduShieldRef.current.visible = isEduShield;
        if (isEduShield) {
          eduShieldRef.current.position.z = robotGroup.position.z;
          eduShieldRef.current.position.x = robotGroup.position.x;
          eduShieldRef.current.rotation.y += 0.015;
          const shieldPulse = 1.0 + Math.sin(time * 4) * 0.04;
          eduShieldRef.current.scale.set(shieldPulse, shieldPulse, shieldPulse);
        }
      }

      if (bobiWallBeaconRef.current) {
        const cycleTime = (time * 0.9) % 8.0;
        const isAlarm = actionTrigger === 'edu_move_obstacle' && cycleTime >= 3.0 && cycleTime < 5.8;
        (bobiWallBeaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isAlarm ? 3.5 + Math.sin(time * 25) * 2.0 : 0.4;
      }

      if (eduBatterySparkRef.current) {
        eduBatterySparkRef.current.visible = isEduBatteryFull;
        if (isEduBatteryFull) {
          eduBatterySparkRef.current.rotation.z -= 0.08;
          const sparkPulse = 0.8 + Math.abs(Math.sin(time * 5)) * 0.4;
          eduBatterySparkRef.current.scale.set(sparkPulse, sparkPulse, sparkPulse);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      const horizDist = orbitRadius * Math.cos(currentPhi);
      camera.position.x = horizDist * Math.sin(currentTheta);
      camera.position.y = targetCenterY + orbitRadius * Math.sin(currentPhi);
      camera.position.z = horizDist * Math.cos(currentTheta);
      camera.lookAt(0, targetCenterY, 0);
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [robotType, isDancing, actionTrigger]);

  return (
    <div className={`relative w-full h-full min-h-[460px] flex items-center justify-center select-none ${className}`}>
      {robotType === 'arm' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ROBOWEBGL • 6-DOF SIMULATION</span>
        </div>
      )}
      {robotType === 'drone' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-teal-300 font-mono text-[11px] font-bold border border-teal-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>ROBO-AERO • AERODYNAMIC FLIGHT SIMULATION</span>
        </div>
      )}
      {robotType === 'rover' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-orange-300 font-mono text-[11px] font-bold border border-orange-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span>ROBO-ROVER • MARS EXPLORATION CHASSIS</span>
        </div>
      )}
      {robotType === 'pet' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-pink-300 font-mono text-[11px] font-bold border border-pink-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span>ROBO-PUPPY • BIOMIMETIC QUADRUPED SIMULATION</span>
        </div>
      )}
      {robotType === 'biped' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-sky-300 font-mono text-[11px] font-bold border border-sky-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>ROBO-BOBI • HUMANOID BIPED SIMULATION</span>
        </div>
      )}

      {/* Quick Camera Angle Buttons: Front vs Top View */}
      {/* <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setFrontViewRef.current?.()}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 ${viewAngle === 'front'
              ? 'bg-blue-600 text-white shadow-blue-300 ring-2 ring-blue-300'
              : 'bg-white/90 text-slate-700 hover:bg-white backdrop-blur-sm border border-slate-200'
            }`}
          title="Tampak Depan"
        >
          <span>🔄 Depan</span>
        </button>
        <button
          type="button"
          onClick={() => setTopViewRef.current?.()}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 ${viewAngle === 'top'
              ? 'bg-blue-600 text-white shadow-blue-300 ring-2 ring-blue-300'
              : 'bg-white/90 text-slate-700 hover:bg-white backdrop-blur-sm border border-slate-200'
            }`}
          title="Tampak Atas (Bird's Eye View)"
        >
          <span>👁️ Dari Atas</span>
        </button>
      </div> */}

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 text-xs font-semibold px-3.5 py-1 rounded-full bg-slate-800/75 text-white pointer-events-none backdrop-blur-sm flex items-center gap-1.5">
        <span>🔄 Sentuh & Tarik Bebas 3D (Geser Ke Bawah Untuk Melihat Dari Atas)</span>
      </div>
    </div>
  );
};

export default ThreeRobotViewer;
