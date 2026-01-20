export const colors = {
    primary: '#D4AF37', // Gold
    secondary: '#1A1A1A', // Almost Black
    background: '#121212', // Dark background
    card: '#1E1E1E', // Slightly lighter for cards
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    accent: '#C0C0C0', // Silver
    error: '#CF6679',
    success: '#03DAC6',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

export const theme = {
    colors,
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: 'bold' as const, color: colors.primary },
        h2: { fontSize: 24, fontWeight: 'bold' as const, color: colors.text },
        h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
        body: { fontSize: 16, color: colors.textSecondary },
        caption: { fontSize: 14, color: colors.textSecondary },
        button: { fontSize: 16, fontWeight: 'bold' as const, color: colors.secondary },
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 24,
    },
};
