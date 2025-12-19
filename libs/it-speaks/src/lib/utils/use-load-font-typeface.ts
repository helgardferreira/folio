import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { type Font, FontLoader } from 'three-stdlib';

export const loadFontTypefaceQueryKey = 'loadFontTypefaceQueryKey';

export type LoadFontTypefaceRequest = {
  fontName: string;
};

type Options = Omit<UseQueryOptions<Font, Error>, 'queryFn' | 'queryKey'>;

export function useLoadFontTypeface(
  requestParameters: LoadFontTypefaceRequest,
  options?: Options
): UseQueryResult<Font, Error> {
  return useQuery<Font, Error>({
    queryFn: ({ signal }) => {
      const fontLoader = new FontLoader();
      signal.onabort = () => fontLoader.abort();

      const url = new URL(
        `../../assets/typefaces/${requestParameters.fontName}.json`,
        import.meta.url
      ).href;

      return fontLoader.loadAsync(url);
    },
    queryKey: [loadFontTypefaceQueryKey, requestParameters],
    ...options,
  });
}
