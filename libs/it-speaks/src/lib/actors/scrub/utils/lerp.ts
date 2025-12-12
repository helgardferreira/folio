/**
 * Linearly interpolates between min and max using a normalized value.
 *
 * @param t Normalized value (usually in the range 0–1)
 * @param min Minimum value of the range
 * @param max Maximum value of the range
 */
// TODO: move this to shared `utils` library
export function lerp(t: number, min: number, max: number): number {
  return min + t * (max - min);
}
