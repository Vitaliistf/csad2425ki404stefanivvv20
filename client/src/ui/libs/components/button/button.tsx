import React from "react";
import styles from "./styles.module.css";

/**
 * @interface ButtonProps
 * @brief Button properties that extend the default HTML button attributes.
 *
 * @property variant Specifies the style variant of the button.
 *                   It can be "primary", "secondary", or "danger".
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

/**
 * @class Button
 * @brief A factory pattern implementation to create a customizable Button component.
 *
 * @param children The content to display within the button.
 * @param variant The button's style variant, defaulting to "primary".
 * @param className Additional custom class names for styling.
 * @param props Additional properties passed to the HTML button element.
 *
 * @return A styled button component based on the specified variant.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  /**
   * @brief Determines the CSS class for the button variant.
   *
   * @return A string representing the CSS class for the chosen variant.
   */
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return styles.secondary;
      case "danger":
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  return (
    <button
      className={`${styles.button} ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
