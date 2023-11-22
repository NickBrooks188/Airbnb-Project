import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { removeSpot } from '../../store/spots'
import { removeUserSpot } from '../../store/userSpots.js'

const ConfirmSpotDeleteModal = ({ spotId }) => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const confirmDelete = async () => {
        const res = await dispatch(removeSpot(spotId))
        const data = await res.json()
        console.log(data)
        if (res.ok) {
            await dispatch(removeUserSpot(spotId))
            closeModal()
        }
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to remove this spot from the listings?</h3>
            <button className='yesDelete' onClick={confirmDelete}>Yes (Delete Spot)</button>
            <button className='noDelete' onClick={closeModal}>No (Keep Spot)</button>
        </>
    )
}

export default ConfirmSpotDeleteModal