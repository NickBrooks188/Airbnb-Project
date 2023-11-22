import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllSpots } from '../../store/spots'
import SpotTile from '../SpotTile/SpotTile'
import './Home.css'


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
            <h2>Spots</h2>
            <div className='spotTileWrapper'>
                {spotsArr.map((spot) => (<SpotTile spot={spot} key={spot.id} />)
                )}

            </div>
        </>

    )
}

export default Home