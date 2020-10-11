const INITIAL_STATE = {
    id: null, 
    username: '',
    email: '',
    phone: '',
    role: '',
    cart: []
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                // concat dengan state (objek pertama), jika ada nama yg sama, maka objek pertama akan digantikan dengan id yg baru (item dibawah ini)
                ...state,
                //dipecah karena tidak butuh password, menggantikan nama dari "...state" yang sama
                id: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                phone: action.payload.phone,
                cart: action.payload.cart,
                role: action.payload.role
            }
        case "LOGOUT": 
            return INITIAL_STATE
        default:
            return state;
    }
}