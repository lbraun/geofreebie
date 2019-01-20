'use strict';

const React = require('react');
const Ons = require('react-onsenui');

/**
 * Offer form where the user can list items they are giving away.
 */
class offerForm extends React.Component {
    constructor(props) {
        super(props);
        this.goToSettingsTab = this.goToSettingsTab.bind(this);
        this.handleDeletePictureClick = this.handleDeletePictureClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewPictureClick = this.handleNewPictureClick.bind(this);

        this.state = {
            imageData: this.props.currentUser.offerPicture,
        };
    }

    /**
     * Localize a string in the context of the offer form
     * @param {string} string to be localized
     */
    l(string) {
        return this.props.l(`offerForm.${string}`);
    }

    /**
     * Call app method that navigates to the settings tab
     * @param {Event} e the react event object
     */
    goToSettingsTab(e) {
        this.props.handleTabChange("settings");
    }

    /**
     * Handle the change of a user property
     * @param {Event} e the react event object
     */
    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.type === 'checkbox' ? target.checkbox.name : target.name;

        var attributes = {[name]: value};
        this.props.pushUserUpdates(attributes);
    }

    /**
     * Handle a click on the add/edit picture button
     * @param {Event} e the react event object
     */
    handleNewPictureClick(e) {
        var formInstance = this;

        navigator.camera.getPicture(function onSuccess(imageData) {
            formInstance.props.pushUserUpdates({offerPicture: imageData});
        }, function onFail(message) {
            console.log('Error getting picture: ' + message);
        }, {
            quality: 50,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }

    /**
     * Handle a click on the delete picture link
     * @param {Event} e the react event object
     */
    handleDeletePictureClick(e) {
        this.props.pushUserUpdates({offerPicture: null});
    }

    renderGeofenceWarningListItem() {
        if (this.props.outOfGeofence) {
            return (
                <Ons.ListItem>
                    <div className="list-item__subtitle">
                        {this.l("geofenceWarning")}
                    </div>
                </Ons.ListItem>
            );
        } else {
            return null;
        }
    }

    renderImageArea() {
        if (this.props.currentUser.offerPicture) {
            return (
                <div>
                    <Ons.Row>
                        <Ons.Col width="50%" style={{padding: "20px"}}>
                            <b>{this.l("offerPicture")}</b>
                        </Ons.Col>

                        <Ons.Col width="50%" style={{textAlign: "right", padding: "20px"}}>
                            <Ons.Button onClick={this.handleNewPictureClick}>
                                    <Ons.Icon icon={"md-edit"} />
                            </Ons.Button>

                            <Ons.Button
                                onClick={this.handleDeletePictureClick}
                                style={{marginLeft: "20px", backgroundColor: "#d9534f"}}>
                                    <Ons.Icon icon={"md-delete"} />
                            </Ons.Button>
                        </Ons.Col>
                    </Ons.Row>

                    <img src={`data:image/jpeg;base64, ${this.props.currentUser.offerPicture}`}
                        id='offer-picture'
                        style={{width: "100%"}} />
                </div>
            );
        } else {
            return (
                <div style={{textAlign: "center"}}>
                    <Ons.Button
                        onClick={this.handleNewPictureClick}
                        style={{margin: "30px"}}>
                            <Ons.Icon icon={"md-camera-add"} style={{marginRight: "20px"}} />
                            {this.l("addPicture")}
                    </Ons.Button>
                </div>
            );
        }
    }

    renderOfferStatus() {
        if (this.props.currentUserIsLoaded) {
            return (
                <span style={{color: "green"}}>
                    <Ons.Icon icon={"md-check"} /> {this.l("saved")}
                </span>
            );
        } else {
            return (
                <span>
                    <Ons.Icon icon={"md-spinner"} /> {this.l("syncing")}
                </span>
            );
        }
    }

    render() {
        return (
            <Ons.Page>
                <Ons.List>
                    {this.renderGeofenceWarningListItem()}
                    <Ons.ListItem id='availablility-switch-li'>
                        <div className='left'>
                            <p>{this.props.currentUser.available ? this.l("available") : this.l("notAvailable")}</p>
                        </div>
                        <div className='right'>
                            <Ons.Switch
                                name="available"
                                checked={this.props.currentUser.available}
                                disabled={this.props.outOfGeofence ? "true" : false}
                                onChange={this.handleInputChange} />
                        </div>
                    </Ons.ListItem>

                    <Ons.ListItem id="offer-title-li">
                        <div className="list-item__title">
                            <b>{this.l("offerTitlePlaceholder")}</b>
                        </div>
                        <div className="list-item__subtitle">
                            <input type="text"
                                id="offerTitle"
                                name="offerTitle"
                                className="text-input text-input--transparent"
                                style={{width: "100%"}}
                                placeholder={this.l("offerTitlePlaceholder")}
                                value={this.props.currentUser.offerTitle}
                                onChange={this.handleInputChange}>
                            </input>
                        </div>
                    </Ons.ListItem>
                </Ons.List>

                <Ons.Row id="offer-picture-row">
                    <Ons.Col>
                        {this.renderImageArea()}
                    </Ons.Col>
                </Ons.Row>

                <Ons.List>
                    <Ons.ListItem id="offer-description-li">
                        <div className="list-item__title">
                            <b>{this.l("offerDescriptionPlaceholder")}</b>
                        </div>
                        <div>
                            <textarea
                                id="offerDescription"
                                name="offerDescription"
                                className="textarea textarea--transparent"
                                style={{width: "100%"}}
                                rows="3"
                                placeholder={this.l("offerDescriptionPlaceholder")}
                                value={this.props.currentUser.offerDescription}
                                onChange={this.handleInputChange}>
                            </textarea>
                        </div>
                    </Ons.ListItem>

                    <Ons.ListItem id="contact-information-li">
                        <div className="list-item__title">
                            <Ons.Row>
                                <Ons.Col width="80%">
                                    <b>{this.l("iCanBeContactedAt")}</b>
                                </Ons.Col>

                                <Ons.Col width="20%" style={{textAlign: "right"}}>
                                    <b><a href="#"
                                        style={{color: "black", marginRight: "10px"}}

                                        onClick={this.goToSettingsTab}>
                                            <Ons.Icon icon={"md-settings"} />
                                    </a></b>
                                </Ons.Col>
                            </Ons.Row>
                        </div>
                        <div className="list-item__subtitle">
                            {this.l("iCanBeContactedAtHelpText")}
                        </div>
                        <div>
                            {"TODO" || this.props.currentUser.contactInformation}
                        </div>
                    </Ons.ListItem>

                    <Ons.ListItem>
                        <div className="list-item__subtitle">
                            {this.renderOfferStatus()}
                        </div>
                    </Ons.ListItem>
                </Ons.List>
            </Ons.Page>
        )
    }
}

const offerFormComponent = <offerForm />

module.exports = {
    offerForm: offerForm,
    offerFormComponent: offerFormComponent
}
