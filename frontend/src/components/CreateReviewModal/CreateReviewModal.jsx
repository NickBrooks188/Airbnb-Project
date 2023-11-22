import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addReviewToSingleSpot } from '../../store/selectedSpot'
import { addReviewToSpot } from '../../store/spots'
import { useModal } from '../../context/Modal'
import './CreateReviewModal.css'

const CreateReviewModal = ({ numReviews, spotId, sessionUser }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        const form = {
            review,
            stars: parseInt(stars)
        }
        const newReview = await dispatch(addReviewToSingleSpot(form, spotId, sessionUser))
        if (newReview.errors) {
            setErrors(newReview.errors)
            return
        }
        await dispatch(addReviewToSpot(newReview.stars, newReview.spotId, numReviews))
        closeModal()
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>How was your stay?</h1>
            <span>{errors.review}</span>
            <textarea className='reviewText' value={review} placeholder="Leave your review here..." onChange={(e) => setReview(e.target.value)}></textarea>
            <span>{errors.stars}</span>

            <div className='starWrapper'>

                <div className={`stars ${stars > 4 && 'selected'}`} onClick={() => setStars(5)}>★</div>
                <div className={`stars ${stars > 3 && 'selected'}`} onClick={() => setStars(4)}>★</div>
                <div className={`stars ${stars > 2 && 'selected'}`} onClick={() => setStars(3)}>★</div>
                <div className={`stars ${stars > 1 && 'selected'}`} onClick={() => setStars(2)}>★</div>
                <div className={`stars ${stars > 0 && 'selected'}`} onClick={() => setStars(1)}>★</div>

            </div>

            <button type='submit' className="submitReviewButton" disabled={review.length < 10}>Submit Your Review</button>
        </form>
    )
}

export default CreateReviewModal