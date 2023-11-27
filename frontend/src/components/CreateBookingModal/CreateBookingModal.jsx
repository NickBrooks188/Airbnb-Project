import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { useState } from 'react'
import './CreateBookingModal.css'
import { createBookingForSpot } from '../../store/selectedSpot'

const CreateBookingModal = ({ spotId }) => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [errors, setErrors] = useState({})

    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const createBooking = async () => {
        const booking = {
            startDate,
            endDate
        }
        const data = await dispatch(createBookingForSpot(spotId, booking))
        if (data.errors) {
            setErrors(data.errors)
        } else {
            closeModal()
        }
    }

    return (
        <>
            <h1>Create Booking</h1>
            <label className='dateLabel'>
                Start Date
                <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                <span className='error'>{errors.startDate}</span>
            </label>
            <label className='dateLabel'>
                End Date
                <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                <span className='error'>{errors.endDate}</span>
            </label>
            <button className='createBookingButton' onClick={createBooking}>Create Booking</button>
        </>
    )
}

export default CreateBookingModal