/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        fontFamily: {
            main: ["Poppins", "sans-serif"]
        },
        extend: {
            width: {
                main: '1220px',
            },
            backgroundColor: {
                main: '#ee3131'
            },
            textColor: {
                main: '#ee3131',
                black: '#000000',
            },
            fontSize: {
                '30px': '30px',
            },
            borderColor: {
                main: '#ee3131',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}
