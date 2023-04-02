import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './LoadingOverlay.module.css';

interface Props {
  isLoading: boolean;
  imageSrc?: string;
}

const LoadingOverlay: FC<Props> = ({ isLoading, imageSrc }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowOverlay(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={showOverlay ? styles.overlayWrapper : styles.hidden}>
      <div className={styles.overlayContent} ref={overlayRef}>
        {isLoading && !imageSrc ? (
          <div className={styles.spinner} />
        ) : (
          <div className={styles.imageWrapper}>
            <img
              src={imageSrc || ''}
              className={styles.image}
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
