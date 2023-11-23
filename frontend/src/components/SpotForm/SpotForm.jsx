import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createNewSpot, editSpot } from '../../store/spots'
import { getSingleSpot, unsetSpot } from '../../store/selectedSpot'
import './SpotForm.css'

const CreateSpotForm = ({ type }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { spotId } = useParams()

    useEffect(() => {
        const runDispatches = async () => {
            if (type === 'update') await dispatch(getSingleSpot(spotId))
            else await dispatch(unsetSpot())
        }
        runDispatches()
    }, [dispatch, spotId, type])

    let existingSpotData = useSelector(state => state.selectedSpot)

    const [country, setCountry] = useState(existingSpotData.country || '')
    const [address, setAddress] = useState(existingSpotData.address || '')
    const [city, setCity] = useState(existingSpotData.city || '')
    const [state, setState] = useState(existingSpotData.state || '')
    const [lat, setLat] = useState(existingSpotData.lat || '')
    const [lng, setLng] = useState(existingSpotData.lng || '')
    const [description, setDescription] = useState(existingSpotData.description || '')
    const [name, setName] = useState(existingSpotData.name || '')
    const [price, setPrice] = useState(existingSpotData.price || '')
    const [images, setImages] = useState(['', '', '', '', ''])
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setCountry(existingSpotData.country || '')
        setAddress(existingSpotData.address || '')
        setCity(existingSpotData.city || '')
        setState(existingSpotData.state || '')
        setLat(existingSpotData.lat || '')
        setLng(existingSpotData.lng || '')
        setDescription(existingSpotData.description || '')
        setName(existingSpotData.name || '')
        setPrice(existingSpotData.price || '')
        if (existingSpotData.SpotImages) {
            console.log(existingSpotData.SpotImages)
            let imagesArr = []
            const previewImage = existingSpotData.SpotImages.find(image => image.preview == true)
            if (previewImage) imagesArr.push(previewImage.url)
            existingSpotData.SpotImages.forEach(image => {
                if (image.preview == false)
                    imagesArr.push(image.url)
            })
            while (imagesArr.length < 5) {
                imagesArr.push('')
            }
            setImages(imagesArr)

        } else setImages(['', '', '', '', ''])
    }, [existingSpotData])

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

        if (!images[0] && type === 'create') {
            setErrors({
                0: 'Preview image is required'
            })
            return
        }

        const handleSpotCreation = async (spot) => {
            const spotData = await dispatch(createNewSpot(spot, images))
            if (!spotData.errors) {
                navigate(`/spots/${spotData.id}`)
            } else {
                setErrors(spotData.errors)
            }
        }

        const handleSpotEdit = async (spot) => {
            const spotData = await dispatch(editSpot(spot, spotId))
            if (!spotData.errors) {
                navigate(`/spots/${spotData.id}`)
            } else {
                setErrors(spotData.errors)
            }
        }
        if (type === 'create') handleSpotCreation(form)
        if (type === 'update') {
            handleSpotEdit(form)
        }
    }

    let title
    if (type === 'create') {
        title = (<h1>Create a new Spot</h1>)
    }

    if (type === 'update') {
        title = (<h1>Update your Spot</h1>)
    }
    return (
        <>
            <form onSubmit={onSubmit} className='spotForm'>
                {title}
                <h2>{`Where's your place located?`}</h2>
                <h3>Guests will only get your exact addess once they booked a reservation.</h3>
                <div className='wideInput'>
                    Country
                    <span>{errors.country}</span>
                    <input type='text'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country' />
                </div>
                <div className='wideInput'>
                    Street Address
                    <span>{errors.address}</span>
                    <input type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Address' />
                </div>
                <div className='city'>
                    City
                    <span>{errors.city}</span>
                    <input type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='City' />
                </div>
                <div className='state'
                >
                    State
                    <span>{errors.state}</span>
                    <input type='text'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder='State' />
                </div>
                <div className='lat'>
                    Latitude
                    <span>{errors.lat}</span>
                    <input type='text'
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder='Latitude' />
                </div>
                <div className='lng'>
                    Longitude
                    <span>{errors.lng}</span>
                    <input type='text'
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder='Logitude' />
                </div>
                <div className='divider' />
                <h2>Describe your place to guests</h2>
                <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
                <span>{errors.description}</span>
                <div className='wideInput'>
                    <textarea
                        value={description}
                        className='description'
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Please write at least 30 characters' />
                </div>
                <div className='divider' />
                <h2>Create a title for your spot</h2>
                <h3>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</h3>
                <span>{errors.name}</span>
                <div className='wideInput'>
                    <input type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name of your spot' />
                </div>
                <div className='divider' />
                <h2>Set a base price for your spot</h2>
                <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
                <span>{errors.price}<br /></span>
                <div className='price'>
                    $
                    <input type='text'
                        className='priceInput'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='Price per night (USD)' />
                </div>
                <div className='divider' />
                <div className={`photos ${type === 'create' ? '' : 'hidden'}`}>

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

                    <div className='divider' />
                </div>

                <input type='submit' className='submitSpot' value={`${type[0].toUpperCase() + type.slice(1)} Spot`} />
            </form>

        </>
    )
}

export default CreateSpotForm