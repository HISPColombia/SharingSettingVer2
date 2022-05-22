
import React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/List';
import TextField from  '@mui/material/TextField';
import appTheme from '../theme';
import Paper from '@mui/material/Paper';
const styles={
    content:{
        padding:'5%',
        width:'80%'
    },
    contentList:{
        position:'absolute',
        zIndex: 1,
        backgroundColor:appTheme.palette.canvasColor,
        width: '35%'
    },
    hideList:{
        display:'none'
    }



    
}
class SearchTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: [],textValue:''}
     };
    
    handleChangeValue(event) {
        this.setState({textValue:event.target.value});
        if(event.target.value==""){
            this.setState({value:[]});
        }
        else{            
            this.props.source(event.target.value).then(res=>{
                this.setState({value:res});
            })
        }
    }
    handleSelectOption(valueSelected){
        this.props.callBackSelected(valueSelected);
        this.setState({ value: []});
        if(this.props.showValueSelected==false)
            this.setState({ textValue: ''});
        else 
            this.setState({ textValue: valueSelected.displayName});

    }

    render() {
        var keycount=0;
        return (
            <div style={{position: "relative"}} >
                
    
                <TextField 
                        id={"valueSearch"} 
                        fullWidth={true}
                        multiLine={true}
                        onChange={this.handleChangeValue.bind(this)}
                        label={this.props.disabled?"Select some option":this.state.textValue}
                        floatingLabelText={this.props.title}
                        variant="standard"
                        disabled={this.props.disabled}
                />
                <div style={this.state.value.length==0?styles.hideList:styles.contentList}>
                <Paper>
                    <List>
                        {this.state.value.map((val)=>{
                                keycount++
                                return(<ListItemText  onClick={()=>this.handleSelectOption(val)}  key={keycount} primary={val.displayName}/>)
                        })}
                    </List>
                </Paper> 
                </div>
      
            </div>
        )
    }
}


export default SearchTextBox