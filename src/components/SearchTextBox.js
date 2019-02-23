
import React from 'react';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import Paper from 'material-ui/Paper';
const styles={
    content:{
        padding:'5%',
        width:'80%'
    },
    contentList:{
        position:'absolute',
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
        this.setState({ textValue: ''});
    }

    render() {
        var keycount=0;
        return (
            <div >
                
                <label style={{color:this.props.color}}>{this.props.title}</label>
     
                <TextField id={"valueSearch"} fullWidth={true}
                        multiLine={true}
                        onChange={this.handleChangeValue.bind(this)}
                        value={this.state.textValue}
                />
                <div style={this.state.value.length==0?styles.hideList:styles.contentList}>
                <Paper>
                    <List>
                        {this.state.value.map((val)=>{
                                keycount++
                                return(<ListItem onClick={()=>this.handleSelectOption(val)}  key={keycount} primaryText={val.displayName}/>)
                        })}
                    </List>
                </Paper> 
                </div>
      
            </div>
        )
    }
}
SearchTextBox.propTypes = {    
    color: React.PropTypes.string,
    source:React.PropTypes.func,
    title: React.PropTypes.string,
    callBackSelected:React.PropTypes.func,

};


export default SearchTextBox