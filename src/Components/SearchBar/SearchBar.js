import React from 'react'
import './SearchBar.css'
class SearchBar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            term: ''
        }
        this.search = this.search.bind(this)
        this.handleTermChange = this.handleTermChange.bind(this)
    }
    search(e){
        // e.preventDefault()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.onSearch(this.state.term,e)
    }
    handleTermChange(e){
        this.setState({
            term: e.target.value
        })
    }
    render(){
        return (
            <div className="SearchBar">
                <form onSubmit={this.search}>
                    <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist"/>
                    <button type='submit' className="SearchButton">SEARCH</button>
                </form> 
            </div>
        )
    }
}

export default SearchBar