import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Sphere = () => {
  const mountRef = useRef();

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    container.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();

    const particlesCount = 15000;
    const positions = new Float32Array(
      particlesCount * 3
    );

    for (let i = 0; i < particlesCount; i++) {
      const radius = 2;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(
        2 * Math.random() - 1
      );

      positions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);

      positions[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3 + 2] =
        radius * Math.cos(phi);
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: "#A855F7",
      size: 0.03,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(
      geometry,
      material
    );

    scene.add(particles);

    const clock = new THREE.Clock();

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(
        animate
      );

      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.3;
      particles.rotation.x =
        Math.sin(t * 0.5) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (
        container &&
        renderer.domElement.parentNode
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "350px",
        height: "280px",
      }}
    />
  );
};

export default Sphere;