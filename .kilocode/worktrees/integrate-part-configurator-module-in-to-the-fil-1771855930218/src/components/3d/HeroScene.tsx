import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = (props: any) => {
    const { scene } = useGLTF('/models/scissor_lift.glb');
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            // Slow turntable rotation
            group.current.rotation.y += 0.005;

            // Subtle mouse influence (tilt)
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.2, 0.1);
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.1, 0.1);
        }
    });

    return (
        <group ref={group}>
            <primitive object={scene} {...props} />
        </group>
    );
};

const CameraRig = () => {
    useFrame((state, delta) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 2, 0.1);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 2, 0.1);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
};

export const HeroScene: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas>
                <CameraRig />
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
                <Environment preset="city" />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />

                <Suspense fallback={null}>
                    <Model position={[0.5, -1.2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={0.8} />
                </Suspense>

                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
};
