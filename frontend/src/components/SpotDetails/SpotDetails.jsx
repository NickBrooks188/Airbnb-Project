import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleSpot, getSingleSpotReviews } from '../../store/selectedSpot'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import CreateReviewModal from '../CreateReviewModal/CreateReviewModel'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector((state) => state.selectedSpot)
    const [reviews, setReviews] = useState([])

    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
        const getReviews = async () => {
            const rev = await (dispatch(getSingleSpotReviews(spotId)))
            const parsedReviews = await rev.json()
            setReviews(parsedReviews.Reviews)
        }
        getReviews()
    }, [dispatch, setReviews, spotId])
    if (!spot.id) return null
    if (spot.id != spotId) return null

    const previewImage = spot.SpotImages.find((img) => (img.preview == true))

    let createReviewButton
    if (sessionUser) {
        if (!reviews.find(review => review.userId == sessionUser.id) && spot.ownerId != sessionUser.id) {
            createReviewButton = (<OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<CreateReviewModal />}
            />)
        }
    }

    let noReviewsNotice
    if (!reviews.length) noReviewsNotice = (<p>Be the first to post a review!</p>)
    return (
        <div className='spotWrapper'>
            <div className='spotHeader'>
                <h2>{spot.name}</h2>
                <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            </div>
            <div className='imagesWrapper'>
                <div className='previewImgWrapper'>
                    <img src={previewImage?.url}></img>
                </div>
                <div className='otherImagesWrapper'>
                    {spot.SpotImages.map((img) => {
                        if (img.preview == false)
                            return (<div className='imgWrapper' key={img.id}>
                                <img src={img.url} />
                            </div>)

                    }
                    )}

                </div>
            </div>
            <div className='details'>
                <div className='description'>
                    <h2>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='booking'>
                    <h2>{`$${spot.price.toFixed(2)} night`}</h2>
                    <span>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)} · ${spot.numReviews} review${reviews.length !== 1 ? 's' : ''}`}</span>
                </div>
            </div>
            <div className='reviewsWrapper'>
                <h1>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)} · ${spot.numReviews} review${reviews.length !== 1 ? 's' : ''}`}</h1>
                {sessionUser && createReviewButton}
                {noReviewsNotice}
                {reviews.map((review) => {
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    const date = new Date(review.createdAt)
                    return (
                        <div className='reviewWrapper' key={review.id}>
                            <h4>{review.User.firstName}</h4>
                            <h5>{`${months[date.getMonth()]} ${date.getFullYear()}`}</h5>
                            <p>{review.review}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SpotDetails

// {
//     "id": 1,
//     "ownerId": 1,
//     "address": "123 Disney Lane",
//     "city": "San Francisco",
//     "state": "California",
//     "country": "United States of America",
//     "lat": 37.7645358,
//     "lng": -122.4730327,
//     "name": "App Academy",
//     "description": "Place where web developers are created",
//     "price": 123,
//     "createdAt": "2021-11-19 20:39:36",
//     "updatedAt": "2021-11-19 20:39:36",
//     "numReviews": 5,
//     "avgRating": 4.5,
//     "SpotImages": [
//         {
//             "id": 1,
//             "url": "image url",
//             "preview": true
//         },
//         {
//             "id": 2,
//             "url": "image url",
//             "preview": false
//         }
//     ],
//     "Owner": {
//         "id": 1,
//         "firstName": "John",
//         "lastName": "Smith"
//     }
// }