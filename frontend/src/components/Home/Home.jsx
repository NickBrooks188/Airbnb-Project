import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllSpots } from '../../store/spots'
import SpotTile from '../SpotTile/SpotTile'


const Home = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots)

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    const spotsArr = Object.values(spots)

    if (!spotsArr.length) return null
    return (
        <>
            <h2>Home component</h2>
            {spotsArr.map((spot) => (<SpotTile spot={spot} key={spot.id} />)
            )}
        </>

    )
}

export default Home