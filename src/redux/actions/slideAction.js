export const getSlide = (data) => {
    console.log("Action Slides", data)
    return {
        type: "GET_SLIDE",
        payload: data
    }
}