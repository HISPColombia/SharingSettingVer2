
import React from 'react';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
const styles={
    content:{
        padding:'5%',
        width:'80%'
    }
}
class SearchTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 0 };
    }
    handleChangeValue(event, newValue) {
        this.props.source(newValue);
    }

    render() {
        return (
            <div style={styles.content}>
                <label>Add users and user groups</label>
                <TextField fullWidth={true}
                        multiLine={true}
                        onChange={()=>this.handleChangeValue()}
                />
                <List>
                    <ListItem primaryText="Inbox" />
                    <ListItem primaryText="Starred"/>
                    <ListItem primaryText="Inbox" />
                    <ListItem primaryText="Starred"/>

                </List>
            </div>
        )
    }
}
SearchTextBox.propTypes = {    
    color: React.PropTypes.string,
    source:React.PropTypes.func
};


export default SearchTextBox