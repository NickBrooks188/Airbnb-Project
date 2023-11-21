import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/loadSpots'
const UPDATE_SPOT = 'spots/updateSpot'
const DELETE_SPOT = 'spots/deleteSpot'
const CREATE_SPOT = 'spots/createSpot'
const ADD_REVIEW_TO_SPOT = 'spots/addReviewToSpot'
const REMOVE_REVIEW_FROM_SPOT = 'spots.removeReviewFromSpot'

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

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

export const addReviewToSpot = (stars, spotId, numReviews) => {
    return {
        type: ADD_REVIEW_TO_SPOT,
        stars,
        spotId,
        numReviews
    }
}

export const removeReviewFromSpot = (spotId, avgStars) => {
    return {
        type: REMOVE_REVIEW_FROM_SPOT,
        spotId,
        avgStars
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

export const editSpot = (spot, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(spot)
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(updateSpot(data))
    }
    return data
}

export const removeSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteSpot(spotId))
    }
    return res
}

export const createNewSpot = (spot, images) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify(spot)
    })
    const data = await res.json()
    if (res.ok) {
        for (let i = 0; i < images.length; i++) {
            const imgObj = { url: images[i], preview: (i === 0) }
            const imageRes = await csrfFetch(`/api/spots/${data.id}/images`, {
                method: "POST",
                body: JSON.stringify(imgObj)
            })
            if (imageRes.ok && i === 0) {
                const imageData = await imageRes.json()
                data.previewImage = imageData.url
            }
        }
        dispatch(createSpot(data))
    }
    return data
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
            delete newState[action.spotId]
            return newState
        }
        case CREATE_SPOT: {
            const newState = { ...state }
            newState[action.spot.id] = action.spot
            newState[action.spot.id].avgRating = "Not available"
            return newState
        }
        case ADD_REVIEW_TO_SPOT: {
            const newState = { ...state }
            if (newState[action.spotId]) {
                let avgRating = newState[action.spotId].avgRating
                if (avgRating == 'Not available') avgRating = 0
                newState[action.spotId].avgRating = (avgRating * action.numReviews + action.stars) / (action.numReviews + 1)
            }
            return newState
        }
        case REMOVE_REVIEW_FROM_SPOT: {
            const newState = { ...state }
            if (newState[action.spotId]) newState[action.spotId].avgRating = action.avgRating
            return newState
        }
        default:
            return state
    }
}

export default spotsReducer