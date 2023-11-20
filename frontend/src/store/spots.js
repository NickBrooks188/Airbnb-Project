import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/loadSpots'
const UPDATE_SPOT = 'spots/updateSpot'
const DELETE_SPOT = 'spots/deleteSpot'
const CREATE_SPOT = 'spots/createSpot'

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        spot
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    if (res.ok) {
        const data = await res.json()
        dispatch(loadSpots(data.Spots))
    }
    return res
}

export const editSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        body: JSON.stringify(spot)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(updateSpot(data))
    }
    return res
}

export const removeSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteSpot(spot))
    }
    return res
}

export const createNewSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify(spot)
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createSpot(data))
    }
    return data
}

export const addImageToSpot = (spotId, image) => async () => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify(image)
    })
    return res
}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = { ...state }
            for (let spot of action.spots) {
                newState[spot.id] = spot
            }
            return newState
        }
        case UPDATE_SPOT: {
            const newState = { ...state }
            newState[action.spot.id] = action.spot
            return newState
        }
        case DELETE_SPOT: {
            const newState = { ...state }
            delete newState[action.spot.id]
            return newState
        }
        case CREATE_SPOT: {
            const newState = { ...state }
            newState[action.spot.id] = action.spot
            newState[action.spot.id].avgRating = "Not available"
            return newState
        }
        default:
            return state
    }
}

export default spotsReducer