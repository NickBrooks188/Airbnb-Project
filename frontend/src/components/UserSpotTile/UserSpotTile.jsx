import { Link } from 'react-router-dom'


const UserSpotTile = ({ spot }) => {
    return (
        <div className="spotTile">
            <div className='userTileContent'>

                <img src={`${spot.previewImage}`} alt={spot.name} />
                <p>{`${spot.city}, ${spot.state}`}</p>
                <span>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)}`}</span>
                <span>{`$${spot.price.toFixed(2)} night`}</span>
                <Link to={`/spots/${spot.id}/edit`}>
                    <button className='update'>Update</button>
                </Link>
                <button className='delete'>Delete</button>
            </div>
        </div>
    )
}

export default UserSpotTile