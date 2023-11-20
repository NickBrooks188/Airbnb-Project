import { csrfFetch } from "./csrf";

const LOAD_SPOT = 'spots/loadSpot'
const UNSET_SPOT = 'spots/unsetSpot'

const loadSpot = (spot) => {
    return {
        type: LOAD_SPOT,
        spot
    }
}

export const unsetSpot = () => {
    return {
        type: UNSET_SPOT
    }
}

export const getSingleSpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`)
    if (res.ok) {
        const data = await res.json()
        dispatch(loadSpot(data))
    }
    return res
}

export const getSingleSpotReviews = (id) => async () => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`)
    return res
}

const initialState = {}

const selectedSpotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT: {
            return action.spot
        }
        case UNSET_SPOT: {
            return {}
        }
        default:
            return state
    }
}

export default selectedSpotReducer