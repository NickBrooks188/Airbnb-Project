import { Link } from 'react-router-dom'
import './SpotTile.css'

const SpotTile = ({ spot }) => {
    return (
        <div className="spotTile">
            <Link to={`spots/${spot.id}`}>
                <div className='tileContent'>
                    <div className='spotTileImgWrapper'>
                        <img src={`${spot.previewImage}`} alt={spot.name} />
                    </div>
                    <div className='locationRatings'>
                        <p>{`${spot.city}, ${spot.state}`}</p>
                        <span>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)}`}</span>
                    </div>
                    <span><b>${spot.price.toFixed(2)}</b> night</span>
                    <div className='spotTileTooltip'>{spot.name}</div>
                </div>
            </Link>
        </div>
    )
}

export default SpotTile
