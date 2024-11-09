import React from "react";
import styles from "./styles.module.css";

// Паттерн Composite для створення складених компонентів
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

export const CardHeader: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`${styles.cardHeader} ${className}`}>{children}</div>;

export const CardTitle: React.FC<CardProps> = ({
  children,
  className = "",
}) => <h2 className={`${styles.cardTitle} ${className}`}>{children}</h2>;

export const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`${styles.cardContent} ${className}`}>{children}</div>;
