import React from 'react';
import styles from './NavigationBar.module.css';
import DropdownButton from './Dropdown';

interface NavigationBarProps {
}

const NavigationBar: React.FC<NavigationBarProps> = ({ }) => {
  return (
    <nav className={styles.navigationBar}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={"/logo.png"} alt="Logo" />
      </div>
    </nav>
  );
};

export default NavigationBar;
