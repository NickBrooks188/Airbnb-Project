import { useState } from 'react'
import './CreateReviewModal.css'

const CreateReviewModal = () => {
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)

    const onSubmit = async (e) => {
        e.preventDefault()
        const form = {
            review,
            stars: parseInt(stars)
        }
        const res = await sendReview()
    }
    return (
        <form >
            <h1>How was your stay?</h1>
            <span>errors span</span>
            <textarea className='reviewText' value={review} onChange={(e) => setReview(e.target.value)}></textarea>
            <div className='starWrapper'>

                <div className={`stars ${stars > 4 && 'selected'}`} onClick={() => setStars(5)}>★</div>
                <div className={`stars ${stars > 3 && 'selected'}`} onClick={() => setStars(4)}>★</div>
                <div className={`stars ${stars > 2 && 'selected'}`} onClick={() => setStars(3)}>★</div>
                <div className={`stars ${stars > 1 && 'selected'}`} onClick={() => setStars(2)}>★</div>
                <div className={`stars ${stars > 0 && 'selected'}`} onClick={() => setStars(1)}>★</div>

            </div>

            <input type='submit' value='Submit Your Review' />
        </form>
    )
}

export default CreateReviewModal