import { csrfFetch } from "./csrf";

const LOAD_USER_SPOTS = 'spots/loadUserSpots'
const UNSET_USER_SPOTS = 'spots/unsetUserSpots'
const REMOVE_USER_SPOT = 'spots/removeUserSpot'


const loadUserSpots = (spots) => {
    return {
        type: LOAD_USER_SPOTS,
        spots
    }
}

export const unsetUserSpots = () => {
    return {
        type: UNSET_USER_SPOTS
    }
}

export const removeUserSpot = (spotId) => {
    return {
        type: REMOVE_USER_SPOT,
        spotId
    }
}

export const getUserSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots/current")
    if (res.ok) {
        const data = await res.json()
        dispatch(loadUserSpots(data))
        return data
    }
    const data = await res.json()
    return data
}


const initialState = {}

const userSpotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USER_SPOTS: {
            const newState = { Spots: {} }
            for (let spot of action.spots.Spots) {
                newState.Spots[spot.id] = spot
            }
            return newState
        }
        case UNSET_USER_SPOTS: {
            return { Spots: {} }
        }
        case REMOVE_USER_SPOT: {
            const newState = { ...state }
            delete newState.Spots[action.spotId]
            return newState
        }
        default:
            return state
    }
}

export default userSpotsReducer