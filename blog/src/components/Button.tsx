import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    className?: string;
    id?: string;
    style?: React.CSSProperties; // Added style property
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    style,
    className = '',
    id,
}) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors cursor-pointer';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    };

    return (
        <button
            id={id}
            style={style}
            className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;