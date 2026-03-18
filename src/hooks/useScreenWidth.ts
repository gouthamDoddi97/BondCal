import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export function useScreenWidth(): number {
  const [width, setWidth] = useState(() => Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  return width;
}
