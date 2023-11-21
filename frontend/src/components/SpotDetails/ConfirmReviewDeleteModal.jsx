import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'

const ConfirmReviewDeleteModal = () => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const confirmDelete = async () => {
        // const res = await dispatch(removeReview(spotId))
        // const data = await res.json()
        // console.log(data)
        // if (res.ok) {
        //     await dispatch(removeUserSpot(spotId))
        //     closeModal()
        // }
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