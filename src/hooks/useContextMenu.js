import { useState } from 'react';

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX - 2, mouseY: e.clientY - 4 }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return [contextMenu, handleContextMenu, handleClose];
};
