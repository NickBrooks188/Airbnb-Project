import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { removeReviewFromSingleSpot } from '../../store/selectedSpot'
import { removeReviewFromSpot } from '../../store/spots'

const ConfirmReviewDeleteModal = ({ numReviews, avgRating, review, spot }) => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()


    console.log('~~~~~~~~', spot)
    const confirmDelete = async () => {
        const reviewStars = review.stars
        let newAvg = (numReviews == 1 ? "Not available" : (avgRating * numReviews - reviewStars) / (numReviews - 1))
        const reviewIndex = spot.Reviews.indexOf(review)
        const res = await dispatch(removeReviewFromSingleSpot(review.id, reviewIndex, newAvg))
        if (res.ok) {
            dispatch(removeReviewFromSpot(spot.id, newAvg))
            console.log(`------`, spot)
            closeModal()
        } else {
            const data = await res.json()
            console.log(data)
        }
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to remove this review?</h3>
            <button className='yesDelete' onClick={confirmDelete}>Yes (Delete Review)</button>
            <button className='noDelete' onClick={closeModal}>No (Keep Review)</button>
        </>
    )
}

export default ConfirmReviewDeleteModal