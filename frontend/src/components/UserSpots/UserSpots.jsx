import { getUserSpots } from '../../store/userSpots'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import UserSpotTile from '../UserSpotTile/UserSpotTile'

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
            <h2>Users spots</h2>
            {userSpots.Spots.map((spot) => (<UserSpotTile spot={spot} key={spot.id} />))}
        </>
    )
}

export default UsersSpots