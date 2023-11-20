import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createNewSpot, addImageToSpot } from '../../store/spots'
import { getSingleSpot } from '../../store/selectedSpot'
import './SpotForm.css'

const CreateSpotForm = ({ type }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { spotId } = useParams()

    if (type === 'edit') dispatch(getSingleSpot(spotId))


    let existingSpotData = useSelector(state => state.selectedSpot)
    if (type === 'create') {
        existingSpotData = {}
    } else if (spotId != existingSpotData.id) {
        console.log('Data mismatch!', spotId, existingSpotData.id)
    }
    const [country, setCountry] = useState(existingSpotData.country || '')
    const [address, setAddress] = useState(existingSpotData.address || '')
    const [city, setCity] = useState(existingSpotData.city || '')
    const [state, setState] = useState(existingSpotData.state || '')
    const [lat, setLat] = useState(existingSpotData.lat || '')
    const [lng, setLng] = useState(existingSpotData.lng || '')
    const [description, setDescription] = useState(existingSpotData.description || '')
    const [name, setName] = useState(existingSpotData.name || '')
    const [price, setPrice] = useState(existingSpotData.price || '')
    // TODO put existimg images into array
    const [images, setImages] = useState(['', '', '', '', ''])
    const [errors, setErrors] = useState({})


    const sessionUser = useSelector(state => state.session.user)

    const updateImages = (value, index) => {
        let imageArr = [...images]
        imageArr[index] = value
        setImages(imageArr)
    }

    useEffect(() => {
        if (!sessionUser) navigate('/')
    }, [navigate, sessionUser])

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        const form = {
            address,
            city,
            state,
            country,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name,
            description,
            price: parseFloat(price)
        }

        if (!images[0]) {
            setErrors({
                0: 'Preview image is required'
            })
            return
        }

        const handleSpotCreation = async (spot) => {
            const spotData = await dispatch(createNewSpot(spot))
            console.log(spotData)
            if (!spotData.errors) {
                for (let i = 0; i < images.length; i++) {
                    if (images[i]) {
                        const imageObj = {
                            url: images[i],
                            preview: (i === 0)
                        }
                        console.log(imageObj)
                        const imgRes = await dispatch(addImageToSpot(spotData.id, imageObj))
                        if (!imgRes.ok) {
                            const imgData = await imgRes.json()
                            const err = { ...errors }
                            err[i] = imgData
                            setErrors(err)
                        }
                    }
                }
                navigate(`/spots/${spotData.id}`)
            } else {
                setErrors(spotData.errors)
            }
        }
        handleSpotCreation(form)

    }

    let title
    if (type === 'create') {
        title = (<h1>Create a new Spot</h1>)
    }

    if (type === 'edit') {
        title = (<h1>Update your Spot</h1>)
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                {title}
                <h2>{`Where's your place located?`}</h2>
                <h3>Guests will only get your exact addess once they booked a reservation.</h3>
                <label>
                    Country
                    <span>{errors.country}</span>
                    <input type='text'
                        value={country}
                        className='wideInput'
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country' />
                </label>
                <label>
                    Street Address
                    <span>{errors.address}</span>
                    <input type='text'
                        value={address}
                        className='wideInput'
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Address' />
                </label>
                <label>
                    City
                    <span>{errors.city}</span>
                    <input type='text'
                        value={city}
                        className='city'
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='City' />
                </label>

                ,
                <label>
                    State
                    <span>{errors.state}</span>
                    <input type='text'
                        value={state}
                        className='state'
                        onChange={(e) => setState(e.target.value)}
                        placeholder='State' />
                </label>
                <label>
                    Latitude
                    <span>{errors.lat}</span>
                    <input type='text'
                        value={lat}
                        className='lat'
                        onChange={(e) => setLat(e.target.value)}
                        placeholder='Latitude' />
                </label>
                ,
                <label>
                    Longitude
                    <span>{errors.lng}</span>
                    <input type='text'
                        value={lng}
                        className='lng'
                        onChange={(e) => setLng(e.target.value)}
                        placeholder='Logitude' />
                </label>
                <h2>Describe your place to guests</h2>
                <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
                <label>
                    <textarea
                        value={description}
                        className='description'
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Please write at least 30 characters' />
                    <span>{errors.description}</span>
                </label>
                <h2>Create a title for your spot</h2>
                <h3>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</h3>
                <label>
                    <input type='text'
                        value={name}
                        className='wideInput'
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name of your spot' />
                    <span>{errors.name}</span>
                </label>
                <h2>Set a base price for your spot</h2>
                <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
                <label>
                    $
                    <input type='text'
                        value={price}
                        className='price'
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='Price per night (USD)' />
                    <span>{errors.price}</span>
                </label>
                <h2>Liven up your spot with photos</h2>
                <h3>Submit a link to at least one photo to publish your spot</h3>
                <input type='text'
                    value={images[0]}
                    className='wideInput'
                    onChange={(e) => updateImages(e.target.value, 0)}
                    placeholder='Preview Image URL' />
                <span>{errors[0]}</span>

                <input type='text'
                    value={images[1]}
                    className='wideInput'
                    onChange={(e) => updateImages(e.target.value, 1)}
                    placeholder='Image URL' />
                <span>{errors[1]}</span>

                <input type='text'
                    value={images[2]}
                    className='wideInput'
                    onChange={(e) => updateImages(e.target.value, 2)}
                    placeholder='Image URL' />
                <span>{errors[2]}</span>

                <input type='text'
                    value={images[3]}
                    className='wideInput'
                    onChange={(e) => updateImages(e.target.value, 3)}
                    placeholder='Image URL' />
                <span>{errors[3]}</span>

                <input type='text'
                    value={images[4]}
                    className='wideInput'
                    onChange={(e) => updateImages(e.target.value, 4)}
                    placeholder='Image URL' />
                <span>{errors[4]}</span>

                <input type='submit' value='Create Spot' />
            </form>

        </>
    )
}

export default CreateSpotForm


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