import React from "react";
import styles from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.heading}>
        Directory highlights all under represented - scientist, technologists, engineers, artists, mathmeticians and designers.
        </h1>
        <div className={styles.spinner} />
      </div>
    </div>
  );
};

export default Loader;
