'use strict';

const React = require('react');
const Ons = require('react-onsenui');
const geolib = require('geolib');

// Custom imports
const config = require('../data_components/config.json');

/**
 * Component for displaying the list view.
 */
class List extends React.Component {

    constructor(props) {
        super(props);
        this.handleListItemClick = this.handleListItemClick.bind(this);
        this.state = {
            error: null,
            isLoaded: false,
            users: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:3001/api/getUsers")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        users: result.users
                    });
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
      }

    /**
     * Handle clicks on users in the list
     * @param {Integer} integer index of the list item
     */
    handleListItemClick(e) {
        var listItemId = parseInt(e.target.parentElement.id);
        console.log("Clicking on freecycler " + listItemId)
        this.props.onListItemClick(listItemId);
    }

    // Render the list
    renderUserList() {
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
            // var freecyclers = this.props.getUsers();
            var freecyclers = this.state.users;
            var listItems = [];

            for (let i in freecyclers) {
                var freecycler = freecyclers[i];
                var clickable = !!(freecycler.shareLocation || this.props.userPosition);

                listItems.push(
                    <Ons.ListItem
                        id={freecycler.id}
                        tappable={clickable}
                        onClick={clickable ? this.handleListItemClick : null}
                        key={'freecycler' + freecycler.id}>
                            <div className='left'>
                                <Ons.Icon icon='md-face'/>
                            </div>
                            <div className='center'>
                                {freecycler.name} - {freecycler.offerDescription} - {freecycler.contactInformation}
                            </div>
                            <div className='right'>
                                {this.props.userPosition ? `${freecycler.distanceToUser} m` : null}
                                {clickable ? null : "Location is private"}
                            </div>
                    </Ons.ListItem>
                )
            }

            return (
                <Ons.List>
                    {listItems}
                </Ons.List>
            )
        }
    }

    render() {
        return (
            <div className="center" style={{height: '100%'}}>
                {this.renderUserList()}
            </div>
        )
    }
}

module.exports = {
    List: List
}
