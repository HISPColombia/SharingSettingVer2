
import React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/List';
import TextField from '@mui/material/TextField';
import appTheme from '../theme';
import Autocomplete from '@mui/material/Autocomplete';

import Paper from '@mui/material/Paper';
const styles = {
    content: {
        padding: '5%',
        width: '80%'
    },
    contentList: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: appTheme.palette.canvasColor,
        width: '35%'
    },
    hideList: {
        display: 'none'
    }




}
class SearchTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: [], textValue: '' }
    };

    handleChangeValue(event,valueSelected) {
        this.setState({ textValue: event.target.value });
        if (event.target.value == "") {
            this.setState({ value: [] });
        }
        else {
            this.props.source(event.target.value).then(res => {
                this.setState({ value: res });
            })
        }
    }
    handleSelectOption(e,value,reason) {
       if(reason==="selectOption"){
            this.props.callBackSelected(value);
            this.setState({ value: [] });
            if (this.props.showValueSelected == false)
                this.setState({ textValue: '' });
            else
                this.setState({ textValue: value.label });
       }

    }

    render() {
        var keycount = 0;
        return (
            <div style={{ position: "relative" }} >
                <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={this.state.value}
                        sx={{ width: 400 }}     
                        onInputChange={(e,value) =>this.handleChangeValue(e,value)}                       
                        onChange={(e,value,reason) => this.handleSelectOption(e,value,reason)}                   
                        renderInput={(params) => <TextField {...params} 
                        label={this.props.disabled ? "Select some option" : this.props.title}
                        variant="standard"
                        disabled={this.props.disabled}
                        
                        />}
                    />

                {/* <TextField
                    id={"valueSearch"}
                    fullWidth={true}
                    multiLine={true}
                    onChange={this.handleChangeValue.bind(this)}
                    label={this.props.disabled ? "Select some option" : this.props.title}
                    variant="standard"
                    disabled={this.props.disabled}
                />
                <div style={this.state.value.length == 0 ? styles.hideList : styles.contentList}>
                    <Paper>
                        <List>
                            {this.state.value.map((val) => {
                                keycount++
                                console.log(val)
                                return (<ListItemText onClick={() => this.handleSelectOption(val)} key={keycount} primary={val.displayName} />)
                            })}
                        </List>
                    </Paper>
                </div> */}

            </div>
        )
    }
}


export default SearchTextBox