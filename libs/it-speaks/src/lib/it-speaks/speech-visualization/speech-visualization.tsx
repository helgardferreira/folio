import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GUI } from 'lil-gui';
import { useMemo } from 'react';
import { Color } from 'three';

import { PanelControlType, PanelGuiProvider, usePanel } from '@folio/panel';

import { useSpeechContext } from '../../actors';
import { TextGeometry } from '../../components';
import { useLoadFontTypeface } from '../../utils';

const gui = new GUI();

// TODO: implement WebGL Visualization
//       - figure out best way to construct scene for visualization
// TODO: continue here...
export function SpeechVisualization() {
  const { speechActor: _ } = useSpeechContext();

  return (
    // TODO: move `PanelGuiProvider` up in component hierarchy
    <PanelGuiProvider gui={gui}>
      <div className="size-full bg-slate-200">
        <Canvas camera={{ position: [150, 50, 200], zoom: 50 }} orthographic>
          <OrbitControls
            enableDamping={false}
            enablePan={false}
            enableZoom={false}
            maxAzimuthAngle={Math.PI / 6}
            maxPolarAngle={Math.PI * (1 / 2)}
            minAzimuthAngle={0}
            minPolarAngle={Math.PI * (2 / 6)}
          />

          <ambientLight color={0xffffff} />

          <TextGeometryExample />

          <gridHelper />
        </Canvas>
      </div>
    </PanelGuiProvider>
  );
}

function TextGeometryExample() {
  const { data: font } = useLoadFontTypeface({ fontName: 'Roboto' });

  const { color, text } = usePanel({
    color: {
      type: PanelControlType.Color,
      value: 0x049ef4,
    },
    text: {
      type: PanelControlType.Text,
      value: 'Hello',
    },
  });

  const materialColor = useMemo(() => new Color(color), [color]);

  if (font === undefined) return null;

  return (
    <mesh position={[-3, 0, 0]}>
      <TextGeometry
        attach="geometry"
        bevelEnabled={false}
        bevelOffset={0}
        bevelSize={0.01}
        bevelThickness={0.1}
        curveSegments={8}
        font={font}
        height={0.2}
        letterSpacing={0}
        lineHeight={1}
        size={1}
      >
        {text}
      </TextGeometry>

      <meshStandardMaterial attach="material" color={materialColor} />
    </mesh>
  );
}
