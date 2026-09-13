"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// "Product Intelligence Sphere" — a lightweight, rotatable point-cloud that
// represents products/categories/markets clustering by opportunity. Kept
// deliberately simple (no heavy postprocessing) so it stays smooth even on
// modest hardware, per the brief: use Three.js only where it genuinely helps.
export function IntelligenceSphere({ points = 260 }: { points?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Wireframe sphere shell
    const shellGeo = new THREE.SphereGeometry(1.6, 24, 18);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xff5a3c, wireframe: true, transparent: true, opacity: 0.12 });
    group.add(new THREE.Mesh(shellGeo, shellMat));

    // Point cloud representing products/categories/markets
    const positions = new Float32Array(points * 3);
    const colors = new Float32Array(points * 3);
    const warm = new THREE.Color(0xff7a45);
    const cool = new THREE.Color(0xffffff);
    for (let i = 0; i < points; i++) {
      const phi = Math.acos(-1 + (2 * i) / points);
      const theta = Math.sqrt(points * Math.PI) * phi;
      const r = 1.6 + Math.random() * 0.35;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const c = warm.clone().lerp(cool, Math.random() * 0.7);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.9 });
    const cloud = new THREE.Points(geo, mat);
    group.add(cloud);

    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotY = 0.6;
    let rotX = 0.2;

    function onDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.005;
      rotX += (e.clientY - lastY) * 0.005;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onUp() {
      dragging = false;
    }
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    function animate() {
      if (!dragging) rotY += 0.0018;
      group.rotation.y = rotY;
      group.rotation.x = rotX * 0.3;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [points]);

  return <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />;
}
