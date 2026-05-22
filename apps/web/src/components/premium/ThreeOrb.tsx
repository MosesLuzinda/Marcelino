"use client";

import { useEffect, useRef } from "react";

export function ThreeOrb({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || process.env.NEXT_PUBLIC_ENABLE_THREE_HERO === "false") return;

    let cleanup = () => {};
    let animId = 0;

    import("three").then((THREE) => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.35, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        wireframe: true,
        emissive: 0x0d9488,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          emissive: 0xc9a227,
          emissiveIntensity: 0.35,
          metalness: 1,
          roughness: 0.15,
        })
      );
      scene.add(inner);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const key = new THREE.PointLight(0x14b8a6, 2, 20);
      key.position.set(3, 2, 4);
      scene.add(key);
      const rim = new THREE.PointLight(0xd4af37, 1.2, 20);
      rim.position.set(-3, -1, 2);
      scene.add(rim);

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.004;
        inner.rotation.y -= 0.003;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        mount.removeChild(renderer.domElement);
      };
    });

    return () => cleanup();
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden />;
}
