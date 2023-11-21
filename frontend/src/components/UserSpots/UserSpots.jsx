import { getUserSpots } from '../../store/userSpots'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import UserSpotTile from '../UserSpotTile/UserSpotTile'
import { Link } from 'react-router-dom'
import './UserSpots.css'

const UsersSpots = () => {
    const dispatch = useDispatch()
    const userSpots = useSelector(state => state.userSpots)

    console.log(userSpots)
    useEffect(() => {
        const loadUserSpots = async () => {
            await dispatch(getUserSpots())
        }
        loadUserSpots()
    }, [dispatch])

    console.log(userSpots.Spots)
    if (!userSpots.Spots) return (<h2>Users Spots</h2>)

    return (
        <>
            <h2>Manage your spots</h2>
            <Link to='/spots/new'>
                <button className="createNewSpot">Create a New Spot</button>
            </Link>
            <div className='userSpotTileWrapper'>
                {Object.values(userSpots.Spots).map((spot) => (<UserSpotTile spot={spot} key={spot.id} />))}
            </div>
        </>
    )
}

export default UsersSpots