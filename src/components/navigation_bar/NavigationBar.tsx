import React from 'react';
import styles from './NavigationBar.module.css';
import DropdownButton from './Dropdown';

interface NavigationBarProps {
}

const NavigationBar: React.FC<NavigationBarProps> = ({ }) => {
  return (
    <nav className={styles.navigationBar}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={"/5.gif"} alt="Logo" /> Powered by Fable Friends Co.
      </div>
    </nav>
  );
};

export default NavigationBar;
