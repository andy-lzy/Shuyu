/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                accent: 'var(--color-accent)',
                muted: 'var(--color-text-muted)',
            },
            boxShadow: {
                'glow': 'var(--shadow-glow)',
            }
        },
    },
    plugins: [],
}
