
import React from 'react';
import Button from '@mui/material/Button';
import None from '@mui/icons-material/NotInterested';
import ActionDone from '@mui/icons-material/Done';
import ActionDoneAll from '@mui/icons-material/DoneAll';

class SpecialButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
      }
      handleClickButton(){
          switch(this.state.value){
            case 0:
                this.setState({value:1})
                this.props.callBackHandleClick({"id":this.props.id,"value":1,"type":this.props.type});

                break;
            case 1:
                this.setState({value:2})
                this.props.callBackHandleClick({"id":this.props.id,"value":2,"type":this.props.type});

                break;
            case 2:
                this.setState({value:0})
                this.props.callBackHandleClick({"id":this.props.id,"value":0,"type":this.props.type});
                break;
          }
      }
   componentDidMount(){
    this.setState({value:this.props.defaultValue})
   }
      render() {
        return (
            <div title={this.props.enabled?"":this.props.title}>
                <Button onClick={()=>this.handleClickButton()} icon={this.state.value==0? <None color={this.props.color}/>: this.state.value==1?<ActionDone color={this.props.color}/>: <ActionDoneAll color={this.props.color}/>} disabled={!this.props.enabled} />
            </div>
        )
    }
}
  
  export default SpecialButton