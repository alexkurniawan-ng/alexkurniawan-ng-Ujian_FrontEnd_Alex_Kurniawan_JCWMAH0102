// fungsi yang mengarahkan data dari component ke reducer
export const getProducts = (data) => {
    console.log("Action products", data)
    return {
        type: "GET_PRODUCTS",
        payload: data
    }
}

