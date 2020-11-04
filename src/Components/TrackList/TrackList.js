import React from 'react'
import Track from '../Track/Track.js'
import './TrackList.css'

class TrackList extends React.Component {
    render(){
        return (
            <div className="TrackList">
            {this.props.tracks ? this.props.tracks.map(track=>{
                return <Track onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} key={track.id} track={track}/>
            }) : <h1>empty playlist</h1>
        }
        </div>
        )
    }
}

export default TrackList