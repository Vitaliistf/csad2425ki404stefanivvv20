import React from "react";
import styles from "./styles.module.css";

/**
 * @interface CardProps
 * Props for the Card component family.
 * @property children - Content to be rendered inside the card.
 * @property className - Optional CSS classes for additional styling.
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @component Card
 * A reusable Card component for layout and styling.
 * @param {CardProps} props - Props for the Card.
 * @returns {React.FC<CardProps>} The Card component.
 */
export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

/**
 * @component CardHeader
 * A header component for the Card.
 * @param {CardProps} props - Props for the CardHeader.
 * @returns {React.FC<CardProps>} The CardHeader component.
 */
export const CardHeader: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`${styles.cardHeader} ${className}`}>{children}</div>;

/**
 * @component CardTitle
 * A title component for the Card.
 * @param {CardProps} props - Props for the CardTitle.
 * @returns {React.FC<CardProps>} The CardTitle component.
 */
export const CardTitle: React.FC<CardProps> = ({
  children,
  className = "",
}) => <h2 className={`${styles.cardTitle} ${className}`}>{children}</h2>;

/**
 * @component CardContent
 * A content wrapper for the Card.
 * @param {CardProps} props - Props for the CardContent.
 * @returns {React.FC<CardProps>} The CardContent component.
 */
export const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`${styles.cardContent} ${className}`}>{children}</div>;
