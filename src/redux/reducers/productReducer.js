// INITIAL_STATE dibuat jika ada lebih dari 1 golongan data/property yg perlu diisi - disimpan ke dalam reducer
// const INITIAL_STATE = {
//     productList: [],
//     product_form: {
//         name:
//     }
// }


export const productReducers = (state = [], action) => {
    switch(action.type) {
        case "GET_PRODUCTS":
            console.log("Reducer products", action.payload)
            return action.payload
        default:
            return state
    }
}