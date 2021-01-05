import React from "react";
import className from "classnames";
// import { Link } from "gatsby";
import "./secondbutton.module.scss";


const STYLES = [
  "btn--primary--solid"
];

const SIZES = [
  "btn--medium"
];

const Button = ({
  children, 
  type, 
  onClick, 
  buttonStyle, 
  buttonSize
}) => {

const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

return(
  <button className={`btn ${checkButtonStyle} ${checkButtonSize}`}
  onClick={onClick}
  type={type}
  >
    {children}

  </button>

);
};

// const Button = ({
//   children,
//   type,
//   href,
//   to,
//   onClick,
//   width,
//   size,
//   disabled,
//   style,
//   target,
//   rel,
// }) => {
//   const buttonStyles = classnames({
//     [styles.main]: true,
//     [styles.mainWidthFull]: width === "full",
//     [styles.mainWidthAuto]: width === "auto",
//   });
//   const childStyles = classnames({
//     [styles.children]: true,
//     [styles.childrenSizeRegular]: size === "regular",
//   });

//   let El;

//   if (href) {
//     El = "a";
//   } else if (to) {
//     El = Link;
//   } else {
//     El = "button";
//   }

//   return (
//     <El
//       className={buttonStyles}
//       type={type}
//       href={href}
//       to={to}
//       onClick={onClick}
//       disabled={disabled}
//       style={style}
//       target={target}
//       rel={rel}
//     >
//       <span className={childStyles}>{children}</span>
//     </El>
//   );
// };

// Button.defaultProps = {
//   width: "full",
//   size: "regular",
// };

// export default Button;


  //   const styles = classnames({
  //   [styles.main]: true,
  // });
  // const childStyles = classnames({
  //   [styles.children]: true,
  //   [styles.childrenSizeRegular]: size === "regular",
  // });
//   return (
//     <button onClick={onClick} type={type}>
//       {children}
//     </button>
//   )
// }