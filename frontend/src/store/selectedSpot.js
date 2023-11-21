import { csrfFetch } from "./csrf";

const LOAD_SPOT = 'spots/loadSpot'
const UNSET_SPOT = 'spots/unsetSpot'
const ADD_REVIEW = 'spots/addReview'
const DELETE_REVIEW = 'spot/deleteReview'

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

const addReview = (review, user) => {
    return {
        type: ADD_REVIEW,
        review,
        user
    }
}

const deleteReview = (reviewIndex, avgRating) => {
    return {
        type: DELETE_REVIEW,
        reviewIndex,
        avgRating
    }
}

export const getSingleSpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`)
    if (res.ok) {
        const data = await res.json()
        const reviewRes = await csrfFetch(`/api/spots/${id}/reviews`)
        if (reviewRes.ok) {
            const reviewData = await reviewRes.json()
            data.Reviews = reviewData.Reviews
            dispatch(loadSpot(data))
        }
    }
    return res
}

export const addReviewToSingleSpot = (review, spotId, userId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review)
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addReview(data, userId))
    }
    return data
}

export const removeReviewFromSingleSpot = (reviewId, reviewIndex, avgRating) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteReview(reviewIndex, avgRating))
    }
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
        case ADD_REVIEW: {
            const newState = { ...state }
            const numReviews = newState.numReviews
            let avgRating = newState.avgRating
            if (avgRating == 'Not available') avgRating = 0
            console.log('numReviews', numReviews)
            console.log('avgRating', avgRating)
            newState.avgRating = (avgRating * numReviews + action.review.stars) / (numReviews + 1)
            newState.numReviews++
            const newReviewWithUser = { ...action.review, User: { id: action.user.id, firstName: action.user.firstName } }
            newState.Reviews.push(newReviewWithUser)
            return newState
        }
        case DELETE_REVIEW: {
            const newState = { ...state }
            const reviews = newState.Reviews
            reviews.splice(action.reviewIndex)
            newState.numReviews--
            newState.avgRating = action.avgRating
            newState.Reviews = reviews
            return newState
        }
        default:
            return state
    }
}

export default selectedSpotReducer