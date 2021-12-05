import { Box } from '@mui/system';
import { useEffect, useRef } from 'react';
import { useXarrow } from 'react-xarrows';
import { useMousePosition } from '../hooks';

export const TrackingBox = () => {
  const mainCursor = useRef(null);
  const mouse = useMousePosition();
  const updateXarrow = useXarrow();

  useEffect(() => {
    updateXarrow();
    // eslint-disable-next-line
  }, []);

  const boxStyles = {
    transform: `translate3d(${mouse.x - 18}px, ${mouse.y - 18}px, 0)`,
  };

  return <Box id='mouseTracker' ref={mainCursor} sx={boxStyles} />;
};
