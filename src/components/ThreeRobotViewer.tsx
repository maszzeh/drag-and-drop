'use client';

import React, { useEffect, useRef } from 'react';
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
  const propellersRef = useRef<THREE.Mesh[]>([]);
  const tailRef = useRef<THREE.Group | null>(null);
  const armJ1Ref = useRef<THREE.Group | null>(null);
  const armJ2Ref = useRef<THREE.Group | null>(null);
  const armJ3Ref = useRef<THREE.Group | null>(null);
  const armWristRef = useRef<THREE.Group | null>(null);
  const armSphereRef = useRef<THREE.Mesh | null>(null);

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
      camera.position.set(0, 1.4, 6.4);
      camera.lookAt(0, 0.5, 0);
    } else {
      camera.position.set(0, 0.6, 5.5);
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
    scene.add(platform);

    const platformRingGeo = new THREE.RingGeometry(1.6, 1.85, 32);
    const platformRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const platformRing = new THREE.Mesh(platformRingGeo, platformRingMat);
    platformRing.rotation.x = -Math.PI / 2;
    platformRing.position.y = -1.02;
    scene.add(platformRing);

    // 4. Build 3D Robot Models
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    wheelsRef.current = [];
    propellersRef.current = [];

    // Color definitions
    const matBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.2 });
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
      // --- ROBO-BOBI (Humanoid Biped) ---
      // Body
      const bodyGeo = new THREE.BoxGeometry(1.4, 1.2, 1.0);
      const body = new THREE.Mesh(bodyGeo, matBlue);
      body.position.y = -0.2;
      robotGroup.add(body);

      // Battery Screen on Chest
      const screenGeo = new THREE.BoxGeometry(0.8, 0.5, 0.1);
      const screen = new THREE.Mesh(screenGeo, matHeart);
      screen.position.set(0, -0.2, 0.52);
      robotGroup.add(screen);

      // Head
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.9, 0);
      headRef.current = headGroup;

      const headGeo = new THREE.BoxGeometry(1.2, 0.9, 0.9);
      const head = new THREE.Mesh(headGeo, matBlue);
      headGroup.add(head);

      // Eyes Screen
      const eyeScreenGeo = new THREE.BoxGeometry(0.9, 0.4, 0.08);
      const eyeScreen = new THREE.Mesh(eyeScreenGeo, matDark);
      eyeScreen.position.set(0, 0.05, 0.46);
      headGroup.add(eyeScreen);

      // Glowing Cyan Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matGlowEye);
      eyeL.position.set(-0.25, 0.05, 0.52);
      headGroup.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matGlowEye);
      eyeR.position.set(0.25, 0.05, 0.52);
      headGroup.add(eyeR);

      // Antennas
      const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), matDark);
      antL.position.set(-0.4, 0.6, 0);
      headGroup.add(antL);
      const bulbL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matYellow);
      bulbL.position.set(-0.4, 0.8, 0);
      headGroup.add(bulbL);

      const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), matDark);
      antR.position.set(0.4, 0.6, 0);
      headGroup.add(antR);
      const bulbR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matYellow);
      bulbR.position.set(0.4, 0.8, 0);
      headGroup.add(bulbR);

      robotGroup.add(headGroup);

      // Left Arm (waving arm)
      const lArm = new THREE.Group();
      lArm.position.set(-0.9, 0.2, 0);
      leftArmRef.current = lArm;
      const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.9, 16), matBlue);
      lArmMesh.position.y = -0.35;
      lArm.add(lArmMesh);
      const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), matYellow);
      lHand.position.y = -0.85;
      lArm.add(lHand);
      robotGroup.add(lArm);

      // Right Arm (gripper)
      const rArm = new THREE.Group();
      rArm.position.set(0.9, 0.2, 0);
      rightArmRef.current = rArm;
      const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.9, 16), matBlue);
      rArmMesh.position.y = -0.35;
      rArm.add(rArmMesh);
      const rHand = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.06, 16, 32, Math.PI), matYellow);
      rHand.position.set(0, -0.85, 0);
      rHand.rotation.z = Math.PI / 2;
      rArm.add(rHand);
      robotGroup.add(rArm);

      // Roller Feet Base
      const feetBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 0.9), matDark);
      feetBase.position.y = -0.95;
      robotGroup.add(feetBase);

      // 2 Big Roller Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelL = new THREE.Mesh(wheelGeo, matDark);
      wheelL.position.set(-0.55, -1.2, 0);
      robotGroup.add(wheelL);
      wheelsRef.current.push(wheelL);

      const wheelR = new THREE.Mesh(wheelGeo, matDark);
      wheelR.position.set(0.55, -1.2, 0);
      robotGroup.add(wheelR);
      wheelsRef.current.push(wheelR);

    } else if (robotType === 'rover') {
      // --- ROBO-ROVER (Mars Rover) ---
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.4), matOrange);
      chassis.position.y = -0.2;
      robotGroup.add(chassis);

      // Solar Wings
      const wingGeo = new THREE.BoxGeometry(1.1, 0.08, 0.8);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.6, roughness: 0.2 });
      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.set(-1.45, 0.05, 0);
      robotGroup.add(wingL);

      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.set(1.45, 0.05, 0);
      robotGroup.add(wingR);

      // Camera Mast
      const mastGroup = new THREE.Group();
      mastGroup.position.set(0, 0.4, 0.4);
      headRef.current = mastGroup;

      const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9), matDark);
      mastPole.position.y = 0.45;
      mastGroup.add(mastPole);

      const camHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.4), matDark);
      camHead.position.y = 0.95;
      mastGroup.add(camHead);

      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16), matGlowEye);
      camLens.rotateX(Math.PI / 2);
      camLens.position.set(0, 0.95, 0.25);
      mastGroup.add(camLens);

      robotGroup.add(mastGroup);

      // 6 Rover Wheels
      const rWheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 24);
      rWheelGeo.rotateZ(Math.PI / 2);
      const xPositions = [-0.9, 0, 0.9];
      const zPositions = [-0.75, 0.75];

      xPositions.forEach(x => {
        zPositions.forEach(z => {
          const w = new THREE.Mesh(rWheelGeo, matDark);
          w.position.set(x, -0.9, z);
          robotGroup.add(w);
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
      // --- ROBO-AERO (Drone) ---
      const dBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 1.0), matTeal);
      dBody.position.y = 0.2;
      robotGroup.add(dBody);

      const dSensor = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), matGlowEye);
      dSensor.position.set(0, 0.4, 0);
      robotGroup.add(dSensor);

      // 4 Arm Rotors + Propellers
      const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      armAngles.forEach(angle => {
        const dArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), matDark);
        dArm.rotateZ(Math.PI / 2);
        dArm.rotateY(angle);
        dArm.position.set(0, 0.2, 0);
        robotGroup.add(dArm);

        const propGeo = new THREE.BoxGeometry(0.9, 0.02, 0.12);
        const prop = new THREE.Mesh(propGeo, matTeal);
        const px = Math.cos(angle) * 1.0;
        const pz = Math.sin(angle) * 1.0;
        prop.position.set(px, 0.35, pz);
        robotGroup.add(prop);
        propellersRef.current.push(prop);
      });

      // Landing Skids
      const skidGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4);
      skidGeo.rotateZ(Math.PI / 2);
      const skidL = new THREE.Mesh(skidGeo, matDark);
      skidL.position.set(0, -0.4, -0.5);
      robotGroup.add(skidL);

      const skidR = new THREE.Mesh(skidGeo, matDark);
      skidR.position.set(0, -0.4, 0.5);
      robotGroup.add(skidR);

    } else {
      // --- ROBO-PUPPY ---
      const pBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.9), matPink);
      pBody.position.set(-0.2, -0.1, 0);
      robotGroup.add(pBody);

      const pHead = new THREE.Group();
      pHead.position.set(0.8, 0.5, 0);
      headRef.current = pHead;

      const pHeadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), matPink);
      pHead.add(pHeadMesh);

      // Snout
      const pSnout = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.5), matYellow);
      pSnout.position.set(0.45, -0.1, 0);
      pHead.add(pSnout);

      // Puppy Ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.3), matDark);
      earL.position.set(0, 0.4, 0.45);
      pHead.add(earL);

      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.3), matDark);
      earR.position.set(0, 0.4, -0.45);
      pHead.add(earR);

      robotGroup.add(pHead);

      // Wagging Tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-1.0, 0.2, 0);
      tailRef.current = tailGroup;
      const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6), matYellow);
      tailMesh.position.set(-0.2, 0.25, 0);
      tailMesh.rotation.z = Math.PI / 4;
      tailGroup.add(tailMesh);
      robotGroup.add(tailGroup);

      // 4 Paws
      const pawGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
      const pawPositions = [
        [-0.7, -0.7, -0.4],
        [-0.7, -0.7, 0.4],
        [0.4, -0.7, -0.4],
        [0.4, -0.7, 0.4],
      ];
      pawPositions.forEach(([x, y, z]) => {
        const paw = new THREE.Mesh(pawGeo, matDark);
        paw.position.set(x, y, z);
        robotGroup.add(paw);
      });
    }

    // 5. User Interaction: Drag to rotate
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !robotGroup) return;
      const deltaX = e.clientX - prevMouseX;
      targetRotationY += deltaX * 0.015;
      prevMouseX = e.clientX;
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

      // Smooth rotation toward user drag
      if (robotGroup) {
        robotGroup.rotation.y += (targetRotationY - robotGroup.rotation.y) * 0.1;

        // Idle floating / bobbing & grounded positioning
        if (robotType === 'arm') {
          // Base flange rests firmly on the coordinate grid floor (-1.14) without floating or cutting off
          robotGroup.position.y = -0.01 + yOffset;
          robotGroup.rotation.z = 0;
        } else if (isDancing) {
          const baseY = 0.35 + yOffset;
          robotGroup.position.y = baseY + Math.sin(time * 6) * 0.18;
          robotGroup.rotation.z = Math.sin(time * 5) * 0.08;
        } else {
          const baseY = 0.35 + yOffset;
          robotGroup.position.y = baseY + Math.sin(time * 2) * 0.06;
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

      // Propellers spin for drone
      propellersRef.current.forEach(p => {
        p.rotation.y += 0.4;
      });

      // Tail wag for puppy
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(time * 12) * 0.6;
      }

      // Waving arm animation
      if (leftArmRef.current) {
        if (isDancing || actionTrigger === 'wave_hand') {
          leftArmRef.current.rotation.z = Math.sin(time * 10) * 0.6 + 0.6;
        } else {
          leftArmRef.current.rotation.z = Math.sin(time * 2) * 0.1;
        }
      }

      // Spinning wheels
      if (actionTrigger === 'move_forward') {
        wheelsRef.current.forEach(w => {
          w.rotation.x += 0.2;
        });
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
      if (robotType === 'arm') {
        camera.lookAt(0, 0.5, 0);
      } else {
        camera.lookAt(0, 0.25, 0);
      }
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
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center select-none ${className}`}>
      {robotType === 'arm' && (
        <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/40 backdrop-blur-sm pointer-events-none shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ROBOWEBGL • 6-DOF SIMULATION</span>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/60 text-white pointer-events-none backdrop-blur-sm">
        🔄 Sentuh & Putar 3D Robot
      </div>
    </div>
  );
};
