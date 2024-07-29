import icons from "./icons";


export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-");
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString();

export const renderStar = (number, size = 16) => {
    const { FaStar, FaRegStar} = icons;
    const maxStar = 5;
    const emptyStar = maxStar - number;

    const starsArray = [];

    for (let i = 0; i < number; i++) {
        starsArray.push(<FaStar key={i} color="orange" size={size} />);
    }

    for (let i = 0; i < emptyStar; i++) {
        starsArray.push(<FaRegStar key={number + i} color="orange" size={size} />);
    }

    return starsArray;
};

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    const newInvalidFields = []; // Create a temporary array for invalid fields

    formatPayload.forEach(arr => {
        if (arr[1]?.trim() === '') {
            invalids++;
            newInvalidFields.push({ name: arr[0], message: 'Require this field.' });
        }
    });

    formatPayload.forEach(arr => {
        switch (arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!arr[1].match(regex)) {
                    invalids++;
                    newInvalidFields.push({ name: arr[0], message: 'Email invalid.' });
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++;
                    newInvalidFields.push({ name: arr[0], message: 'Password need at least 6 characters.' });
                }
                break;
            default:
                break;
        }
    })

    setInvalidFields(newInvalidFields); // Set the new invalid fields once validation is done
    return invalids;
}

export const deepParseJSON = (data) => {
    if (typeof data === 'string') {
        try {
            return deepParseJSON(JSON.parse(data));
        } catch (e) {
            return data; // Nếu không parse được thì trả về chính string đó
        }
    } else if (Array.isArray(data)) {
        return data.map(item => deepParseJSON(item));
    } else if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = deepParseJSON(data[key]);
            return acc;
        }, {});
    } else {
        return data;
    }
}
