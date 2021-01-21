import React from "react";
import { Link } from "gatsby";
import Logo from "../logo";
import styles from "./nav.module.scss";

const Nav = (props) => {
  return (
    <div
      className={styles.container}
      style={{
        "--background": props.theme === "dark" && "var(--gray)",
        "--text": props.theme === "dark" && "#fff",
        "height": "100vh",
        "display": "inline-block",
        // "position": "fixed",
        "top": "0",
      }}
    >
      <Link to="/">
        <Logo className={styles.logo} />
      </Link>
      <nav className={styles.links}>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <Link to="/nominate" className={styles.link}>
          Join
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
