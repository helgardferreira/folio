import { extend } from '@react-three/fiber';
import { type ComponentProps, useMemo } from 'react';
import {
  TextGeometry as BaseTextGeometryImpl,
  type TextGeometryParameters,
} from 'three-stdlib';

const TextGeometryImpl = extend(BaseTextGeometryImpl);

export type TextGeometryProps = Omit<
  ComponentProps<typeof TextGeometryImpl>,
  'args' | 'children'
> & { children: string } & TextGeometryParameters;

export function TextGeometry({
  bevelEnabled,
  bevelOffset,
  bevelSize,
  bevelThickness,
  children,
  curveSegments,
  font,
  height,
  letterSpacing,
  lineHeight,
  size,
  ...props
}: TextGeometryProps) {
  const params = useMemo<TextGeometryParameters>(
    () => ({
      bevelEnabled,
      bevelOffset,
      bevelSize,
      bevelThickness,
      curveSegments,
      font,
      height,
      letterSpacing,
      lineHeight,
      size,
    }),
    [
      bevelEnabled,
      bevelOffset,
      bevelSize,
      bevelThickness,
      curveSegments,
      font,
      height,
      letterSpacing,
      lineHeight,
      size,
    ]
  );

  return <TextGeometryImpl args={[children, params]} {...props} />;
}
