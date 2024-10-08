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
            flex: {
                '2': '2 2 0%',
                '3': '3 3 0%',
                '4': '4 4 0%',
                '5': '5 5 0%',
                '6': '6 6 0%',
                '7': '7 7 0%',
                '8': '8 8 0%',
            },
            // http://animista.net
            keyframes: {
                'slide-top': {
                    '0%': {
                        '-webkit-transform': 'translateY(0);',
                        transform: 'translateY(0);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateY(-10px);',
                        transform: 'translateY(-10px);',
                    },
                },
            },
            animation: {
                'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
            }
        },
        listStyleType: {
            none: 'none',
            disc: 'disc',
            decimal: 'decimal',
            square: 'square',
            roman: 'upper-roman',
        }
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: 'class',
        }),
    ],
}
