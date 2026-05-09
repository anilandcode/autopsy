'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DataWaveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1A1E1C, 0.025);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 8, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Abstract Data Wave Mesh
    const width = 60;
    const depth = 60;
    const size = 1.2;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(width * depth * 3);
    const colors = new Float32Array(width * depth * 3);

    const colorPrimary = new THREE.Color('#4B4BA0');
    const colorTertiary = new THREE.Color('#8F47AE');
    const colorDeep = new THREE.Color('#0A0C0B');

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const pX = (x - width / 2) * size;
        const pZ = (z - depth / 2) * size;

        positions[i * 3] = pX;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pZ;

        colorPrimary.toArray(colors, i * 3);
        i++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointCloud.position.y = -6;
    scene.add(pointCloud);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.002;
      mouseY = (event.clientY - windowHalfY) * 0.002;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let time = 0;
    let animationFrameId: number;

    const animateLoop = () => {
      animationFrameId = requestAnimationFrame(animateLoop);
      time += 0.015;

      targetX = mouseX * 2;
      targetY = mouseY * 2;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (8 + targetY - camera.position.y) * 0.02;
      camera.lookAt(0, -2, 0);

      const posArray = pointCloud.geometry.attributes.position.array as Float32Array;
      const colArray = pointCloud.geometry.attributes.color.array as Float32Array;

      let index = 0;
      for (let x = 0; x < width; x++) {
        for (let z = 0; z < depth; z++) {
          const pX = posArray[index * 3];
          const pZ = posArray[index * 3 + 2];

          const wave1 = Math.sin(pX * 0.2 + time) * 1.5;
          const wave2 = Math.cos(pZ * 0.15 + time * 0.8) * 1.5;
          const noise = Math.sin(pX * 0.1) * Math.cos(pZ * 0.1) * 2;

          const height = wave1 + wave2 + noise;
          posArray[index * 3 + 1] = height;

          let mixedColor;
          if (height > 1.5) {
            const factor = Math.min((height - 1.5) * 0.5, 1);
            mixedColor = colorPrimary.clone().lerp(colorTertiary, factor);
          } else if (height > 0) {
            mixedColor = colorPrimary;
          } else {
            const factor = Math.min(Math.abs(height) * 0.4, 1);
            mixedColor = colorPrimary.clone().lerp(colorDeep, factor);
          }

          mixedColor.toArray(colArray, index * 3);
          index++;
        }
      }

      pointCloud.geometry.attributes.position.needsUpdate = true;
      pointCloud.geometry.attributes.color.needsUpdate = true;

      pointCloud.rotation.y = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animateLoop();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    />
  );
}
