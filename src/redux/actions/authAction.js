import Axios from "axios"
import { API_URL } from "../../support/url"

// fungsi yang mengarahkan data dari component ke reducer
export const login = (data) => {
    return {
        type: "LOGIN",
        payload: data
    }
}

export const logout = () => {
    return {
        type: "LOGOUT"
    }
}

// Versi Redux-Thunk
export const Login = (query, username, password) => {
    // dispatch sudah baku, harus pakai ini
    return (dispatch) => {
        Axios.get(API_URL + `/users?${query}=${username}&password=${password}`)
        .then((res) => {
            console.log("LOGIN Success", res.data)
            localStorage.setItem("id", res.data[0].id)
            dispatch({
                type: "LOGIN",
                payload: res.data[0]
            })
        })
        .catch((err) => {
            console.log("LOGIN error", err)
        })
    }
}

// export const KeepLogin = () => {
//     return (dispatch) => {
//         let id = localStorage.getItem("id")
//         if (id) {
//             Axios.get(API_URL + `/users?id=${id}`)
//             .then((res) => {
//             console.log("SUCCESS KeepLogin: ", res.data)
//             dispatch({
//                 type: "LOGIN",
//                 payload: res.data[0]
//                 })          
//             })
//             .catch((err) => {
//             console.log("ERR keepLogin: ", err)
//           })
//         }
//     }
//   }

  export const KeepLogin = () => {
      return async(dispatch) => {
          try {
              let get = await Axios.get(API_URL + `/users/${localStorage.getItem("id")}`)
              dispatch({
                  type: "LOGIN",
                  payload: get.data
              })
          } catch (error) {
              console.log("KeepLogin Error: ", error)
          }
      }
  }