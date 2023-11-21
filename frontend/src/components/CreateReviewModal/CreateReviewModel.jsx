import { useState } from 'react'

const CreateReviewModal = () => {
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    return (
        <form>
            <h1>How was your stay?</h1>
            <span>errors span</span>
            <textarea className='reviewText' value={review} onChange={(e) => setReview(e.target.value)}></textarea>
            <fieldset>
                <input type="radio" id="5stars" name="rating" value='5' />
                <input type="radio" id="4stars" name="rating" value='4' />
                <input type="radio" id="3stars" name="rating" value='3' />
                <input type="radio" id="2stars" name="rating" value='2' />
                <input type="radio" id="1stars" name="rating" value='1' />

            </fieldset>

            <input type='submit' value='Submit Your Review' />
        </form>
    )
}

export default CreateReviewModal